import React from 'react';
import Component from './Component';

class AddCreature extends Component {
  state = {
    name: '',
    id: ''
  };

  onChangeName = event => {
    const { value } = event.target;
    this.updateState({ name: value });
  };

  onChangeId = event => {
    const { value } = event.target;
    this.updateState({ id: parseInt(value) });
  };

  onClick = () => {
    const { onAdd } = this.props;
    onAdd(this.state);
  };

  render() {
    const { name, id } = this.state;
    return (
      <span>
        <input type="text" value={name} onChange={this.onChangeName} placeholder="Name" />
        <input type="number" value={id} onChange={this.onChangeId} placeholder="ID" />
        <button onClick={this.onClick}>Add Creature</button>
      </span>
    );
  }
}

export default AddCreature;
