import { VIEW_DIMENSIONS_CHANGED } from '../actions/actions.js';

/**
 * Stores the viewed area's state
 *
 * @param {object} state - Viewed area's state
 * @param action - Received action
 * @returns {object} - Next state
 */
export default function viewarea(state = {width: 0, height: 0}, action = null) {
  switch (action.type) {
    case VIEW_DIMENSIONS_CHANGED:
      return {width: action.width, height: action.height};

    default:
      return state;
  }
}
