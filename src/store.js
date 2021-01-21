import { produce, freeze } from 'immer';
import { BehaviorSubject, Observable } from 'rxjs';

const debounceDelay = (debounce, maxDelay) => (observable) => new Observable((observer) => {
  let asyncResource = null;

  const cleanupResource = () => {
    clearTimeout(asyncResource.debounceTimeout);
    clearTimeout(asyncResource.forceTimeout);
    asyncResource = null;
  };
  
  const subscriber = observable.subscribe({
    next: (value) => {
      const notifySubscriber = (type) => {
        console.log('notifyObserver', type, asyncResource.value);
        observer.next(asyncResource.value);
        cleanupResource()
      };
      if (!asyncResource) {
        console.log('createAsyncResource', value);
        const debounceTimeout = setTimeout(notifySubscriber, debounce, 'debounce');
        const forceTimeout = setTimeout(notifySubscriber, maxDelay, 'force');
        asyncResource = {
          debounceTimeout,
          forceTimeout,
          value,
        }
      } else {
        console.log('updateAsyncResource', value);
        clearTimeout(asyncResource.debounceTimeout);
        asyncResource.debounceTimeout = setTimeout(notifySubscriber, debounce, 'debounce');
        asyncResource.value = value;
      }
    },
    error: (err) => {
      observer.error(err);
    },
    complete: () => {
      observer.complete();
    }
  })

  return () => {
    subscriber.unsubscribe();
    if (asyncResource) {
      cleanupResource();
    }
  }
});

export const createStore = ({ initialValue = {}, reducer } = {}) => {
  let state = freeze(initialValue, true);
  const subject = new BehaviorSubject(state);
  const scheduled = subject
    .pipe(debounceDelay(1000, 5000));

  const dispatch = (action) => {
    console.log('dispatch', action);
    state = produce(state, (draft) => reducer(draft, action));
    subject.next(state);
  };

  const subscribe = (fn) => {
    const subscriber = scheduled.subscribe(fn);
    const unsubscribe = () => subscriber.unsubscribe();
    return unsubscribe;
  }

  return {
    dispatch,
    subscribe,
  };
};
