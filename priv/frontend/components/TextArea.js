import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import { Motion, spring } from 'react-motion';
import marked from 'marked';

/**
 * Editable text area with markdown support
 */
export default class TextArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };
  }

  componentWillReceiveProps(nextProps) {
    // If received new contents via props, then update the internal state
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  componentDidUpdate(prevProps) {
    // Focus if switched to editing mode
    if (!prevProps.isEditing && this.props.isEditing) {
      ReactDom.findDOMNode(this).focus();
    }
  }

  _rawMarkup() {
    return { __html: marked(this.state.value, {sanitize: true}) };
  }

  render() {
    let { value } = this.state;
    let { isEditing } = this.props;

    let textAreaStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '5px',
      resize: 'none',
      width: '100%',
      height: '100%',
      overflow: 'auto'
    };

    if (isEditing) {
      textAreaStyle['fontFamily'] = 'monospace';
      textAreaStyle['padding'] = '30px 5px 0px 5px';
    }

    return isEditing ?
      <textarea type='text'
                className='note-textarea'
                style={textAreaStyle}
                onChange={(e) => this._onChange(e)}
                value={value} />
      :
      <div style={textAreaStyle}
           className='note-textarea noselect'>
          <div className='note-markdown'
               dangerouslySetInnerHTML={this._rawMarkup()}></div>
      </div>;
  }

  _onChange(e) {
    let value = e.target.value;
    this.setState({
      value: value
    });
    this.props.onChange(value);
  }
}

TextArea.propTypes = {
  // Is in editing mode?
  isEditing: PropTypes.bool.isRequired,

  // Text area's value
  value: PropTypes.string.isRequired,

  // Callback which gets called when the text area's contents are changed
  onChange: PropTypes.func.isRequired
};
