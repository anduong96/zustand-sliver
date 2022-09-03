import { jsx as _jsx } from "react/jsx-runtime";
import { createSliver, createStore } from '../src';
import { faker } from '@faker-js/faker';
import { render } from '@testing-library/react';
describe('Basic selector test', () => {
    function getFullName(firstName, lastName) {
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
        const Bear = () => {
            const value = useStore.use.bear.fullName();
            return _jsx("div", { children: value });
        };
        const fullName = getFullName(firstName, lastName);
        const bear = render(_jsx(Bear, {}));
        await bear.findByText(fullName);
    });
});
