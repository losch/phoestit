import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { announceViewDimensions,
         channelListener,
         changeContents,
         changePosition,
         changeSize,
         createNote,
         deleteNote } from '../actions/actions';
import ConnectionLostDialog from './ConnectionLostDialog';
import AreaIndicator from '../components/AreaIndicator';
import Note from '../components/Note';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import Theme from './Theme';
import AddButton from '../components/AddButton';
import { getRandomInt } from '../utils/random';

// Delay before pushing dimension updates
const RESIZE_DELAY = 500; // ms

/**
 * Application component which renders the application
 */
class App extends Component {
  constructor(props) {
    super(props);

    this.resizeListener =
      _.debounce(() => this.announceDimensions(), RESIZE_DELAY);

    channelListener(this.props.dispatch, () => {
      if (this.isViewOnly()) {
        this.announceDimensions();
        window.addEventListener('resize', this.resizeListener, true);
      }
    });
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(Theme)
    };
  }

  componentWillUnmount() {
    if (this.isViewOnly()) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  isViewOnly() {
    return this.props.params.view === 'view';
  }

  announceDimensions() {
    // Detect and announce the visible area's dimensions
    let { documentElement } = document;
    let { clientWidth, clientHeight } = documentElement;

    var width = Math.max(clientWidth, window.innerWidth || 0);
    var height = Math.max(clientHeight, window.innerHeight || 0);

    announceViewDimensions(width, height)
  }

  static findMinDimensions_(notes, minX, minY) {
    let maxX = minX;
    let maxY = minY;

    let noteKeys = Object.keys(notes);
    for (let i = 0; i < noteKeys.length; i++) {
      let key = noteKeys[i];
      let note = notes[key];
      let x = note.position.x + note.size.width;
      let y = note.position.y + note.size.height;

      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }

    return {
      width: maxX,
      height: maxY
    };
  }

  render() {
    const { connection, notes, viewarea } = this.props;

    let minDimensions =
      App.findMinDimensions_(notes, viewarea.width, viewarea.height);

    let appStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      minHeight: minDimensions.height,
      minWidth: minDimensions.width,
      backgroundColor: '#B2DFDB'
    };

    if (this.isViewOnly()) {
      appStyle['minWidth'] = viewarea.width;
      appStyle['minHeight'] = viewarea.height;
      appStyle['overflow'] = 'hidden';
    }

    let addNoteStyle = {
      position: 'fixed',
      bottom: '5px',
      right: '5px'
    };

    return (
      <div style={appStyle}>
        { !this.isViewOnly() ?
          <AreaIndicator width={viewarea.width} height={viewarea.height} /> :
          undefined }
        {App._renderNotes(notes)}
        { !this.isViewOnly() ?
          <AddButton onClick={App.onCreateNote}
                     text='New note'
                     style={addNoteStyle} /> : undefined }
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
    notes: state.notes,
    viewarea: state.viewarea
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(App);
