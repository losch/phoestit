import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import Mouse from '../constants/mouse';

/**
 * Makes anything inside this component draggable and resizable
 */
export default class Draggable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      position: this.props.initialPosition,
      size: this.props.initialSize,
      isDragging: false,
      isResizing: false,
      relative: null
    };

    // Bind "this" for event handling functions. Required for adding and
    // removing event handlers.
    this.onMouseDown = (e) => this._onMouseDown(e);
    this.onMouseUp = (e) => this._onMouseUp(e);
    this.onMouseMove = (e) => this._onMouseMove(e);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isDragging && !prevState.isDragging ||
        this.state.isResizing && !prevState.isResizing) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }
    else if (!this.state.isDragging && prevState.isDragging ||
             !this.state.isResizing && prevState.isResizing) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  componentWillReceiveProps(nextProps) {
    // Update position, if new coordinates have been received for this
    // component
    if (this.props.initialPosition.x != nextProps.initialPosition.x ||
        this.props.initialPosition.y != nextProps.initialPosition.y) {
      this.setState({
        position: nextProps.initialPosition
      });
    }
    if (this.props.initialSize.width != nextProps.initialSize.width ||
        this.props.initialSize.height != nextProps.initialSize.height) {
      this.setState({
        size: nextProps.initialSize
      });
    }
  }

  componentWillUnmount() {
    // Clean event handlers
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  _onMouseDown(e) {
    if (e.button !== Mouse.LEFT_BUTTON) {
      return;
    }

    let thisNode = ReactDom.findDOMNode(this);
    let elemRect = thisNode.getBoundingClientRect();

    // Resizing
    if (e.target.className === 'resizeHandle') {
      this.setState({
        isResizing: true,
        relative: {
          x: e.pageX - this.state.size.width,
          y: e.pageY - this.state.size.height
        }
      });

      e.stopPropagation();
      e.preventDefault();
    }
    // Dragging
    else {
      let { scrollLeft, scrollTop } = document.documentElement;
      this.setState({
        isDragging: true,
        relative: {
          x: e.pageX - elemRect.left - scrollLeft,
          y: e.pageY - elemRect.top - scrollTop
        }
      });
    }
  }

  _onMouseUp(e) {
    this.setState({
      isDragging: false,
      isResizing: false
    });

    e.stopPropagation();
    e.preventDefault();
  }

  _onMouseMove(e) {
    // Dragging
    if (this.state.isDragging) {
      let newPosition = {
        x: e.pageX - this.state.relative.x,
        y: e.pageY - this.state.relative.y
      };

      this.setState({
        position: newPosition
      });

      if (this.props.onMove) {
        this.props.onMove(newPosition);
      }

      e.stopPropagation();
      e.preventDefault();
    }
    // Resizing
    else if (this.state.isResizing) {
      let newSize = {
        width: e.pageX - this.state.relative.x,
        height: e.pageY - this.state.relative.y
      };

      this.setState({
        size: newSize
      });

      if (this.props.onResize) {
        this.props.onResize(newSize);
      }

      e.stopPropagation();
      e.preventDefault();
    }
  }

  render() {
    let draggableStyle = Object.assign({}, this.props.style, {
      left: this.state.position.x + 'px',
      top: this.state.position.y + 'px',
      width: this.state.size.width + 'px',
      height: this.state.size.height + 'px'
    });

    let handleStyle = {
      position: 'absolute',
      right: '0px',
      bottom: '0px',
      width: '10px',
      height: '10px',
      backgroundColor: '#80CBC4'
    };

    return (
      <div onMouseDown={this.onMouseDown} style={draggableStyle}>
        {this.props.children}
        <div onMouseDown={this.onMouseDown}
             style={handleStyle}
             className='resizeHandle'>&nbsp;</div>
      </div>
    );
  }
}

Draggable.propTypes = {
  // Initial position for the draggable component
  initialPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,

  // Initial size for the draggable component
  initialSize: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,

  // Callback function for listening to move events
  onMove: PropTypes.func,
  onResize: PropTypes.func
};
