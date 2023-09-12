import React from 'react';
import { countAtom } from '../store/atoms';
import { useCustomAtomValue } from '../store/jotai';

function CounterDisplay() {
  const count = useCustomAtomValue(countAtom);

  return (
    <div>
      <h2>Counter Value: {count}</h2>
    </div>
  );
}

export default CounterDisplay;
