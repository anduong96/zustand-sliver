import { ActionFromSliversMapObject, SliversMapObject } from './types';
import { StateCreator, StoreApi } from 'zustand';

type PopArgument<T extends (...a: never[]) => unknown> = T extends (
  ...a: [...infer A, infer _]
) => infer R
  ? (...a: A) => R
  : never;

export function apiActions<M extends SliversMapObject>(
  config: PopArgument<StateCreator<any, [], []>>,
  actionSlivers: ActionFromSliversMapObject<M>,
): PopArgument<StateCreator<any, [], []>> {
  return (set, get, api: StoreApi<any> & { actions?: any }) => {
    const builtActions = {} as any;
    for (const sliverKey of Object.keys(actionSlivers)) {
      const actions = actionSlivers[sliverKey];
      if (!actions) {
        continue;
      }

      builtActions[sliverKey] = {} as any;
      for (const actionKey of Object.keys(actions)) {
        const action = actions[actionKey];
        if (!action) {
          continue;
        }

        builtActions[sliverKey][actionKey] = (...params: any[]) =>
          set((state: any) => action(state[sliverKey], ...params));
      }
    }

    api.actions = builtActions;
    return config(set, get, api);
  };
}
