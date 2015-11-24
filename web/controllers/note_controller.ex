defmodule Phoestit.NoteController do
  use Phoestit.Web, :controller
  alias Phoestit.Notes

  def update(conn, %{"id" => api_id, "contents" => contents}) do
    # TODO: refactor this and updates from channel to some common place
    case Notes.getByApiId(api_id) do
      {id, _} ->
        Notes.update(id, %{"contents" => contents})
        Phoestit.Endpoint.broadcast("rooms:lobby",
                                    "contents_changed",
                                    %{id: id, contents: contents})
        json conn, %{"ok" => "Note updated"}

      _ ->
        json conn, %{"error" => "No such note found"}
    end
  end
end
