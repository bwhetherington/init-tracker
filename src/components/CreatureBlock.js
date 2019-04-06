import React from 'react';
import './CreatureBlock.css';

import Html from 'react-html-parser';

import { capitalize, id } from '../util/util';
import { modifier } from '../util/creature';
import { iterator } from 'lazy-iters';

function showModifier(mod) {
  if (mod < 0) {
    return `${mod}`;
  } else {
    return `+${mod}`;
  }
}

function renderStats(stats) {
  const keys = Object.keys(stats);
  return (
    <table className="statsTable">
      <thead>
        <tr>
          {keys.map(key => (
            <th key={key}>{key.toUpperCase()}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {keys.map(key => (
            <td key={key}>
              {stats[key]} ({showModifier(modifier(stats[key]))})
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

function getSkillName(skill) {
  switch (skill) {
    case 'sleightOfHand':
      return 'Sleight of Hand';
    case 'animalHandling':
      return 'Animal Handling';
    default:
      return skill;
  }
}

function renderPropertyDict(name, dict, f = id) {
  const keys = Object.keys(dict);
  const comp =
    keys.length > 0 ? (
      <span>
        <strong>{name}</strong>{' '}
        {keys.map(key => `${capitalize(f(key))} ${showModifier(dict[key])}`).join(', ')}
      </span>
    ) : null;
  return comp;
}

function renderPropertyList(name, list) {
  const comp =
    list.length > 0 ? (
      <span>
        <strong>{capitalize(name)}</strong> {list.map(capitalize).join(', ')}
      </span>
    ) : null;
  return comp;
}

function renderProperty(name, value) {
  const valueStr = `${value}`;
  if (valueStr !== '') {
    return (
      <span>
        <strong>{name}</strong> {valueStr}
      </span>
    );
  } else {
    return null;
  }
}

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

function renderListComponents(list) {
  const comps = iterator(list)
    .map(({ name, description }) => (
      <React.Fragment>
        <b>
          <i>{name}.</i>
        </b>{' '}
        {Html(description)}
      </React.Fragment>
    ))
    .enumerate()
    .map(([desc, n]) => <p key={n}>{desc}</p>)
    .collect();
  return comps;
}

function renderLegendaryActions(leg) {
  if (leg !== null) {
    const { description, actions } = leg;
    const comps = renderListComponents(actions);
    return (
      <React.Fragment>
        <h3>Legendary Actions</h3>
        <p>{description}</p>
        {comps}
      </React.Fragment>
    );
  } else {
    return <span />;
  }
}

function renderList(name, list) {
  if (list.length > 0) {
    const comps = renderListComponents(list);
    return (
      <React.Fragment>
        <h3>{name}</h3>
        {comps}
      </React.Fragment>
    );
  } else {
    return <span />;
  }
}

function renderProperties(creature) {
  const {
    saves,
    skills,
    vulnerabilities,
    resistances,
    immunities,
    conditionImmunities,
    senses,
    languages,
    cr
  } = creature;

  const comps = [];

  // Saves
  comps.push(renderPropertyDict('Saving Throws:', saves));

  // Skills
  comps.push(renderPropertyDict('Skills:', skills, getSkillName));

  // Vulnerabilities
  comps.push(renderPropertyList('Damage Vulnerabilities:', vulnerabilities));

  // Resistances
  comps.push(renderPropertyList('Damage Resistances:', resistances));

  // Immunities
  comps.push(renderPropertyList('Damage Immunities:', immunities));

  // Condition Immunities
  comps.push(renderPropertyList('Condition Immunities:', conditionImmunities));

  // Senses
  comps.push(renderPropertyList('Senses:', senses));

  // Languages
  comps.push(renderPropertyList('Languages:', languages));

  // Challenge Rating
  comps.push(renderProperty('Challenge:', showCr(cr)));

  const components = iterator(comps)
    .filter(x => x !== null)
    // Create linebreaks between properties
    .intersperse(<br />)

    // Wrap properties in a span with a unique key
    .enumerate()
    .map(([x, n]) => <span key={n}>{x}</span>)

    // Collect into a list
    .collect();
  return <div>{components}</div>;
}

function renderSummary(creature) {
  const { size, type, tags } = creature;
  let summary = `${capitalize(size)} ${type}`;

  if (tags.length > 0) {
    const tagsStr = tags.join(', ');
    summary += ` (${tagsStr})`;
  }

  return (
    <p>
      <span className="left-block">
        <i>{summary}</i>
      </span>
      <span className="right-block">
        <i>({creature.source})</i>
      </span>
    </p>
  );
}

function renderSpeed(speed) {
  const comps = iterator(Object.keys(speed))
    .filter(key => speed[key] !== 0)
    .map(key => `${capitalize(key)} ${speed[key]}ft.`)
    .collect()
    .join(', ');
  return comps;
}

function renderTop(creature) {
  const { ac, hp, speed } = creature;
  const speedComp = renderSpeed(speed);
  return (
    <p>
      <b>AC: </b> {ac}
      <br />
      <b>Hit Points: </b> {hp}
      <br />
      <b>Speed: </b> {speedComp}
    </p>
  );
}

function renderImage(creature) {
  const { imageUrl } = creature;
  if (imageUrl !== null && imageUrl !== undefined) {
    return <img src={imageUrl} alt="creature" />;
  } else {
    return <span />;
  }
}

function CreatureBlock(props) {
  const { creature } = props;

  const summary = renderSummary(creature);
  const properties = renderProperties(creature);

  // Table
  const stats = creature.stats;
  const table = renderStats(stats);

  return (
    <div className="CreatureBlock">
      {renderImage(creature)}
      <h2>{creature.name}</h2>
      {summary}
      <hr />
      {renderTop(creature)}
      <hr />
      {table}
      <hr />
      {properties}
      <div className="entries">
        {renderList('Traits', creature.traits)}
        {renderList('Actions', creature.actions)}
        {renderLegendaryActions(creature.legendaryActions)}
      </div>
    </div>
  );
}

export default CreatureBlock;
