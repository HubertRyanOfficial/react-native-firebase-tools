import { StyleSheet, View, Text } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useGetDoc } from 'react-native-firebase-tools';

import { formatterFn } from './services/posts/schema';
import type { PostType } from './services/posts/types';

const postRef = firestore().collection('posts').doc('00HjLZBHOA7QgfmtbyTe');

export default function App() {
  const { data, loading } = useGetDoc<
    PostType,
    { username: string; id: string }
  >(postRef, {
    autoRequest: true,
    snapshop: true,
    formatterFn,
  });

  return (
    <View style={styles.container}>
      {loading && !data && <Text>Loading</Text>}
      {!loading && data && <Text>{JSON.stringify(data, null, 2)}</Text>}
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
