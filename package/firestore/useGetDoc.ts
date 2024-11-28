import { useCallback, useEffect, useRef, useState } from 'react';

import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import type {
  FirestoreDataResponse,
  FirestoreReturn,
  FirestoreOptions,
} from './types';

function useGetDoc<
  T extends FirebaseFirestoreTypes.DocumentData,
  H extends FirebaseFirestoreTypes.DocumentData = never,
>(ref: any, options?: FirestoreOptions<T, H>): FirestoreReturn<T | H> {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<
    (T & FirestoreDataResponse) | (H & FirestoreDataResponse) | null
  >(null);

  // * fnExecuted: A non-state value using reference to avoid mutiple calls when autoRequest is true
  const fnExecuted = useRef<boolean>(false);
  const unsubscribe = useRef<any>(null);

  const request = useCallback(async () => {
    if (!loading) setLoading(true);
    if (error) setError(false);
    if (data) setData(null);

    try {
      const getRawData = await ref.get();

      let rawData = {
        id: getRawData.id,
        ...getRawData.data(),
      } as T & FirestoreDataResponse;

      if (options && !!options.formatterFn) {
        const { formatterFn } = options;
        rawData = formatterFn(rawData) as any;
      }

      setData(rawData);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [ref, options, data, error, loading]);

  const requestSnapshopt = useCallback(() => {
    if (!loading) setLoading(true);
    if (error) setError(false);
    if (data) setData(null);

    try {
      const currentUnsubscribe = ref.onSnapshot(
        (snap: FirebaseFirestoreTypes.QueryDocumentSnapshot<T>) => {
          let rawData = {
            id: snap.id,
            ...snap.data(),
          } as T & FirestoreDataResponse;

          console.log('Data: ', rawData);

          if (options && !!options.formatterFn) {
            const { formatterFn } = options;
            rawData = formatterFn(rawData) as any;
          }

          setData(rawData);
        },
        () => {
          setData(null);
          setError(true);
        },
        () => {
          setLoading(false);
        }
      );

      unsubscribe.current = currentUnsubscribe;
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [ref, options, data, error, loading]);

  useEffect(() => {
    let unsubscribeState: any;

    if (
      options &&
      options.autoRequest &&
      !options.snapshop &&
      !fnExecuted.current
    ) {
      fnExecuted.current = true;
      request();
    } else if (options && options.snapshop) {
      if (options.snapshop && options.autoRequest && !fnExecuted.current) {
        fnExecuted.current = true;
        requestSnapshopt();
      }
      if (unsubscribe.current) {
        console.log('Hello');
        unsubscribeState = unsubscribe.current;
      }
    }

    return () => unsubscribeState && unsubscribeState();
  }, [options, fnExecuted, request, requestSnapshopt, unsubscribe]);

  return { request, requestSnapshopt, loading, error, data };
}

export { useGetDoc };
