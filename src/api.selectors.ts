import { SelectorFromSliversMapObject, SliversMapObject } from './types';

export function apiSelectors<M extends SliversMapObject>(
  config: any,
  selectorSlices: SelectorFromSliversMapObject<M>,
) {
  return (set: any, get: any, api: any) => {
    api.selectors = selectorSlices;
    return config(set, get, api);
  };
}
