import { fillDefaults, roll } from './util';
import { iterator } from 'lazy-iters';

const DEFAULT_CREATURE = {
  name: 'DEFAULT CREATURE',
  stats: {
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10
  },
  saves: {},
  skills: {},
  tags: [],
  resistances: [],
  vulnerabilities: [],
  immunities: [],
  conditionImmunities: [],
  hp: 0,
  ac: 0,
  speed: {
    walk: 0,
    fly: 0,
    hover: 0,
    burrow: 0,
    swim: 0,
    climb: 0
  },
  size: 'medium',
  type: 'humanoid',
  senses: [],
  languages: [],
  cr: 0,
  traits: [],
  actions: [],
  legendaryActions: null,
  imageUrl: null
};

export function modifier(stat) {
  return Math.floor((stat - 10) / 2);
}

function convertDescriptions(object) {
  if (object instanceof Object) {
    const { description } = object;
    if (description !== null) {
      if (description instanceof Array) {
        object.description = description.join('\n');
      }
    }

    // Convert all remaining fields]
    for (const field of Object.values(object)) {
      convertDescriptions(field);
    }
  }
}

export function extendCreature(newCreature, path, creatures, stack = []) {
  const creaturePath = `${newCreature.source}#${newCreature.name}`;
  if (stack.indexOf(creaturePath) !== -1) {
    throw new Error('circular dependency');
  }

  const [source, name] = path.split('#');
  if (source !== undefined && name !== undefined) {
    let baseCreature = iterator(creatures)
      .filter(creature => creature.name === name && creature.source === source)
      .take(1)
      .collect()[0];

    // Check if we need to fix parent
    if (baseCreature.mustExtend) {
      baseCreature = extendCreature(baseCreature, baseCreature.extends, creatures, [
        ...stack,
        creaturePath
      ]);
    }

    // Combine new and old creatures
    const combination = {
      ...baseCreature,
      ...newCreature
    };

    // Add additional actions and traits
    const { addActions, addTraits } = newCreature;
    if (addActions instanceof Array) {
      combination.actions = combination.actions.concat(addActions);
    }
    if (addTraits instanceof Array) {
      combination.traits = combination.traits.concat(addTraits);
    }

    // Clean up
    delete combination.newActions;
    delete combination.newTraits;
    delete combination.mustExtend;
    delete combination.extends;

    return combination;
  } else {
    throw new Error('invalid path to creature');
  }
}

export function convertCreature(creature) {
  if (creature['extends'] !== undefined) {
    // Save it for later
    return {
      ...creature,
      mustExtend: true
    };
  }
  const base = fillDefaults(creature, DEFAULT_CREATURE);

  // Calculate speeds
  const { speed } = base;
  if (speed !== undefined && speed !== null) {
    const defaultSpeed = DEFAULT_CREATURE.speed;
    for (const speedType of Object.keys(defaultSpeed)) {
      if (speed[speedType] === undefined) {
        speed[speedType] = 0;
      }
    }
  }

  // Fix HP
  if (typeof base.hp === 'string') {
    base.hp = parseInt(base.hp);
  }

  // Convert multiline strings
  convertDescriptions(base);

  // Calculate saving throws
  // const saves = base.saves;
  // for (const { save, stat } of SAVES) {
  //   // Calculate from stat
  //   if (saves[save] === undefined) {
  //     // Calculate modifier
  //     const mod = modifier(base.stats[stat]);
  //     saves[save] = mod;
  //   }
  // }

  // // Calculate skills
  // const skills = base.skills;
  // for (const { skill, stat } of SKILLS) {
  //   // Calculate from stat
  //   if (skills[skill] === undefined) {
  //     // Calculate modifier
  //     const mod = modifier(base.stats[stat]);
  //     skills[skill] = mod;
  //   }
  // }

  return base;
}

export function rollInitiative(creature) {
  const bonus = modifier(creature.stats.dex);
  return roll(20) + bonus;
}

export function getAC(creature) {
  const { ac } = creature;
  return parseInt(ac.split(' ')[0]);
}
