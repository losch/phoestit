import { CLIENT_VERSION_RECEIVED } from '../actions/actions.js';

const initialState = {
  // Is client version outdated compared to server's version?
  isOutdated: false,

  // Client version hash
  versionHash: ''
};

/**
 * Stores the client version and information whether the current version is
 * outdated.
 *
 * @param {object} state - Client version state
 * @param action - Received action
 * @returns {object} - Next state
 */
export default function connection(state = initialState, action = null) {
  switch (action.type) {
    case CLIENT_VERSION_RECEIVED:
      let newState = {
        isOutdated: false,
        versionHash: action.clientVersion
      };

      // Version on server hash changed, this client version is not up-to-date
      // anymore
      if (state.versionHash !== '' &&
          newState.versionHash !== state.versionHash) {
        newState.isOutdated = true;
      }

      return newState;

    default:
      return state;
  }
}
