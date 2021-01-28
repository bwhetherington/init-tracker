import React from 'react';
import Component from './Component';
import './InitiativeTable.css';
import { rollInitiative, getAC } from '../util/creature';
import CreatureBlock from './CreatureBlock';
import { iterator } from 'lazy-iters';
import TableControls from './TableControls';

class InitiativeTable extends Component {
  state = {
    creatures: [],
    active: -1,
  };

  componentDidMount() {
    const oldState = window.localStorage.initTrackerState;
    if (oldState) {
      const parsed = JSON.parse(oldState);
      this.setState(parsed);
    }
  }

  updateState(change) {
    // Also write state to localstorage
    window.localStorage.initTrackerState = JSON.stringify({ ...this.state, ...change });
    super.updateState(change);
  }

  removeCurrent = () => {
    const { active, creatures } = this.state;
    if (active > -1) {
      const newCreatures = iterator(creatures)
        .enumerate()
        .filter(([_, i]) => i !== active)
        .map(([creature, _]) => creature)
        .collect();
      this.updateState({ creatures: newCreatures });
    }
  };

  sort = () => {
    const creatures = [...this.state.creatures];
    creatures.sort((a, b) => b.initiative - a.initiative);
    this.updateState({ creatures });
  };

  clear = () => {
    this.updateState({ creatures: [], active: -1 });
  };

  advance = () => {
    const { active, creatures } = this.state;

    // Skip over dead creatures

    // Account for no creatures remaining
    if (creatures.length === 0) {
      this.updateState({ active: -1 });
    } else {
      this.updateState({ active: (active + 1) % creatures.length });
    }
  };

  addPlayer = (toAdd) => {
    const { name, initiative } = toAdd;
    const { creatures } = this.state;

    // Check that no other player with that name exists
    if (!iterator(creatures).any((creature) => creature.name === name)) {
      const entry = {
        isPlayer: true,
        hp: 0,
        id: '',
        initiative,
        name,
        ac: '',
        creature: null,
      };
      const newCreatures = [...this.state.creatures, entry];
      this.updateState({ creatures: newCreatures });
    }
  };

  addCreature = (toAdd) => {
    const { name, id } = toAdd;
    const creature = this.props.data.filter((x) => x.name === name)[0];
    if (creature !== undefined) {
      const entry = {
        isPlayer: false,
        hp: creature.hp,
        id,
        initiative: rollInitiative(creature),
        name: creature.name,
        creature,
        ac: getAC(creature),
      };

      // Check that we don't have duplicates
      const newKey = `${name}:${id}`;
      const isDuplicate = iterator(this.state.creatures)
        .map(({ name, id }) => `${name}:${id}`)
        .any((key) => key === newKey);

      if (!isDuplicate) {
        const creatures = [...this.state.creatures, entry];
        this.updateState({ creatures });
      }
    }
  };

  renderActive() {
    const { creatures, active } = this.state;

    if (active > -1) {
      const entry = creatures[active];
      if (entry !== undefined && entry !== null) {
        const { creature } = entry;
        if (creature !== null && creature !== undefined) {
          return <CreatureBlock creature={creature} />;
        } else {
          return <div>No stat block available.</div>;
        }
      }
    } else {
      return <div />;
    }
  }

  onClickRow(active) {
    return () => {
      this.updateState({ active });
    };
  }

  onDamageCurrent = (e) => {
    const { damage } = e;
    console.log(damage);
    const { active, creatures } = this.state;
    if (active > -1) {
      const original = creatures[active];
      const entry = { ...creatures[active] };
      console.log(entry);
      if (typeof entry.hp === 'number' && !Number.isNaN(damage)) {
        entry.hp -= damage;
      }
      const newCreatures = [...creatures.map((e) => (e !== original ? e : entry))];
      this.updateState({ creatures: newCreatures });
    }
  };

  onKeyPress = (e) => {
    if (e.key === 'Shift') {
      this.advance();
    }
  };

  render() {
    const { creatures, active } = this.state;
    const table = (
      <table className="initiative-table">
        <thead>
          <tr>
            <th>Initiative</th>
            <th>Name</th>
            <th>ID</th>
            <th>HP</th>
            <th>AC</th>
          </tr>
        </thead>
        <tbody>
          {iterator(creatures)
            .enumerate()
            .map(([{ initiative, name, id, hp, ac, isPlayer }, i]) => (
              <tr
                key={`${name}:${id}`}
                onClick={this.onClickRow(i)}
                className={
                  typeof hp === 'number' && hp <= 0 && !isPlayer
                    ? 'dead'
                    : active === i
                    ? 'active'
                    : ''
                }
              >
                <td>{initiative}</td>
                <td>{name}</td>
                <td>{id}</td>
                <td>{hp}</td>
                <td>{ac}</td>
              </tr>
            ))
            .collect()}
        </tbody>
      </table>
    );
    return (
      <div className="InitiativeTable">
        <div className="creature-block-panel">
          <div className="container">
            <div className="creature-block">{this.renderActive()}</div>
          </div>
        </div>
        <div className="controls-panel">
          <div className="container">
            <TableControls
              className="table-controls"
              onAddCreature={this.addCreature}
              onAddPlayer={this.addPlayer}
              onDealDamage={this.onDamageCurrent}
              onSort={this.sort}
              onAdvance={this.advance}
              onRemove={this.removeCurrent}
              onClear={this.clear}
              creatures={this.props.data}
            />
            <div className="table-container">{table}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default InitiativeTable;
