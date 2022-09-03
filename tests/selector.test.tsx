import * as React from 'react';

import { createSliver, createStore } from '../src';

import { faker } from '@faker-js/faker';
import { render } from '@testing-library/react';

describe('Basic selector test', () => {
  function getFullName(firstName: string, lastName: string) {
    return `${firstName} ${lastName}`;
  }

  it('get value', async () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    const bearSliver = createSliver({
      initialState: {
        firstName,
        lastName,
      },
      selectors: {
        fullName(state) {
          return getFullName(state.firstName, state.lastName);
        },
      },
    });

    const useStore = createStore({ bear: bearSliver });

    const Bear: React.FC = () => {
      const value = useStore.use.bear.fullName();
      return <div>{value}</div>;
    };

    const fullName = getFullName(firstName, lastName);
    const bear = render(<Bear />);
    await bear.findByText(fullName);
  });
});
