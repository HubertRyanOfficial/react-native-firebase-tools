import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import type {
  FirestoreDataResponse,
  FirestoreDocsReturn,
  FirestoreDocsOptions,
} from './types';

import { getRefProperties } from '../utils/getFirestoreRefProperties';
import { NO_SUPPORT_PAGINATION_REALTIME } from './message';

function useGetDocs<
  T extends FirebaseFirestoreTypes.DocumentData,
  H extends FirebaseFirestoreTypes.DocumentData = never,
>(
  ref:
    | FirebaseFirestoreTypes.CollectionReference
    | FirebaseFirestoreTypes.Query,
  options?: FirestoreDocsOptions<T, H>
): FirestoreDocsReturn<T | H> {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const [data, setData] = useState<((T | H) & FirestoreDataResponse)[]>([]);

  const [lastDocument, setLastDocument] =
    useState<FirebaseFirestoreTypes.QueryDocumentSnapshot<T> | null>(null);
  const [end, setEnd] = useState<boolean>(false);

  // * fnExecuted: A non-state value using reference to avoid mutiple calls when autoRequest is true
  const fnExecuted = useRef<boolean>(false);
  const unsubscribe = useRef<any>(null);

  const hasPagination = useMemo(() => {
    if (
      options &&
      ((typeof options?.pagination !== 'undefined' &&
        typeof options?.pagination === 'boolean' &&
        options?.pagination === true) ||
        typeof options?.pagination === 'object')
    ) {
      return true;
    }

    return false;
  }, [options]);

  // * A request can be made to just get the documents without real-time updates.
  const request = useCallback(async () => {
    if (!loading) setLoading(true);
    if (error) setError(undefined);
    if (
      (data && data.length > 0 && !lastDocument) ||
      (data && data.length > 0 && options && !hasPagination)
    )
      setData([]);

    try {
      let getRawData: FirebaseFirestoreTypes.QuerySnapshot;

      if (options && options.pagination && end) {
        setError(undefined);
        setLoading(false);
        return;
      }

      // * Creating the reference with the pagination options and verifying if the list  ended
      if (hasPagination) {
        getRawData = await (
          !lastDocument ? ref : ref.startAfter(lastDocument)
        ).get();
      } else {
        getRawData = await ref.get();
      }

      let rawData = getRawData.docs.map(
        (currentDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
          id: currentDoc.id,
          ...currentDoc.data(),
        })
      ) as (T & FirestoreDataResponse)[];

      if (hasPagination && !getRawData.empty) {
        setLastDocument(
          getRawData.docs[0] as FirebaseFirestoreTypes.QueryDocumentSnapshot<T>
        );
      }

      if (hasPagination) {
        const limitByRef = getRefProperties(ref, 'limit') as number | undefined;

        if (
          (limitByRef && getRawData.docs.length < limitByRef) ||
          getRawData.empty
        ) {
          setEnd(true);
        }
      }

      if (options && !!options.formatterFn) {
        const { formatterFn } = options;
        rawData = formatterFn(rawData) as any;
      }

      setData(
        hasPagination &&
          typeof options?.pagination === 'object' &&
          options.pagination.documentGrouping
          ? [...data, ...rawData]
          : rawData
      );
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [ref, options, data, error, loading, lastDocument, end, hasPagination]);

  // * A request Snapshot you can read and receive real-time data and a unsubscribe function will be deliveried.
  const requestSnapshot = useCallback(() => {
    if (!loading) setLoading(true);
    if (error) setError(undefined);
    if (data && data.length > 0) setData([]);

    if (hasPagination) throw new Error(NO_SUPPORT_PAGINATION_REALTIME);

    const currentUnsubscribe = ref.onSnapshot({
      complete: () => {
        setLoading(false);
      },
      error: (e: Error) => {
        setData([]);
        setError(e);
        setLoading(false);
      },
      next: (snap: FirebaseFirestoreTypes.QuerySnapshot) => {
        let rawData = snap.docs.map(
          (currentDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
            id: currentDoc.id,
            ...currentDoc.data(),
          })
        ) as (T & FirestoreDataResponse)[];

        if (options && !!options.formatterFn) {
          const { formatterFn } = options;
          rawData = formatterFn(rawData) as any;
        }

        setLoading(false);
        setData(rawData);
      },
    });

    unsubscribe.current = currentUnsubscribe;
  }, [ref, options, data, error, loading, hasPagination]);

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

  return {
    request,
    requestSnapshot,
    loading,
    error,
    data,
    unsubscribe,
    end,
    lastDocument,
  };
}

export { useGetDocs };
