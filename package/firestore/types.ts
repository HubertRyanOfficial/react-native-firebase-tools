interface FirestoreDataResponse {
  id: string;
}

interface FirestoreReturn<T> {
  request: () => Promise<void>;
  loading: boolean;
  error: boolean;
  data: (T & FirestoreDataResponse) | null;
}

interface FirestoreOptions {
  formatterFn?: (data: any) => void;
  autoRequest?: boolean;
}

export type { FirestoreOptions, FirestoreReturn, FirestoreDataResponse };
