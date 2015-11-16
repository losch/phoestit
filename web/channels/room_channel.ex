defmodule Phoestit.RoomChannel do
  use Phoenix.Channel

  def join("rooms:lobby", _message, socket) do
    notes = Phoestit.Notes.get()
    state = %{notes: notes}
    {:ok, state, socket}
  end

  def join("rooms:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("contents_changed",
                %{"id" => id, "contents" => contents},
                socket) do
    Phoestit.Notes.update(id, %{"contents" => contents})
    broadcast_from! socket, "contents_changed", %{id: id, contents: contents}
    {:noreply, socket}
  end

  def handle_in("note_moved", %{"id" => id, "position" => position}, socket) do
    Phoestit.Notes.update(id, %{"position" => position})
    broadcast_from! socket, "note_moved", %{id: id, position: position}
    {:noreply, socket}
  end

  def handle_in("note_resized", %{"id" => id, "size" => size}, socket) do
    Phoestit.Notes.update(id, %{"size" => size})
    broadcast_from! socket, "note_resized", %{id: id, size: size}
    {:noreply, socket}
  end

  def handle_in("new_note",
                %{"contents" => contents, 
                  "position" => position, 
                  "size" => size},
                socket) do
    id = Phoestit.Notes.new(%{"contents" => contents,
                              "position" => position,
                              "size" => size})
    broadcast! socket,
               "new_note",
               %{id: id, contents: contents, position: position, size: size}
    {:noreply, socket}
  end

  def handle_in("delete_note", %{"id" => id}, socket) do
    Phoestit.Notes.delete(id)
    broadcast! socket, "delete_note", %{id: id}
    {:noreply, socket}
  end
end
