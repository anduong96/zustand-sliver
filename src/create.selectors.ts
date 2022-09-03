import {
  ActionsFromSliversMapObject,
  Selector,
  SelectorFromSliversMapObject,
  SliversMapObject,
  StateFromSliversMapObject,
  WithSelectors,
} from './types';
import { StoreApi, UseBoundStore } from 'zustand';

/**
 * It takes a store and returns a store with a `use` property that has a property for each sliver in
 * the store
 */
export function createSelectors<
  M extends SliversMapObject,
  State extends StateFromSliversMapObject<M> = StateFromSliversMapObject<M>,
  Store extends UseBoundStore<StoreApi<State>> = UseBoundStore<StoreApi<State>>,
  Selectors extends SelectorFromSliversMapObject<M> = SelectorFromSliversMapObject<M>,
  Actions extends ActionsFromSliversMapObject<M> = ActionsFromSliversMapObject<M>,
>(store: Store) {
  const modStore = store as WithSelectors<Store, Selectors, Actions>;
  const state = modStore.getState();
  modStore.use = {} as typeof modStore['use'];
  Object.keys(state).forEach((key: keyof typeof state) => {
    const all = () => store((state) => state[key]);
    modStore.use[key] = { all } as any;

    const selectors = modStore.selectors[key];
    if (selectors && typeof selectors === 'object') {
      Object.keys(selectors).forEach((selectorK: keyof typeof selectors) => {
        const selector: Selector = selectors[selectorK]!;
        //@ts-ignore
        modStore.use[key][selectorK] = () =>
          store((state) => selector(state[key], state));
      });
    }
  });

  return modStore;
}
