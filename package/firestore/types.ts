interface FirestoreDataResponse {
  id: string;
}

interface FirestoreReturn<T> {
  request: () => Promise<void>;
  requestSnapshopt: () => void;
  loading: boolean;
  error: boolean;
  data: (T & FirestoreDataResponse) | null;
}

interface FirestoreOptions<T, H> {
  formatterFn?: (data: T & FirestoreDataResponse) => T | H;
  autoRequest?: boolean;
  snapshop?: boolean;
}

export type { FirestoreOptions, FirestoreReturn, FirestoreDataResponse };
