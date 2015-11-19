import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';

const RaisedButton = require('material-ui/lib/raised-button');

export default class AddButton extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    let { style, text, onClick } = this.props;

    return (
      <RaisedButton style={style}
                    primary={true}
                    label={text}
                    onClick={onClick} />
    );
  }
}
