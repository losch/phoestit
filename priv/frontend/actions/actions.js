'use strict';

import { withSocket, withChannel, push } from '../api/sockets';

// Connection action types
export const CONNECTED = 'CONNECTED';
export const DISCONNECTED = 'DISCONNECTED';

// Note action types
export const POSITION_RECEIVED = 'POSITION_RECEIVED';
export const SIZE_RECEIVED = 'SIZE_RECEIVED';
export const CONTENTS_RECEIVED = 'CONTENTS_RECEIVED';
export const NOTES_RECEIVED = 'NOTES_RECEIVED';
export const NOTE_CREATED = 'NOTE_CREATED';
export const NOTE_DELETED = 'NOTE_DELETED';

function connectedAction() {
  return { type: CONNECTED };
}

function disconnectedAction() {
  return { type: DISCONNECTED };
}

function notesReceivedAction(notes) {
  return { type: NOTES_RECEIVED, notes };
}

function noteContentsReceivedAction(id, contents) {
  return { type: CONTENTS_RECEIVED, id, contents };
}

function noteMovedAction(id, position) {
  return { type: POSITION_RECEIVED, id, position };
}

function noteResizedAction(id, size) {
  return { type: SIZE_RECEIVED, id, size };
}

function newNoteAction(id, contents, position, size) {
  return { type: NOTE_CREATED, id, contents, position, size };
}

function noteDeletedAction(id) {
  return { type: NOTE_DELETED, id };
}

export function changeContents(id, contents) {
  push('contents_changed', {id: id, contents: contents});
}

export function changePosition(id, position) {
  push('note_moved', {id: id, position: position});
}

export function changeSize(id, size) {
  push('note_resized', {id: id, size: size});
}

export function createNote(contents, position, size) {
  push('new_note', {contents: contents, position: position, size: size});
}

export function deleteNote(id) {
  push('delete_note', {id: id});
}

export function channelListener(dispatch) {
  withChannel(channel => {
    channel.join()
      .receive('ok', resp => {
        dispatch(connectedAction());
        dispatch(notesReceivedAction(resp.notes));
      })
      .receive('fail', resp => {
        console.error('Failed to join channel!');
        // TODO: display an error message
      });

    channel.on('contents_changed', resp => {
      dispatch(noteContentsReceivedAction(resp.id, resp.contents));
    });

    channel.on('note_moved', resp => {
      dispatch(noteMovedAction(resp.id, resp.position));
    });

    channel.on('note_resized', resp => {
      dispatch(noteResizedAction(resp.id, resp.size));
    });

    channel.on('new_note', resp => {
      dispatch(newNoteAction(resp.id, resp.contents, resp.position, resp.size));
    });

    channel.on('delete_note', resp => {
      dispatch(noteDeletedAction(resp.id));
    });
  });

  withSocket(socket => {
    socket.onClose(() => {
      dispatch(disconnectedAction());
    });
  })
}
