import type { PostType } from './types';
import type { FirestoreDataResponse } from 'react-native-firebase-tools';

type FormatterDataType = FirestoreDataResponse & PostType;

export function formatterFn(data: FormatterDataType) {
  return {
    id: data.id,
    username: data.username,
    createdAt: data.createdAt,
  };
}
