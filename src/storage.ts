export interface Override {
  from: string;
  to: string;
}

export function getOverrides(): Promise<Override[]> {
  return browser.storage.sync
    .get('overrides')
    .then(({overrides}) => overrides as Override[]);
}

export function addOverride(ovrd: Override): Promise<void> {
  return getOverrides().then(overrides =>
    browser.storage.sync.set({overrides: (overrides || []).concat(ovrd)}),
  );
}
