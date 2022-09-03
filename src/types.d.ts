export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type State = Record<string, any>;
export type Action<S = any> = (state: S, ...params: any[]) => void | S;
export type Actions<S = any> = Record<string, Action<S>>;
export type Selector<S = any> = (state: S, store: unknown) => unknown;
export type Selectors<S = any> = Record<string, Selector<S>>;
export type ActionFromSliver<R> = R extends Sliver<any, infer A, any> ? A : R;
export type SelectorFromSliver<R> = R extends Sliver<any, any, infer A> ? A : R;
export type Sliver<S, A, R> = {
  initialState: S;
  actions: A;
  selectors: R;
};

export type SliversMapObject<
  S extends Record<string, any> = Record<string, any>,
> = {
  [K in keyof S]: Sliver<S[K], Actions<S[K]>, Selectors<S[K]>>;
};

export type StateFromSliversMapObject<M> = M extends SliversMapObject
  ? { [P in keyof M]: M[P] extends Sliver<infer S, any, any> ? S : never }
  : never;

export type ActionsFromSliversMapObject<M> = M extends SliversMapObject
  ? {
      [P in keyof M]: M[P] extends Sliver<any, infer A, any> ? A : never;
    }
  : never;

export type ActionFromSliversMapObject<M> = M extends SliversMapObject
  ? ActionFromSliver<ActionsFromSliversMapObject<M>>
  : never;

export type SelectorsFromSliversMapObject<M> = M extends SliversMapObject
  ? {
      [P in keyof M]: M[P] extends Sliver<any, any, infer A> ? A : never;
    }
  : never;

export type SelectorFromSliversMapObject<M> = M extends SliversMapObject
  ? SelectorFromSliver<SelectorsFromSliversMapObject<M>>
  : never;

export type SliverFromSliverMapObject<M> = Sliver<
  StateFromSliversMapObject<M>,
  ActionFromSliversMapObject<M>,
  SelectorFromSliversMapObject<M>
>;

type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never;

export type WithSelectors<Store, Selectors, Actions> = Store extends {
  getState: () => infer T;
}
  ? Store & {
      selectors: {
        [K in keyof T]: K extends keyof Selectors ? Selectors[K] : never;
      };
      actions: {
        [K in keyof T]: K extends keyof Actions
          ? {
              [L in keyof Actions[K]]: Actions[K][L] extends (
                ...params: any[]
              ) => any
                ? (...params: DropFirst<Parameters<Actions[K][L]>>) => void
                : never;
            }
          : never;
      };
      use: {
        [K in keyof T]: {
          all: () => T[K];
        } & K extends keyof Selectors
          ? {
              // @ts-ignore
              // TODO: Idk how to type this correctly
              [E in keyof Selectors[K]]: () => ReturnType<Selectors[K][E]>;
            }
          : never;
      };
    }
  : never;
