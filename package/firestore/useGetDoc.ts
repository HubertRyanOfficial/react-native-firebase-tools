import { useCallback, useEffect, useRef, useState } from 'react';

import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore/';
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

  const request = useCallback(async () => {
    if (!loading) setLoading(true);
    if (error) setError(false);
    if (data) setData(null);

    try {
      if (!ref)
        throw 'RNFirebaseTools needs the reference to request in server. Create your reference using firestore module from @react-native-firebase/firestore';

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

  useEffect(() => {
    if (options && options.autoRequest && !fnExecuted.current) {
      fnExecuted.current = true;
      request();
    }
  }, [options, fnExecuted, request]);

  return { request, loading, error, data };
}

export { useGetDoc };
