import React from 'react';

import Component from './Component';

import { asyncIterator, iterator } from 'lazy-iters';
import { importAllObjects } from '../util/data';
import { convertCreature, extendCreature } from '../util/creature';

class Loader extends Component {
  state = {
    data: []
  };

  async componentDidMount() {
    const { urls } = this.props;
    let data = await asyncIterator(importAllObjects(urls))
      .map(creature => {
        const copied = { ...creature };
        delete copied.mustExtend;
        return copied;
      })
      .map(convertCreature)
      .collect();

    // Handle creature inheritance
    data = iterator(data)
      .map(creature =>
        creature.mustExtend ? extendCreature(creature, creature['extends'], data) : creature
      )
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
