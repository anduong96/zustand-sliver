import { jsx as _jsx } from "react/jsx-runtime";
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
        const Bear = () => {
            const value = useStore((state) => state.bear.name);
            return _jsx("div", { children: value });
        };
        const Fish = () => {
            const value = useStore((state) => state.fish.name);
            return _jsx("div", { children: value });
        };
        const bear = render(_jsx(Bear, {}));
        await bear.findByText(bearName);
        const fish = render(_jsx(Fish, {}));
        await fish.findByText(fishName);
    });
});
