defmodule Phoestit.Notes do
  @moduledoc """
  Stores notes' state and updates the state to database after stopped 
  receiving updates to notes.
  """

  require Logger

  import Ecto.Query
  alias Phoestit.Repo
  alias Phoestit.Note
  alias Phoestit.Watchdog

  defp initial_notes do
    notes = Repo.all(Note)
    Enum.reduce(notes,
                HashDict.new,
                fn(note, acc) ->
                  id = Integer.to_string(note.id)
                  HashDict.put(acc, id, %{
                      "contents" => note.contents,
                      "position" => %{
                          "x" => note.x,
                          "y" => note.y,
                      },
                      "size" => %{
                          "width" => note.width,
                          "height" => note.height
                      }
                    }
                  ) 
                end)
  end

  def start_link do
    pid = spawn_link(fn -> db_updater() end)

    # Start watchdog for triggering database updates after no more updates
    # are received from connected browsers
    Watchdog.start_link(:note_watchdog, pid)
    Agent.start_link(fn -> initial_notes end, name: __MODULE__)
  end

  @doc """
  Returns all notes
  """
  def get do
    Agent.get(__MODULE__, fn dict -> dict end)
  end

  @doc """
  Returns a note by id
  """
  def get(id) do
    Agent.get(__MODULE__, fn dict -> HashDict.get(dict, id) end)
  end

  @doc """
  Updates note by id with new values
  """
  def update(id, value) do
    try do
      Agent.update(
        __MODULE__,
        fn dict ->
          HashDict.update!(dict, id, fn(note) -> Map.merge(note, value) end)
        end
      )
      trigger_db_update
    rescue
      KeyError -> Logger.warn("Tried to update note with ID " <> 
                              id <> 
                              " which does not exist")
    end
  end

  defp newId(dict) do
    (["0" | HashDict.keys(dict)]
      |> Enum.map(fn(val) -> Integer.parse(val) |> elem(0) end)
      |> Enum.max) + 1
  end

  @doc """
  Creates a new note
  """
  def new(values) do
    generatedId = Agent.get_and_update(__MODULE__,
      fn dict ->
        id = newId(dict) |> Integer.to_string
        {id, HashDict.put(dict, id, values)}
       end
    )

    trigger_db_update

    generatedId
  end

  @doc """
  Deletes a note
  """
  def delete(id) do
    Agent.update(__MODULE__, &HashDict.delete(&1, id))
    trigger_db_update
  end

  defp db_updater do
    receive do
      {:timeout} ->
        save_state_to_db
        db_updater
    end
  end

  defp save_dict_to_db(dict) do
    Repo.transaction fn ->
      # Remove deleted notes
      ids = HashDict.keys(dict)
      from(note in Note, where: not note.id in ^ids) 
        |> Repo.delete_all

      # Then update or insert the present notes
      Enum.map(ids, fn(id) ->
          note = HashDict.get(dict, id)
          contents = note["contents"]
          position = note["position"]
          size = note["size"]

          params = %{
            contents: contents,
            x: position["x"],
            y: position["y"],
            width: size["width"],
            height: size["height"]
          }

          idInt = Integer.parse(id) |> elem(0)
          changeset = Note.changeset(%Note{id: idInt}, params)

          case Repo.get(Note, idInt) do
            nil        -> Repo.insert(changeset)
            noteExists -> Repo.update(changeset)
          end
        end
      )
    end
  end

  defp save_state_to_db do
    Logger.debug "Storing state to database"
    Agent.get(__MODULE__, fn dict -> save_dict_to_db dict end)
  end

  defp trigger_db_update do
    Watchdog.feed(:note_watchdog)
  end
end
