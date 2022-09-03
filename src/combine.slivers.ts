import type { SliverFromSliverMapObject, SliversMapObject } from './types';

/**
 * It takes a map of slivers and returns a sliver that has the same shape as the map, but with the
 * properties of each sliver combined into the corresponding property of the returned sliver
 */
export function combineSlivers<M extends SliversMapObject>(
  slivers: M,
): SliverFromSliverMapObject<M> {
  const keys = ['initialState', 'actions', 'selectors'] as const;
  return Object.fromEntries(
    keys.map((propertyKey) => [
      propertyKey,
      Object.fromEntries(
        Object.entries(slivers).map(([key, item]) => [
          key,
          item[propertyKey] || {},
        ]),
      ),
    ]),
  ) as SliverFromSliverMapObject<M>;
}
