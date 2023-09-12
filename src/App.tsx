import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '../public/vite.svg';
import CounterDisplay from './pages/CounterDisplay';
import { useCustomAtomValue } from './store/jotai';
import { countAtom } from './store/atoms';
import CounterButton from './components/counter-button';

function App() {
  const [count, setCount] = useState(0);

  const countValue = useCustomAtomValue(countAtom);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-y-4 bg-gradient-to-tr from-blue-400 to-purple-500 text-white p-4">
      <h1>Custom Jotai Counter App</h1>
      <CounterDisplay />
      <CounterButton action="decrement">Decrement {countValue}</CounterButton>
      <CounterButton action="increment">Increment {countValue}</CounterButton>
      <CounterButton action="random">Random {countValue}</CounterButton>
      <CounterButton action="reset">Reset {countValue}</CounterButton>
      <div className="flex flex-col items-center justify-center gap-y-4">
        <a href="https://vitejs.dev" rel="noreferrer" target="_blank">
          <img alt="Vite logo" className="logo" src={viteLogo} />
        </a>
        <a href="https://react.dev" rel="noreferrer" target="_blank">
          <img alt="React logo" className="logo react" src={reactLogo} />
        </a>
      </div>
      <h1 className="text-3xl font-bold underline bg-gray-600 p-4 rounded-lg">
        Vite + React
      </h1>
      <div className="flex flex-col items-center justify-center gap-y-4">
        <button
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setCount((prevCount) => prevCount + 1)}
          type="button"
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
