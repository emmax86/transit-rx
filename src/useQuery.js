import { useEffect } from 'react';
import { useTransitContext } from './TransitContext';

export const useQuery = ({ name, value }) => {
  const { updateValue, removeValue } = useTransitContext();
  useEffect(() => () => {
    removeValue({ name });
  }, [removeValue, name]);

  useEffect(() => {
    updateValue({ name, value })
  }, [updateValue, name, value]);
};
