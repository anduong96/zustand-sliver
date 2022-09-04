# Zustand Sliver

This package was build to provide zustand with redux-toolkit like api with some opinionated utilities

## Usage

### Install

```bash
npm i --save zustand-sliver
```

### Create a sliver

```typescript
import { createSliver } from 'zustand-sliver';

const bearSliver = createSliver({
  initialState: {
    firstName: 'Ted',
    lastName: 'Day',
  },
  selectors: {
    fullName(state) {
      return state.firstName + ' ' + state.lastName;
    },
  },
  actions: {
    updateFirstName(state, value: string) {
      state.firstName = value;
    },
  },
});
```

### Create store hook

```typescript
import { createStore } from 'zustand-sliver';

const store = createStore({
  bear: bearSliver,
});
```

### Use as hook

```tsx
function MyApp() {
  const firstName = store((state) => state.bear.firstName);
  const fullName = store.use.bear.fullName();
  const updateFirstName = store.actions.bear.updateFirstName;

  function changeFirstName() {
    updateFirstName('Ted ' + new Date().valueOf());
  }

  return (
    <div>
      <div>firstName: {firstName}</div>
      <div>fullName: {fullName}</div>
      <button onClick={changeFirstName}>Update Name</button>
    </div>
  );
}
```
