import React from 'react';
import Component from './Component';

class AddCreature extends Component {
  state = {
    damage: ''
  };

  onChangeDamage = event => {
    const { value } = event.target;
    this.updateState({ damage: parseInt(value) });
  };

  onClick = () => {
    const { onDamage } = this.props;
    onDamage(this.state);
  };

  render() {
    const { damage } = this.state;
    return (
      <span>
        <input type="number" value={damage} onChange={this.onChangeDamage} placeholder="Damage" />
        <button onClick={this.onClick}>Damage Current</button>
      </span>
    );
  }
}

export default AddCreature;
