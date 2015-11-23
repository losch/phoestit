import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import { Motion, spring } from 'react-motion';
import Draggable from './Draggable';
import TextArea from './Textarea';
import Mouse from '../constants/mouse';

const FlatButton = require('material-ui/lib/flat-button');

const MOUSE_CLICK_DELAY = 100; // ms
const CONTENTS_CHANGE_DELAY = 200; // ms
const DIMENSION_CHANGE_DELAY = 200; // ms

/**
 * Draggable, resizable, editable and deletable note component
 */
export default class Note extends Component {
  constructor(props) {
    super(props);
    this.state = { isEditing: false };

    // Throttle the callback functions for keeping the application performant

    this._throttledOnContentsChange = _.throttle(
      this.props.onContentsChange, CONTENTS_CHANGE_DELAY
    );

    this._throttledOnPositionChange = _.throttle(
      this.props.onPositionChange, DIMENSION_CHANGE_DELAY
    );

    this._throttledOnSizeChange = _.throttle(
      this.props.onSizeChange, DIMENSION_CHANGE_DELAY
    );

    this.onMouseDown = (e) => this._onMouseDown(e);
  }

  componentWillUnmount() {
    // Don't leak event listeners
    document.removeEventListener('mousedown', this.onMouseDown);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.position.x !== nextProps.position.x ||
            this.props.position.y !== nextProps.position.y ||
            this.props.size.width !== nextProps.size.width ||
            this.props.size.height !== nextProps.size.height ||
            this.props.contents !== nextProps.contents ||
            this.state.isEditing !== nextState.isEditing);
  }

  render() {
    let { id, size, position, contents, onDelete } = this.props;
    let { isEditing } = this.state;

    let noteStyle = {
      position: 'absolute',
      cursor: 'pointer',
      backgroundColor: '#E0F2F1'
    };

    let idStyle = {
      position: 'absolute',
      left: '5px',
      top: '2px',
      color: '#26A69A',
      fontSize: '12px'
    };

    let deleteButtonStyle = {
      position: 'absolute',
      right: '5px',
      top: '3px',
      fontSize: '10px',
      lineHeight: '25px',
      minWidth: '15px'
    };

    return (
      <Motion style={{
                      x: spring(position.x, [120, 17]),
                      y: spring(position.y, [120, 17]),
                      width: spring(size.width, [60, 7]),
                      height: spring(size.height, [60, 7])
                     }}>
        { interpolation =>
          <Draggable initialPosition={{x: interpolation.x,
                                       y: interpolation.y}}
                     initialSize={{width: interpolation.width,
                                   height: interpolation.height}}
                     style={noteStyle}
                     onMove={position => this._onMove(position)}
                     onResize={size => this._onResize(size)}>
            <div style={{width: '100%', height: '100%'}}
                 onMouseDown={e => this.onMouseDown(e)}
                 onMouseUp={() => this._startEditing()}>
              { isEditing ? <div style={idStyle}>#{id}</div> : undefined }
              <TextArea
                isEditing={isEditing}
                value={contents}
                onChange={contents => this._onContentsChange(contents)} />
              { isEditing ? <FlatButton style={deleteButtonStyle}
                                        secondary={true}
                                        label="X"
                                        onClick={() => onDelete(id)} /> :
                            undefined }
            </div>
          </Draggable>
        }
      </Motion>
    );
  }

  _onResize(size) {
    this._throttledOnSizeChange(size);
  }

  _onMove(position) {
    this._throttledOnPositionChange(position);
  }

  _onContentsChange(contents) {
    this._throttledOnContentsChange(contents);
  }

  _onMouseDown(e) {
    if (e.button !== Mouse.LEFT_BUTTON) {
      return;
    }

    this._mouseDownTime = new Date();

    // FIXME: This most likely fails if the render function is changed :-)
    //        Anyway, the idea is to stop editing if click was outside of
    //        the note.
    let thisElem = ReactDom.findDOMNode(this);
    if (e.target !== thisElem &&
        e.target.parentNode !== thisElem &&
        e.target.parentNode.parentNode !== thisElem &&
        e.target.parentNode.parentNode.parentNode !== thisElem &&
        e.target.parentNode.parentNode.parentNode.parentNode !== thisElem) {
      this._stopEditing();
    }
  }

  _startEditing() {
    // Determine based on mouse click's duration whether the note is being
    // dragged or if editing mode should be entered
    let now = new Date();
    if (!this.state.isEditing) {
      if (now - this._mouseDownTime < MOUSE_CLICK_DELAY) {
        // Install mouse down handler when going to editing mode and then
        // remove it afterwards when exiting the editing mode
        document.addEventListener('mousedown', this.onMouseDown);
        this.setState({ isEditing: true });
      }
    }
  }

  _stopEditing() {
    if (this.state.isEditing) {
      document.removeEventListener('mousedown', this.onMouseDown);
      this.setState({ isEditing: false });
    }
  }
}

Note.propTypes = {
  // Note's position
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }),

  // Note's size
  size: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }),

  // Note's contents
  contents: PropTypes.string.isRequired,

  // Callback functions which are called when note's attributes are changed
  onContentsChange: PropTypes.func.isRequired,
  onPositionChange: PropTypes.func.isRequired,
  onSizeChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};
