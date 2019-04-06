import React from 'react';
import Component from './Component';

class AddCreature extends Component {
  state = {
    name: '',
    initiative: ''
  };

  onChangeName = event => {
    const { value } = event.target;
    this.updateState({ name: value });
  };

  onChangeInitiative = event => {
    const { value } = event.target;
    this.updateState({ initiative: parseInt(value) });
  };

  onClick = () => {
    const { onAdd } = this.props;
    onAdd(this.state);
  };

  render() {
    const { name, initiative } = this.state;
    return (
      <span>
        <input type="text" value={name} onChange={this.onChangeName} placeholder="Name" />
        <input
          type="number"
          value={initiative}
          onChange={this.onChangeInitiative}
          placeholder="Initiative"
        />
        <button onClick={this.onClick}>Add Player</button>
      </span>
    );
  }
}

export default AddCreature;
