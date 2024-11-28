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
  const [error, setError] = useState<Error | undefined>();
  const [data, setData] = useState<
    (T & FirestoreDataResponse) | (H & FirestoreDataResponse) | null
  >(null);

  // * fnExecuted: A non-state value using reference to avoid mutiple calls when autoRequest is true
  const fnExecuted = useRef<boolean>(false);
  const unsubscribe = useRef<any>(null);

  // * A request can be made to just get a document without real-time updates.
  const request = useCallback(async () => {
    if (!loading) setLoading(true);
    if (error) setError(undefined);
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
      setError(undefined);
    } finally {
      setLoading(false);
    }
  }, [ref, options, data, error, loading]);

  // * A request Snapshot you can read and receive real-time data and a unsubscribe function will be deliveried.
  const requestSnapshopt = useCallback(() => {
    if (!loading) setLoading(true);
    if (error) setError(undefined);
    if (data) setData(null);

    const currentUnsubscribe = ref.onSnapshot({
      complete: () => {
        setLoading(false);
      },
      error: (e: Error) => {
        setData(null);
        setError(e);
      },
      next: (snap: FirebaseFirestoreTypes.QueryDocumentSnapshot<T>) => {
        setLoading(false);

        let rawData = {
          id: snap.id,
          ...snap.data(),
        } as T & FirestoreDataResponse;

        if (options && !!options.formatterFn) {
          const { formatterFn } = options;
          rawData = formatterFn(rawData) as any;
        }

        setData(rawData);
      },
    });

    unsubscribe.current = currentUnsubscribe;
  }, [ref, options, data, error, loading]);

  useEffect(() => {
    if (
      options &&
      options.autoRequest &&
      !options.snapshop &&
      !fnExecuted.current
    ) {
      fnExecuted.current = true;
      request();
    } else if (
      options &&
      options.snapshop &&
      options.snapshop &&
      options.autoRequest &&
      !fnExecuted.current
    ) {
      fnExecuted.current = true;
      requestSnapshopt();
    }
  }, [options, fnExecuted, request, requestSnapshopt]);

  useEffect(() => {
    let unsubscribeState: any;
    if (unsubscribe.current) {
      unsubscribeState = unsubscribe.current;
    }

    return () => unsubscribeState && unsubscribeState();
  }, [unsubscribe]);

  return { request, requestSnapshopt, loading, error, data, unsubscribe };
}

export { useGetDoc };
