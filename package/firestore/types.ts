interface FirestoreDataResponse {
  id: string;
}

interface FirestoreReturn<T> {
  request: () => Promise<void>;
  requestSnapshot: () => void;
  loading: boolean;
  error: Error | undefined;
  data: (T & FirestoreDataResponse) | null;
  unsubscribe: any;
}

interface FirestoreOptions<T, H> {
  formatterFn?: (data: T & FirestoreDataResponse) => T | H;
  autoRequest?: boolean;
  snapshot?: boolean;
}

export type { FirestoreOptions, FirestoreReturn, FirestoreDataResponse };
