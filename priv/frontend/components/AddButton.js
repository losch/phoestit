import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';

const RaisedButton = require('material-ui/lib/raised-button');

let AddButton = ({onClick, text, style}) => {
  return (
    <RaisedButton style={style}
                  primary={true}
                  label={text}
                  onClick={onClick} />
  );
};

export default AddButton;
