import { CONNECTED, DISCONNECTED } from '../actions/actions.js';

/**
 * Stores the connection's state. The state can be either 'connected' or
 * 'disconnected'.
 *
 * @param {string} state - Connection state
 * @param action - Received action
 * @returns {string} - Next state
 */
export default function connection(state = 'connected', action = null) {
  switch (action.type) {
    case CONNECTED:
      return 'connected';

    case DISCONNECTED:
      return 'disconnected';

    default:
      return state;
  }
}
