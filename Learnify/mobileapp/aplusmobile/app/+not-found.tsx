import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {useRouter} from "expo-router";
import Back from './(tabs)/Back';
import React from 'react';
import LottieView from 'lottie-react-native';

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <>
    <Back title={''} onBackPress={() => {router.back}} />
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <LottieView
        style={styles.animation}
        source={require('../assets/notfound.json')}
        autoPlay
        loop
        />
        <ThemedText type="title">This screen doesn't exist.</ThemedText>
        <Link href="/HomeScreen" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
        <Link href="/TestAPI" style={styles.link}>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});
