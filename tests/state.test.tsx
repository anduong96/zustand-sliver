import * as React from 'react';

import { createSliver, createStore } from '../src';

import { faker } from '@faker-js/faker';
import { render } from '@testing-library/react';

describe('Basic state retrieval test', () => {
  it('get state value', async () => {
    const bearName = faker.name.fullName();
    const fishName = faker.name.fullName();
    const bearSliver = createSliver({
      initialState: {
        name: bearName,
      },
    });

    const fishSliver = createSliver({
      initialState: {
        name: fishName,
      },
    });

    const useStore = createStore({
      bear: bearSliver,
      fish: fishSliver,
    });

    const Bear: React.FC = () => {
      const value = useStore((state) => state.bear.name);
      return <div>{value}</div>;
    };

    const Fish: React.FC = () => {
      const value = useStore((state) => state.fish.name);
      return <div>{value}</div>;
    };

    const bear = render(<Bear />);
    await bear.findByText(bearName);

    const fish = render(<Fish />);
    await fish.findByText(fishName);
  });
});
