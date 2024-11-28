import { StyleSheet, View, Text } from 'react-native';
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

export default function App() {
  const { data, loading } = useGetDoc<PostType>(
    'posts',
    '00HjLZBHOA7QgfmtbyTe',
    {
      autoRequest: true,
    }
  );

  return (
    <View style={styles.container}>
      {loading && !data && <Text>Loading</Text>}
      {!loading && data && <Text>{data.username}</Text>}
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
