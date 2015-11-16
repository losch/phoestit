import { POSITION_RECEIVED,
         SIZE_RECEIVED,
         CONTENTS_RECEIVED,
         NOTES_RECEIVED,
         NOTE_CREATED,
         NOTE_DELETED } from '../actions/actions.js';

var initialState = {};

/**
 * Adds a new note to the current state
 * @param {object} notes - Current notes
 * @param {string} id - Note's ID
 * @param {string} contents - Note's contents
 * @param {object} position - Note's position, x and y
 * @param {object} size - Note's size, width and height
 * @returns {object} - Next state
 */
function createNote(notes, id, contents, position, size) {
  let newNotes = Object.assign({}, notes);
  newNotes[id] = {
    contents: contents,
    position: position,
    size: size
  };
  return newNotes;
}

/**
 * Deletes a note
 * @param {object} notes - Current notes
 * @param {string} id - Note's ID
 * @returns {object} - Next state
 */
function deleteNote(notes, id) {
  let newNotes = Object.assign({}, notes);
  delete newNotes[id];
  return newNotes;
}

/**
 * Edits a note
 * @param {object} notes - Current notes
 * @param {string} id - Note's ID
 * @param {object} updates - Updates that should be applied to the note
 * @returns {object} - Next state
 */
function editNoteById(notes, id, updates) {
  let note = notes[id];
  if (note) {
    let noteUpdates = {};
    noteUpdates[id] = Object.assign({}, note, updates);
    return Object.assign({}, notes, noteUpdates);
  }
  else {
    return notes;
  }
}

/**
 * Stores notes' state
 * @param state - Current notes' state
 * @param action - Received action
 * @returns {Object} - Next state
 */
export default function notes(state = initialState, action = null) {
  switch (action.type) {
    case POSITION_RECEIVED:
      return editNoteById(state, action.id, {position: action.position});

    case SIZE_RECEIVED:
      return editNoteById(state, action.id, {size: action.size});

    case CONTENTS_RECEIVED:
      return editNoteById(state, action.id, {contents: action.contents});

    case NOTES_RECEIVED:
      return action.notes;

    case NOTE_CREATED:
      return createNote(state,
                        action.id,
                        action.contents,
                        action.position,
                        action.size);

    case NOTE_DELETED:
      return deleteNote(state, action.id);

    default:
      return state;
  }
}
