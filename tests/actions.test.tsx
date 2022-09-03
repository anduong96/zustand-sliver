import * as React from 'react';

import { createSliver, createStore } from '../src';

import { faker } from '@faker-js/faker';
import { render } from '@testing-library/react';

describe('Basic actions test', () => {
  it('updates numeric value', async () => {
    const fishAte = Number(faker.random.numeric());
    const bearSliver = createSliver({
      initialState: {
        fishAte,
      },
      actions: {
        eatFish(state, value: number) {
          state.fishAte += value;
        },
      },
    });

    const useStore = createStore({ bear: bearSliver });
    const incValue = Number(faker.random.numeric());

    const Bear: React.FC = () => {
      const value = useStore((state) => state.bear.fishAte);
      const eatFish = useStore.actions.bear.eatFish;
      React.useEffect(() => eatFish(incValue), []);
      return <div>{value.toString()}</div>;
    };

    const bear = render(<Bear />);
    await bear.findByText(String(fishAte + incValue));
  });

  it('updates array value', async () => {
    const randID = () => faker.datatype.string();
    const fishCollections = Array.from(
      { length: faker.datatype.number({ min: 5, max: 10 }) },
      () => randID(),
    );

    const bearSliver = createSliver({
      initialState: {
        fishCollections,
      },
      actions: {
        addFish(state, fishId: string) {
          state.fishCollections.push(fishId);
        },
      },
    });

    const useStore = createStore({ bear: bearSliver });
    const newFish = randID();
    let renderCount = 0;

    const Bear: React.FC = () => {
      const value = useStore((state) => state.bear.fishCollections);
      const addFish = useStore.actions.bear.addFish;
      React.useEffect(() => addFish(newFish), []);
      React.useEffect(() => {
        renderCount += 1;
      });

      return <div>{JSON.stringify(value)}</div>;
    };

    const bear1 = render(<Bear />);
    const element = await bear1.findByText(
      JSON.stringify(fishCollections.concat(newFish)),
    );
    expect(renderCount).toBe(2);
    expect(element.innerHTML).not.toEqual(JSON.stringify(fishCollections));
  });

  it('updates array element value', async () => {
    const randID = () => faker.datatype.string();
    const fishCollections = Array.from(
      { length: faker.datatype.number({ min: 5, max: 10 }) },
      () => ({
        id: randID(),
        weight: faker.datatype.number({ max: 1000 }),
      }),
    );

    const bearSliver = createSliver({
      initialState: {
        fishCollections,
      },
      actions: {
        updateWeight(state, fishId: string, value: number) {
          const fish = state.fishCollections.find((f) => f.id === fishId);
          if (fish) {
            fish.weight = value;
          }
        },
      },
    });

    let renderCount = 0;
    const useStore = createStore({ bear: bearSliver });
    const targetIdx = faker.datatype.number({
      min: 0,
      max: fishCollections.length - 1,
    });
    const target = {
      id: fishCollections[targetIdx]!.id,
      weight: faker.datatype.number({ max: 10000 }),
    };

    const Bear: React.FC = () => {
      const value = useStore((state) => state.bear.fishCollections);
      const updateFish = useStore.actions.bear.updateWeight;
      React.useEffect(() => updateFish(target.id, target.weight), []);
      React.useEffect(() => {
        renderCount += 1;
      });

      return <div>{JSON.stringify(value)}</div>;
    };

    const bear1 = render(<Bear />);
    const expected = [...fishCollections];
    expected[targetIdx] = target;
    const element = await bear1.findByText(JSON.stringify(expected));
    expect(renderCount).toBe(2);
    expect(element.innerHTML).not.toEqual(JSON.stringify(fishCollections));
    expect(JSON.stringify(expected)).not.toEqual(
      JSON.stringify(fishCollections),
    );
  });
});
