export async function* importObjects(url) {
  const data = await fetch(url);
  const json = await data.json();
  const source = json.name;
  yield* json.creatures.map(c => ({ ...c, source }));
}

export async function* importAllObjects(urls) {
  for (const url of urls) {
    yield* await importObjects(url);
  }
}
