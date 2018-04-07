export interface Override {
  from: string;
  to: string;
}

interface StorageItems {
  overrides: Override[];
}

interface StorageChange<K> {
  oldValue?: K;
  newValue?: K;
}

interface StorageItemsChange {
  overrides?: StorageChange<Override[]>;
}

const area = browser.storage.sync;

export function initialize(): void {
  getOverrides().then(overrides => area.set({overrides: overrides || []}));
}

export function getOverrides(): Promise<Override[]> {
  return area.get('overrides').then(({overrides}: StorageItems) => overrides);
}

export function addOverride(ovrd: Override): Promise<void> {
  return getOverrides().then(overrides =>
    area.set({overrides: (overrides || []).concat(ovrd)}),
  );
}

export function editOverride(at: number, override: Override): Promise<void> {
  return getOverrides().then(overrides => {
    if (overrides.length - 1 < at || at < 0) {
      throw new Error('requested override index does not exist');
    }

    return area.set({
      overrides: (overrides || []).map(
        (current, idx) => (idx === at ? override : current),
      ),
    });
  });
}

export function removeOverride(at: number): Promise<void> {
  return getOverrides().then(overrides => {
    if (overrides.length - 1 < at || at < 0) {
      throw new Error('requested override index does not exist');
    }

    return area.set({
      overrides: (overrides || []).filter((override, idx) => idx !== at),
    });
  });
}

export function onOverridesChanged(listener: (overrides: Override[]) => void) {
  browser.storage.onChanged.addListener(({overrides}: StorageItemsChange) => {
    if (overrides && overrides.newValue) {
      listener(overrides.newValue);
    }
  });
}
