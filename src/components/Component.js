import React from 'react';

class Component extends React.Component {
  updateState(changes) {
    this.setState({
      ...this.state,
      ...changes
    });
  }
}

export default Component;
