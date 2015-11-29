'use strict';

import { withSocket, withChannel, push } from '../api/sockets';

// Connection action types
export const CONNECTED = 'CONNECTED';
export const DISCONNECTED = 'DISCONNECTED';

// Client version
export const CLIENT_VERSION_RECEIVED = 'CLIENT_VERSION_RECEIVED';

// Note action types
export const POSITION_RECEIVED = 'POSITION_RECEIVED';
export const SIZE_RECEIVED = 'SIZE_RECEIVED';
export const CONTENTS_RECEIVED = 'CONTENTS_RECEIVED';
export const NOTES_RECEIVED = 'NOTES_RECEIVED';
export const NOTE_CREATED = 'NOTE_CREATED';
export const NOTE_DELETED = 'NOTE_DELETED';
export const NOTE_API_ID_CHANGED = 'NOTE_API_ID_CHANGED';

// View mode actions
export const VIEW_DIMENSIONS_CHANGED = 'VIEW_DIMENSIONS_CHANGED';

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

function noteApiIdChanged(id, apiId) {
  return { type: NOTE_API_ID_CHANGED, id, apiId };
}

function viewDimensionsChangedAction(width, height) {
  return { type: VIEW_DIMENSIONS_CHANGED, width, height };
}

function clientVersionReceived(clientVersion) {
  return { type: CLIENT_VERSION_RECEIVED, clientVersion };
}

/*
 * Client -> server
 */

export function changeContents(id, contents) {
  push('contents_changed', {id: id, contents: contents});
}

export function changePosition(id, position) {
  push('note_moved', {id: id, position: position});
}

export function changeSize(id, size) {
  push('note_resized', {id: id, size: size});
}

export function changeApiId(id, apiId) {
  push('note_api_id_changed', {id: id, api_id: apiId});
}

export function createNote(contents, position, size) {
  push('new_note', {contents: contents, position: position, size: size});
}

export function deleteNote(id) {
  push('delete_note', {id: id});
}

export function announceViewDimensions(width, height) {
  push('view_dimensions', {width: width, height: height});
}


/*
 * Server -> client
 */

export function channelListener(dispatch, callback) {
  withChannel(channel => {
    channel.join()
      .receive('ok', resp => {
        dispatch(connectedAction());
        dispatch(notesReceivedAction(resp.notes));
        dispatch(viewDimensionsChangedAction(resp.dimensions.width,
                                             resp.dimensions.height));
        dispatch(clientVersionReceived(resp.clientVersion));
        callback();
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

    channel.on('note_api_id_changed', resp => {
      dispatch(noteApiIdChanged(resp.id, resp.api_id));
    });

    channel.on('new_note', resp => {
      dispatch(newNoteAction(resp.id, resp.contents, resp.position, resp.size));
    });

    channel.on('delete_note', resp => {
      dispatch(noteDeletedAction(resp.id));
    });

    channel.on('view_dimensions', resp => {
      dispatch(viewDimensionsChangedAction(resp.width, resp.height));
    })
  });

  withSocket(socket => {
    socket.onClose(() => {
      dispatch(disconnectedAction());
    });
  })
}
