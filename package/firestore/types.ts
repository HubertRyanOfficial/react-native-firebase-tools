import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
interface FirestoreDataResponse {
  id: string;
}

interface FirestoreDocReturn<T extends FirebaseFirestoreTypes.DocumentData> {
  request: () => Promise<void>;
  requestSnapshot: () => void;
  loading: boolean;
  error: Error | undefined;
  data: (T & FirestoreDataResponse) | null;
  unsubscribe: any;
}

interface FirestoreDocOptions<T, H> {
  formatterFn?: (data: T & FirestoreDataResponse) => T | H;
  autoRequest?: boolean;
  snapshot?: boolean;
}

interface FirestoreDocsReturn<T extends FirebaseFirestoreTypes.DocumentData> {
  request: () => Promise<void>;
  requestSnapshot: () => void;
  loading: boolean;
  error: Error | undefined;
  data: (T & FirestoreDataResponse)[];
  unsubscribe: any;
  end: boolean;
  lastDocument: FirebaseFirestoreTypes.QueryDocumentSnapshot<T> | null;
}

interface FirestoreDocsOptions<T, H> {
  formatterFn?: (data: (T & FirestoreDataResponse)[]) => T[] | H[];
  autoRequest?: boolean;
  snapshot?: boolean;
  pagination?: {
    documentGrouping?: boolean;
  };
}

export type {
  FirestoreDocOptions,
  FirestoreDocReturn,
  FirestoreDataResponse,
  FirestoreDocsReturn,
  FirestoreDocsOptions,
};
