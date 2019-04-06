import React from 'react';

import Component from './Component';

import { asyncIterator } from 'lazy-iters';
import { importAllObjects } from '../util/data';
import { convertCreature } from '../util/creature';

class Loader extends Component {
  state = {
    data: []
  };

  async componentDidMount() {
    const { urls } = this.props;
    const data = await asyncIterator(importAllObjects(urls))
      .map(convertCreature)
      .collect();
    console.log(`Loaded ${data.length} creatures.`);
    this.updateState({ data });
  }

  render() {
    const { Component, componentProps = {} } = this.props;
    const { data } = this.state;
    return (
      <div className="root">
        <Component data={data} {...componentProps} />
      </div>
    );
  }
}

export default Loader;
