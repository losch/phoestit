import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';

/**
 * Indicator for view-only display's size
 */
export default class AreaIndicator extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.width !== nextProps.width ||
      this.props.height !== nextProps.height
    );
  }

  render() {
    const { width, height } = this.props;

    const areaStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: width,
      height: height,
      borderWidth: '1px',
      borderColor: 'gray',
      borderBottomStyle: 'dashed',
      borderRightStyle: 'dashed'
    };

    return <div style={areaStyle}/>;
  }
}

AreaIndicator.propTypes = {
  // Viewable area's dimensions
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};
