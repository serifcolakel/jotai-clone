import { type PropsWithChildren } from 'react';
import { type ObjectValues } from '../../utilities/typeUtil';
import { countAtom } from '../../store/atoms';
import { useCustomAtom } from '../../store/jotai';

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
    <button
      className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleAction}
      type="button"
    >
      {children}
    </button>
  );
}

export default CounterButton;
