# Building a State Management System with React

[Author Dev.to](https://dev.to/serifcolakel)
[Author Twitter](https://twitter.com/ColakelSerif)
[Author Medium](https://medium.com/@serifcolakel)
[Author GitHub](https://github.com/serifcolakel)
[Project GitHub Link](https://github.com/serifcolakel/jotai-clone)

🎉  **Let's Start**

State management is a critical aspect of building robust and maintainable React applications. In this article, we'll explore the concept of atoms in Jotai, a state management library, and create a custom hook to simplify state management in your React projects. By the end of this article, you'll have a solid understanding of how to use Jotai's atoms and custom hooks to manage state in a clean and efficient manner.

## Understanding Atoms in Jotai

At the core of Jotai's state management system are atoms. An atom is a container for a value that can be read synchronously and updated asynchronously. Think of atoms as individual units of state that you can use to manage various aspects of your application's data. Here's a breakdown of the essential components of an atom:

### Atom Interface

```ts
interface Atom<AtomType> {
  get: () => AtomType;
  set: (newValue: AtomType) => void;
  subscribe: (callback: (newValue: AtomType) => void) => () => void;
}
```

- `get` : Returns the current value of the atom synchronously.
- `set` : Allows you to update the value of the atom asynchronously.
- `subscribe` : Lets you listen for changes to the atom's value and provides a mechanism to unsubscribe when no longer needed.

## Creating and Cloning Jotai Atoms

Creating a Jotai atom is straightforward. You can use the createAtom function to initialize an atom with an initial value or a function to compute the initial value. Inside the createAtom function, we initialize the atom's value and set up subscribers to track changes.

```ts
function createAtom<AtomType>(
  initialValue: AtomType | ((get: <T>(a: Atom<T>) => T) => AtomType)
): Atom<AtomType> {
  // Implementation details...
}
```

But what if you want to reuse an atom's structure across different parts of your application? This is where cloning comes into play. Jotai provides a  `cloneAtom` function to replicate the behavior of existing atoms, maintaining consistency in your application's state management.

```ts
function cloneAtom<AtomType>(sourceAtom: Atom<AtomType>): Atom<AtomType> {
  // Implementation details...
}
```

## Building Custom Hooks for Jotai

Now that we understand the basics of atoms, let's simplify state management in our React components by creating custom hooks. We'll define two custom hooks: `useCustomAtom` and `useCustomAtomValue`.

### useCustomAtom

The `useCustomAtom` hook allows us to both read and update the value of an atom. It returns the current state and a function to set a new state. By using `useSyncExternalStore`, we seamlessly integrate the atom's subscription and get methods into our React component, making it easy to manage state.

```ts
function useCustomAtom<AtomType>(atom: Atom<AtomType>) {
  const state = useSyncExternalStore(atom.subscribe, atom.get);
  const setState = atom.set;
  return [state, setState] as const;
}
```

### useCustomAtomValue

The `useCustomAtomValue` hook simplifies state retrieval. It only returns the current value of the atom, making it perfect for read-only use cases.

```ts
function useCustomAtomValue<AtomType>(atom: Atom<AtomType>) {
  return useSyncExternalStore(atom.subscribe, atom.get);
}
```

## Understanding useSyncExternalStore in Depth

`useSyncExternalStore` is a React hook provided by Jotai that plays a crucial role in bridging the asynchronous state management of Jotai with the synchronous rendering cycle of React. It ensures that React components react efficiently to changes in the Jotai atom and optimizes rendering to prevent unnecessary re-renders.

When you use `useSyncExternalStore` within a React component, you are essentially subscribing that component to changes in a Jotai atom. It achieves this by taking two essential parameters:

- `subscribe`: A function that registers a callback to be called whenever the state in the Jotai atom changes.
- `get`: A function that retrieves the current value of the Jotai atom.

By doing so, `useSyncExternalStore` simplifies the integration of Jotai atoms with React components, allowing developers to seamlessly use Jotai for state management within their React applications. It ensures that React components remain responsive to state changes in Jotai atoms while maintaining rendering efficiency.

## Example: Building a Counter App with Jotai

This section will walk you through building a simple counter application using Jotai atoms and custom hooks. We'll start by creating a new React project using Create React App. Copy the following code into a new file called `jotai.ts` in your project's `src` directory. This file will contain all the code related to Jotai atoms and custom hooks.

```tsx
import { useSyncExternalStore } from 'react';

/**
 * @description An atom is a unit of state in Jotai. It is a container of a value that can be read synchronously and updated asynchronously.
 */
interface Atom<AtomType> {
  get: () => AtomType;
  set: (newValue: AtomType) => void;
  subscribe: (callback: (newValue: AtomType) => void) => () => void;
}

/**
 * @description Create an atom with the given initial value
 * @param initialValue The initial value of the atom or a function to compute the initial value
 * @returns An atom with the given initial value
 */
function createAtom<AtomType>(
  initialValue: AtomType | ((get: <T>(a: Atom<T>) => T) => AtomType)
): Atom<AtomType> {
  let value: AtomType =
    typeof initialValue === 'function' ? (null as AtomType) : initialValue;

  const subscribers = new Set<(newValue: AtomType) => void>();

  const subscribed = new Set<Atom<any>>();

  function get<T>(a: Atom<T>) {
    let currentValue = a.get();

    if (!subscribed.has(a)) {
      subscribed.add(a);
      a.subscribe((newValue) => {
        if (currentValue === newValue) return;

        currentValue = newValue;
        void computeValue();
      });
    }

    return currentValue;
  }

  /**
   * @description Compute the value of the atom
   */
  async function computeValue() {
    const newValue =
      typeof initialValue === 'function'
        ? await (
            initialValue as (get: <T>(a: Atom<T>) => T) => Promise<AtomType>
          )(get)
        : value;

    value = null as AtomType;
    value = newValue;
    subscribers.forEach((callback) => {
      callback(value);
    });
  }

  void computeValue();

  return {
    get: () => value,
    set: (newValue) => {
      value = newValue;
      void computeValue();
    },
    subscribe: (callback) => {
      subscribers.add(callback);

      return () => {
        subscribers.delete(callback);
      };
    },
  };
}

/**
 * @description A custom hook to get the value of an atom and a function to set the value
 * @param atom The atom to get the value from
 * @returns The value of the atom and a function to set the value
 */
function useCustomAtom<AtomType>(atom: Atom<AtomType>) {
  const state = useSyncExternalStore(atom.subscribe, atom.get);

  const setState = atom.set;

  return [state, setState] as const;
}

/**
 * @description A custom hook to get the value of an atom
 * @param atom The atom to get the value from
 * @returns The value of the atom
 */
function useCustomAtomValue<AtomType>(atom: Atom<AtomType>) {
  return useSyncExternalStore(atom.subscribe, atom.get);
}

function cloneAtom<AtomType>(atom: Atom<AtomType>): Atom<AtomType> {
  return createAtom(atom.get());
}

export { createAtom, useCustomAtom, useCustomAtomValue, cloneAtom };
```

Now that we've covered the basics of Jotai atoms and custom hooks, let's build a simple counter application to demonstrate how to use Jotai for state management in React. We'll use the `useCustomAtom` hook to manage the state of our counter and display the current count in our React component.

```tsx
// src/store/atoms.ts
import { createAtom } from './jotai';

const countAtom = createAtom<number>(0);

export { countAtom };
```

### Creating the Counter Display Component

Let's create a new component called `CounterDisplay` to display the current count. We'll use the `useCustomAtomValue` hook to retrieve the current count from the `countAtom` atom and display it in our component.

```tsx
import React from 'react';
import { useCustomAtomValue } from './atoms';

function CounterDisplay() {
  const count = useCustomAtomValue(countAtom);

  return (
    <div>
      <h2>Counter Value: {count}</h2>
    </div>
  );
}

export default CounterDisplay;
```

### Creating the Counter Button Component

Next, we'll create a new component called `CounterButton` to manage the counter actions (`increment` | `decrement` | `reset` | `random`). We'll use the `useCustomAtom` hook to retrieve the current count from the `countAtom` atom and update the count when the user clicks the button.

```tsx
import React, { type PropsWithChildren } from 'react';
import { countAtom } from '../../store/atoms';
import { useCustomAtom } from '../../store/jotai';
import { type ObjectValues } from '../../utilities/typeUtil';

export const ACTIONS = {
  INCREMENT: 'increment',
  DECREMENT: 'decrement',
  RESET: 'reset',
  RANDOM: 'random',
} as const;

interface CounterButtonProps {
  action: ObjectValues<typeof ACTIONS>;
}

function CounterButton({
  action,
  children,
}: PropsWithChildren<CounterButtonProps>) {
  const [count, setCount] = useCustomAtom(countAtom);

  const handleAction = () => {
    if (action === ACTIONS.INCREMENT) {
      setCount(count + 1);
    } else if (action === ACTIONS.DECREMENT) {
      setCount(count - 1);
    } else if (action === ACTIONS.RESET) {
      setCount(0);
    } else if (action === ACTIONS.RANDOM) {
      setCount(Math.floor(Math.random() * 100));
    } else {
      throw new Error('Invalid action');
    }
  };

  return (
    <button onClick={handleAction} type="button">
      {children}
    </button>
  );
}

export default CounterButton;
```

### Use the Counter Components in App

Finally, we'll use the `CounterDisplay` and `CounterButton` components in our `App` component to display the current count and allow the user to update the count.

```tsx
import './App.css';
import { useCustomAtomValue } from './store/jotai';
import CounterDisplay from './pages/CounterDisplay';
import CounterButton from './components/counter-button';
import { countAtom } from './store/atoms';

function App() {
  const countValue = useCustomAtomValue(countAtom);

  return (
    <div className="App">
      <h1>Custom Jotai Counter App</h1>
      <CounterDisplay />
      <CounterButton action="decrement">Decrement {countValue}</CounterButton>
      <CounterButton action="increment">Increment {countValue}</CounterButton>
      <CounterButton action="random">Random {countValue}</CounterButton>
      <CounterButton action="reset">Reset {countValue}</CounterButton>
    </div>
  );
}

export default App;
```

🎉 Congratulations! You've successfully built a counter application using Jotai atoms and custom hooks. You can find the complete source code for this project on [GitHub]()

## 📚 Conclusion

In this article, we've embarked on a journey through the powerful world of Jotai, exploring how to create and clone atoms to manage state effortlessly in React applications. By understanding the core concepts of atoms, we've laid the foundation for building robust state management systems.

We've seen how to define atoms with an initial value or compute it dynamically, offering flexibility in managing various aspects of your application's data. Additionally, we've discovered the utility of cloning atoms, enabling us to maintain a consistent state structure throughout our application.

To further streamline state management, we've crafted custom hooks like `useCustomAtom` and `useCustomAtomValue`, simplifying the interaction between components and atoms. These hooks seamlessly integrate Jotai's asynchronous state updates with React's synchronous rendering cycle, ensuring optimal performance and reactivity.

Lastly, we've delved into the role of the `useSyncExternalStore` hook, a vital piece of the puzzle that harmonizes Jotai's asynchronous state management with React's synchronous nature. It enables React components to respond efficiently to changes in Jotai atoms while optimizing rendering.

With the knowledge gained from this article, you're well-equipped to harness the power of Jotai atoms and custom hooks for state management in your React projects. Whether you're building a simple counter application or a complex web application, Jotai's elegant and efficient state management system empowers you to create applications that are both performant and maintainable.

So, go ahead and explore the world of Jotai in your React applications, and let the synergy of these technologies elevate your development experience to new heights. Happy coding!

## 📚 Resources

- [Jotai Documentation](https://jotai.org/)
- [useSyncExternalStore Discussion](https://github.com/reactwg/react-18/discussions/86)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript](https://www.typescriptlang.org/)
