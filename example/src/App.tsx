import { StyleSheet, View, Text } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useGetDoc } from 'react-native-firebase-tools';
interface PostType {
  id: string;
  audioId?: string;
  audioURL: string;
  createdAt: number;
  duration: number;
  extension: string;
  tags: string[];
  totalLoves: number;
  totalPlays: number;
  totalShared: 0;
  userId: string;
  username: string;
  profileURL: string;
}

const postRef = firestore().collection('posts').doc('00HjLZBHOA7QgfmtbyTe');

export default function App() {
  const { data, loading } = useGetDoc<PostType>(postRef, {
    autoRequest: true,
    snapshop: true,
  });

  console.log('Data: ', data);
  console.log('Loading: ', loading);

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
