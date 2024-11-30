import { StyleSheet, View, Text, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useGetDocs } from 'react-native-firebase-tools';

import { formatterFn } from './services/posts/schema';
import type { PostType } from './services/posts/types';

const postRef = firestore().collection('posts');

export default function App() {
  const { data, loading, request } = useGetDocs<
    PostType,
    { username: string; id: string }
  >(postRef, {
    autoRequest: true,
    snapshot: false,
    formatterFn,
    pagination: {
      limite: 3,
      documentGrouping: false,
    },
  });

  return (
    <View style={styles.container}>
      {loading && !data && <Text>Loading</Text>}
      {!loading && data && <Text>{JSON.stringify(data, null, 2)}</Text>}
      <Button title="Next" onPress={request} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
