import { useEffect } from 'react';
import { useTransitContext } from "./TransitContext";

export const Listener = () => {
  const { store } = useTransitContext();
  useEffect(() => {
    const unsubscribe = store.subscribe((value) => {
      console.log('fetchHandler', value);
    });
    return () => unsubscribe();
  }, [store])
  return null;
};