import {
  createContext, useContext, useState, useMemo, useCallback, useEffect,
} from 'react';
import { createStore } from './store';

export const TransitContext = createContext({ store: null });

export const useTransitContext = () => useContext(TransitContext);

const actions = {
  UPSERT: 'UPSERT',
  REMOVE: 'REMOVE',
};

/* eslint-disable no-param-reassign */
const reducer = (state, action) => {
  switch (action.type) {
    case actions.UPSERT: {
      state.query[action.name] = action.value;
      break;
    }
    case actions.REMOVE: {
      delete state.query[action.name];
      break;
    }
    default:
  }
};
/* eslint-enable no-param-reassign */

const initializeStore = () => createStore({
  initialValue: { query: {} },
  reducer,
});

export const TransitProvider = ({ children }) => {
  const [store] = useState(initializeStore);

  const updateValue = useCallback(({ name, value }) => {
    store.dispatch({ type: actions.UPSERT, name, value });
  }, [store]);

  const removeValue = useCallback(({ name, value }) => {
    store.dispatch({ type: actions.REMOVE, name, value });
  }, [store]);

  const providerValue = useMemo(() => ({
    store,
    updateValue,
    removeValue,
  }), [store, updateValue, removeValue]);

  useEffect(() => {
    const unsubscribe = store.subscribe((value) => {
      console.log('fetchHandler', value);
    });
    return () => unsubscribe();
  }, [store])

  return (
    <TransitContext.Provider value={providerValue}>
      {children}
    </TransitContext.Provider>
  );
};
