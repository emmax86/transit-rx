import { useCallback, useState } from 'react';
import { Counter } from './Counter';
// import { Listener } from './Listener';gaa
import { TransitProvider } from './TransitContext';

const App = () => {
  const [name, setName] = useState('a');
  const onChangeName = useCallback((e) => setName(e.target.value), []);
  return (
    <TransitProvider>
      {/* <Listener /> */}
      <select value={name} onChange={onChangeName}>
        <option value="a">a</option>
        <option value="c">c</option>
      </select>
      <Counter key={name} name={name} queryName={name} />
      <Counter name="b" queryName="b" />
    </TransitProvider>
  );
}


export default App;
