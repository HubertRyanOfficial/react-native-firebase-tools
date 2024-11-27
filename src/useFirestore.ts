import { ToastAndroid } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useCallback, useState } from 'react';

function useFirestore<T>() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T[]>([]);

  const request = useCallback(
    async (
      ref: string,
      schemeFormatter: (data: any) => T[],
      realtime?: boolean
    ) => {
      if (!loading) setLoading(true);
      try {
        let subscriber = () => {};
        if (!realtime) {
          let rawData;
          rawData = await firestore()
            .collection(ref)
            .orderBy('createdAt', 'desc')
            .get();
          let formatedData = schemeFormatter(rawData.docs);
          setData(formatedData);
        } else {
          subscriber = firestore()
            .collection(ref)
            .orderBy('createdAt', 'desc')
            .onSnapshot((snap) => {
              let formatedData = schemeFormatter(snap.docs);
              setData(formatedData);
            });
        }
        return subscriber;
      } catch (error) {
        ToastAndroid.show(`Error query: ${String(error)}`, ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const requestDoc = useCallback(
    async (ref: string, doc: string, realtime?: boolean) => {
      if (!loading) setLoading(true);
      try {
        let subscriber = () => {};
        if (!realtime) {
          let rawData = (
            await firestore().collection(ref).doc(doc).get()
          ).data() as T;

          setData([rawData]);
        } else {
          subscriber = firestore()
            .collection(ref)
            .doc(doc)
            .onSnapshot((snap) => {
              let rawData = snap.data() as T;

              setData([rawData]);
            });
        }
        return subscriber;
      } catch (error) {
        ToastAndroid.show(`Error query: ${String(error)}`, ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const add = useCallback(async (ref: string, data: any) => {
    if (!loading) setLoading(true);
    try {
      await firestore().collection(ref).add(data);
    } catch (error) {
      ToastAndroid.show(`Error add: ${String(error)}`, ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDoc = useCallback(async (ref: string, doc: string) => {
    if (!loading) setLoading(true);
    try {
      await firestore().collection(ref).doc(doc).delete();
    } catch (error) {
      ToastAndroid.show(`Error deleting: ${String(error)}`, ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, data, request, add, deleteDoc, requestDoc };
}

export default useFirestore;
