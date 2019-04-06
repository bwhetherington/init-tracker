import { iterator } from 'lazy-iters';

/**
 * Produces a deep copy of the specified source value.
 * @param source the object to be cloned
 */
export function clone(source) {
  if (source instanceof Array) {
    const keys = iterator(Object.keys(source));
    return keys.fold([], (target, key) => {
      target[key] = clone(source[key]);
      return target;
    });
  } else if (source instanceof Object) {
    const keys = iterator(Object.keys(source));
    return keys.fold({}, (target, key) => {
      target[key] = clone(source[key]);
      return target;
    });
  } else {
    return source;
  }
}

/**
 * Produces a new object containing the fields from the specified object, as
 * well as the fields from the specified default object.
 * @param obj the object to expand
 * @param defaultObject the object containing the default fields
 */
export function fillDefaults(obj, defaultObject) {
  return {
    ...clone(defaultObject),
    ...obj
  };
}

export function capitalize(str) {
  if (typeof str === 'string') {
    if (str.length > 0) {
      const first = str[0].toLocaleUpperCase();
      const rest = str.slice(1);
      return `${first}${rest}`;
    }
  } else {
    return str;
  }
}

export function roll(die = 20) {
  return Math.floor(Math.random() * die) + 1;
}

export function id(x) {
  return x;
}

export function* range(from, to) {
  for (let i = from; i < to; i++) {
    yield i;
  }
}
