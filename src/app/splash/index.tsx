import { useRouter } from 'expo-router';

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoPulse = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.spring(logoPulse, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E05A3A" />

      <View style={styles.circleTopRight} />
      <View style={styles.circleTopRightInner} />
      <View style={styles.circleBottomLeft} />

      <View style={styles.centerContent}>
        <Animated.View
          style={[styles.logoPill, { transform: [{ scale: logoPulse }] }]}
        >
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      <Animated.View
        style={[
          styles.bottomContent,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.headline}>Lapor dengan Mudah</Text>
        <Text style={styles.subheadline}>Selesaikan Masalah Bersama</Text>

        <View style={styles.chevronContainer}>
          <Text style={styles.chevron}>⌄</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E05A3A',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  circleTopRight: {
    position: 'absolute',
    top: -width * 0.25,
    right: -width * 0.2,
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: width * 0.425,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },

  circleTopRightInner: {
    position: 'absolute',
    top: -width * 0.05,
    right: -width * 0.3,
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: width * 0.325,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  circleBottomLeft: {
    position: 'absolute',
    bottom: -width * 0.2,
    left: -width * 0.25,
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width * 0.375,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },

  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },

  logoImage: {
    width: 180,
    height: 48,
  },

  dotsContainer: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 8,
    alignItems: 'center',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },

  dotActive: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },

  bottomContent: {
    paddingBottom: 60,
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  headline: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.3,
  },

  subheadline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '400',
  },

  chevronContainer: {
    marginTop: 24,
  },

  chevron: {
    fontSize: 28,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 28,
  },
});