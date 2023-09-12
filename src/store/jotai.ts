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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscribed = new Set<Atom<any>>();

  /**
   * @description Compute the value of the atom
   */
  async function computeValue() {
    const newValue =
      typeof initialValue === 'function'
        ? await (
            initialValue as (get: <T>(a: Atom<T>) => T) => Promise<AtomType>
          )(
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            get
          )
        : value;

    value = null as AtomType;
    value = newValue;
    subscribers.forEach((callback) => {
      callback(value);
    });
  }

  function get<T>(a: Atom<T>) {
    let currentValue = a.get();

    if (!subscribed.has(a)) {
      subscribed.add(a);
      a.subscribe((newValue) => {
        if (currentValue === newValue) return;

        currentValue = newValue;
        computeValue();
      });
    }

    return currentValue;
  }

  computeValue();

  return {
    get: () => value,
    set: (newValue) => {
      value = newValue;
      computeValue();
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
