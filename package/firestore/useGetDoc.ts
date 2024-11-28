import { useCallback, useEffect, useRef, useState } from 'react';

import firestore from '@react-native-firebase/firestore';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore/';
import type {
  FirestoreDataResponse,
  FirestoreReturn,
  FirestoreOptions,
} from './types';

function useGetDoc<T extends FirebaseFirestoreTypes.DocumentData>(
  collection: string,
  doc: string,
  options?: FirestoreOptions
): FirestoreReturn<T> {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<(T & FirestoreDataResponse) | null>(null);

  // * fnExecuted: A non-state value using reference to avoid mutiple calls when autoRequest is true
  const fnExecuted = useRef<boolean>(false);

  const request = useCallback(async () => {
    if (!loading) setLoading(true);
    if (error) setError(false);
    if (data) setData(null);

    try {
      const docRef = firestore().collection(collection).doc(doc);
      const getRawData =
        (await docRef.get()) as FirebaseFirestoreTypes.DocumentSnapshot<T>;

      const rawData = {
        id: getRawData.id,
        ...getRawData.data(),
      } as T & FirestoreDataResponse;

      setData(rawData);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [collection, doc, data, error, loading]);

  useEffect(() => {
    if (options && options.autoRequest && !fnExecuted.current) {
      fnExecuted.current = true;
      request();
    }
  }, [options, fnExecuted, request]);

  return { request, loading, error, data };
}

export { useGetDoc };
