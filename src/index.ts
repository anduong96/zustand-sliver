import { SliversMapObject } from './types';
import { apiActions } from './api.actions';
import { apiSelectors } from './api.selectors';
import { combineSlivers } from './combine.slivers';
import { createSelectors } from './create.selectors';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import zustand from 'zustand';

export * from './create.sliver';

export function createStore<M extends SliversMapObject>(slivers: M) {
  const sliver = combineSlivers(slivers);
  return createSelectors<M>(
    zustand(
      immer(
        devtools(
          apiActions(
            apiSelectors(() => sliver.initialState, sliver.selectors),
            sliver.actions,
          ),
        ),
      ),
    ),
  );
}
