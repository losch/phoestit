import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import CircularProgress from 'material-ui/lib/circular-progress';
import Dialog from 'material-ui/lib/dialog';

/**
 * On mounting displays a modal dialog with a message telling that
 * the connection to server has been lost
 * @returns {function} - Function that creates the dialog
 */
export default () => {
  let dialogStyle = {
    maxWidth: '350px'
  };

  let textStyle = {
    textAlign: 'center'
  };

  let progressStyle = {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  return (
    <Dialog contentStyle={dialogStyle}
            defaultOpen={true}
            modal={true}>
      <div style={textStyle}>Connection lost! Reconnecting...</div>
      <CircularProgress style={progressStyle} mode="indeterminate" size={1} />
    </Dialog>
  );
}
