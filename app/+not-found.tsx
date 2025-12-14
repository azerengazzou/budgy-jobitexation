import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { styles } from '../components/style/notFound.styles';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found' }} />
      <View style={styles.container}>
        <Text style={styles.text}>Sorry, this page doesn't exist.</Text>
        <Link href="/(tabs)" style={styles.link}>
          <Text style={styles.text}>Return to Dashboard</Text>
        </Link>
      </View>
    </>
  );
}
