import { useCallback, useEffect, useRef, useState } from 'react';

import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import type {
  FirestoreDataResponse,
  FirestoreDocReturn,
  FirestoreDocOptions,
} from './types';

function useGetDoc<
  T extends FirebaseFirestoreTypes.DocumentData,
  H extends FirebaseFirestoreTypes.DocumentData = never,
>(
  ref: FirebaseFirestoreTypes.DocumentReference,
  options?: FirestoreDocOptions<T, H>
): FirestoreDocReturn<T | H> {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const [data, setData] = useState<FirestoreDataResponse<T | H> | null>(null);

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
      } as FirestoreDataResponse<T>;

      if (options && !!options.normalizer) {
        const { normalizer } = options;
        rawData = normalizer(rawData) as any;
      }

      setData(rawData);
    } catch (e) {
      setError(undefined);
    } finally {
      setLoading(false);
    }
  }, [ref, options, data, error, loading]);

  // * A request Snapshot you can read and receive real-time data and a unsubscribe function will be deliveried.
  const requestSnapshot = useCallback(() => {
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
      next: (snap: FirebaseFirestoreTypes.DocumentSnapshot) => {
        setLoading(false);

        let rawData = {
          id: snap.id,
          ...snap.data(),
        } as FirestoreDataResponse<T>;

        if (options && !!options.normalizer) {
          const { normalizer } = options;
          rawData = normalizer(rawData) as any;
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
      !options.snapshot &&
      !fnExecuted.current
    ) {
      fnExecuted.current = true;
      request();
    } else if (
      options &&
      options.snapshot &&
      options.autoRequest &&
      !fnExecuted.current
    ) {
      fnExecuted.current = true;
      requestSnapshot();
    }
  }, [options, fnExecuted, request, requestSnapshot]);

  useEffect(() => {
    let unsubscribeState: any;
    if (unsubscribe.current) {
      unsubscribeState = unsubscribe.current;
    }

    return () => unsubscribeState && unsubscribeState();
  }, [unsubscribe]);

  return { request, requestSnapshot, loading, error, data, unsubscribe };
}

export { useGetDoc };
