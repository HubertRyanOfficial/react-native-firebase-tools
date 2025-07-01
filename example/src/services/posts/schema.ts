import type { PostType } from './types';
import type { FirestoreDataResponse } from 'react-native-firebase-tools';

export function normalizer(data: FirestoreDataResponse<PostType>[]) {
  return data.map((post) => ({
    id: post.id,
    username: post.username,
    createdAt: post.createdAt,
  }));
}
