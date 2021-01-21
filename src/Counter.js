import { useCallback, useState } from 'react';
import { useQuery } from './useQuery';

export const Counter = ({ name, queryName }) => {
  const [counter, setCounter] = useState(0);
  const increment = useCallback(() => setCounter((c) => c + 1), []);

  useQuery({ name: queryName, value: counter });
  
  return (
    <div>
      <span>
        Clicked {name} {counter} times
      </span>
      <button type="button" onClick={increment}>Increment {name}</button>
    </div>
  );
};
