import { asyncIterator } from 'lazy-iters';

export async function* importObjects(url) {
  try {
    const data = await fetch(url);
    const json = await data.json();
    const source = json.name;
    yield* json.creatures.map(c => ({ ...c, source }));
  } catch (ex) {
    console.log(url, ex);
  }
}

export async function* importAllObjects(urls) {
  const sources = await Promise.all(
    urls.map(async url => {
      const objects = await asyncIterator(importObjects(url)).collect();
      return objects;
    })
  );
  for (const source of sources) {
    yield* source;
  }
}
