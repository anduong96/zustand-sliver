import type { Actions, PartialBy, Selectors, Sliver, State } from './types';

/**
 * It takes a partial sliver and returns a full sliver
 * @param sliver - PartialBy<Sliver<S, A, R>, 'actions' | 'selectors'>,
 * @returns A function that takes a sliver and returns a sliver.
 */
export function createSliver<
  S extends State,
  A extends Actions<S>,
  R extends Selectors<S>,
>(
  sliver: PartialBy<Sliver<S, A, R>, 'actions' | 'selectors'>,
): Sliver<S, A, R> {
  return {
    ...sliver,
    actions: sliver.actions ?? ({} as A),
    selectors: sliver.selectors ?? ({} as R),
  };
}
