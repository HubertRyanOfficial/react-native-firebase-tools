import type { PostType } from './types';
import type { FirestoreDataResponse } from 'react-native-firebase-tools';

type FormatterDataType = FirestoreDataResponse & PostType;

export function formatterFn(data: FormatterDataType[]) {
  return data.map((post) => ({
    id: post.id,
    username: post.username,
    createdAt: post.createdAt,
  }));
}
