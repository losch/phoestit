import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { channelListener,
         changeContents,
         changePosition,
         changeSize,
         createNote,
         deleteNote } from '../actions/actions';
import ConnectionLostDialog from './ConnectionLostDialog';
import Note from '../components/Note';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import Theme from './Theme';
import AddButton from '../components/AddButton';
import { getRandomInt } from '../utils/random';

/**
 * Application component which renders the application
 */
class App extends Component {
  constructor(props) {
    super(props);
    channelListener(this.props.dispatch);
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(Theme)
    };
  }

  render() {
    const { connection, notes } = this.props;

    let appStyle = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#B2DFDB'
    };

    let addNoteStyle = {
      position: 'absolute',
      bottom: '5px',
      right: '5px'
    };

    return (
      <div style={appStyle}>
        {App._renderNotes(notes)}
        <AddButton onClick={App.onCreateNote}
                   text='New note'
                   style={addNoteStyle} />
        { connection === 'disconnected' ? <ConnectionLostDialog /> : undefined }
      </div>
    );
  }

  static _renderNotes(notes) {
    let noteKeys = Object.keys(notes);
    let noteComponents = [];
    for (let i = 0; i < noteKeys.length; i++) {
      let key = noteKeys[i];
      let note = notes[key];
      if (note) {
        noteComponents.push(
          <Note id={key}
                key={key}
                contents={note.contents}
                position={note.position}
                size={note.size}
                onContentsChange={(contents) => changeContents(key, contents)}
                onPositionChange={(position) => changePosition(key, position)}
                onSizeChange={(size) => changeSize(key, size)}
                onDelete={App.onDeleteNote}
            />);
      }
    }
    return noteComponents;
  }

  static onCreateNote() {
    // Just create the new note randomly somewhere with empty contents and
    // send a request to the server for actually creating the note
    createNote('', {
      x: getRandomInt(0, 300),
      y: getRandomInt(0, 300)
    }, {
      width: 200,
      height: 200
    })
  }

  static onDeleteNote(id) {
    deleteNote(id);
  }
}

App.childContextTypes = {
  muiTheme: React.PropTypes.object
};

function select(state) {
  return {
    connection: state.connection,
    notes: state.notes
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(App);
