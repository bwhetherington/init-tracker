import React from 'react';
import Autocomplete from 'react-autocomplete';
import Component from './Component';
import { id } from '../util/util';
import './TableControls.css';

function showCr(cr) {
  switch (cr) {
    case 0.125:
      return '1/8';
    case 0.25:
      return '1/4';
    case 0.5:
      return '1/2';
    default:
      return `${cr}`;
  }
}

class TableControls extends Component {
  state = {
    creatureName: '',
    creatureId: '',
    playerName: '',
    playerInit: '',
    damage: ''
  };

  onChange(property, f = id) {
    return event => {
      const { value } = event.target;
      this.updateState({ [property]: f(value) });
    };
  }

  onAddCreature = e => {
    e.preventDefault();
    if (this.verifyCreature()) {
      const { onAddCreature } = this.props;
      const { creatureName, creatureId } = this.state;
      onAddCreature({ name: creatureName, id: creatureId });
    }
  };

  onAddPlayer = e => {
    e.preventDefault();
    if (this.verifyPlayer()) {
      const { onAddPlayer } = this.props;
      const { playerName, playerInit } = this.state;
      onAddPlayer({ name: playerName, initiative: playerInit });
    }
  };

  onDealDamage = e => {
    e.preventDefault();
    if (this.verifyDamage()) {
      const { onDealDamage } = this.props;
      const { damage } = this.state;
      onDealDamage({ damage: parseInt(damage) });
    }
  };

  verifyCreature() {
    // Attempt to parse ID
    const { creatureName, creatureId } = this.state;
    const parsed = parseInt(creatureId);
    return creatureName !== '' && (creatureId === '' || !Number.isNaN(parsed));
  }

  verifyPlayer() {
    const { playerName, playerInit } = this.state;
    const parsed = parseInt(playerInit);
    return !(playerName === '' || Number.isNaN(parsed));
  }

  verifyDamage() {
    const parsed = parseInt(this.state.damage);
    return !Number.isNaN(parsed);
  }

  renderAutocomplete(value, creatures) {
    const items = creatures.map(creature => ({
      value: creature.name,
      label: `${creature.name} (CR ${showCr(creature.cr)} ${creature.type})`,
      id: `${creature.source}:${creature.name}`
    }));
    return (
      <Autocomplete
        wrapperStyle={{
          display: 'flex'
        }}
        inputProps={{
          placeholder: 'Creature Name',
          type: 'text',
          style: {
            margin: '2px',
            flex: '1'
          }
        }}
        shouldItemRender={(item, value) =>
          item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
        }
        getItemValue={item => item.value}
        sortItems={(a, b) => a.label.localeCompare(b.label)}
        items={items}
        renderItem={(item, isHighlighted) => (
          <div
            key={item.id}
            style={{
              color: isHighlighted ? 'white' : 'inherit',
              background: isHighlighted ? '#009ba1' : 'white',
              padding: '4px'
            }}
          >
            {item.label}
          </div>
        )}
        value={value}
        onChange={this.onChange('creatureName')}
        placeholder="Creature Name"
        onSelect={val => this.updateState({ creatureName: val })}
      />
    );
  }

  render() {
    const { creatureName, creatureId, playerName, playerInit, damage } = this.state;
    const { onSort = id, onAdvance = id, onRemove = id, onClear = id, creatures = [] } = this.props;
    return (
      <div className="TableControls">
        <form className="row-2-1-1">
          {this.renderAutocomplete(creatureName, creatures)}
          <input
            type="number"
            placeholder="ID"
            onChange={this.onChange('creatureId')}
            value={creatureId}
          />
          <button className="inputBtn" onClick={this.onAddCreature}>
            Add Creature
          </button>
        </form>
        <form className="row-2-1-1">
          <input
            type="text"
            placeholder="Player Name"
            onChange={this.onChange('playerName')}
            value={playerName}
          />
          <input
            type="number"
            placeholder="Initiative"
            onChange={this.onChange('playerInit')}
            value={playerInit}
          />
          <button className="inputBtn" onClick={this.onAddPlayer}>
            Add Player
          </button>
        </form>
        <form className="row-3-1">
          <input
            type="number"
            placeholder="Damage Amount"
            onChange={this.onChange('damage')}
            value={damage}
          />
          <button onClick={this.onDealDamage}>Deal Damage</button>
        </form>
        <div className="row-1-1-1-1">
          <button onClick={onSort}>Sort</button>
          <button onClick={onAdvance}>Advance</button>
          <button onClick={onRemove}>Remove</button>
          <button onClick={onClear}>Clear</button>
        </div>
      </div>
    );
  }
}

export default TableControls;
