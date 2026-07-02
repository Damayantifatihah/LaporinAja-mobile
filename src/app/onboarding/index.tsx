import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

const { width, height } = Dimensions.get('window');

type Slide = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

const SLIDES: Slide[] = [
  {
    id: '1',
    icon: '📋',
    title: 'Lapor dengan Mudah',
    description:
      'Laporkan masalah di lingkunganmu hanya dengan beberapa ketukan, lengkap dengan foto sebagai bukti.',
  },
  {
    id: '2',
    icon: '📍',
    title: 'Lokasi Akurat',
    description:
      'Tandai lokasi kejadian secara otomatis agar laporanmu lebih akurat dan cepat ditindaklanjuti.',
  },
  {
    id: '3',
    icon: '🔔',
    title: 'Pantau Progres',
    description:
      'Ikuti perkembangan laporanmu secara real-time, dari mulai diverifikasi hingga selesai.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList<Slide>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === SLIDES.length - 1;

  const goToLogin = () => {
    router.replace('/login');
  };

  const handleNext = () => {
    if (isLastSlide) {
      goToLogin();
      return;
    }
    flatListRef.current?.scrollToIndex({
      index: activeIndex + 1,
      animated: true,
    });
  };

  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      <View style={styles.illustrationArea}>
        <View style={styles.circleTopRight} />
        <View style={styles.circleTopRightInner} />
        <View style={styles.circleBottomLeft} />

        <View style={styles.iconPill}>
          <Text style={styles.iconText}>{item.icon}</Text>
        </View>
      </View>

      <View style={styles.textArea}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E05A3A" />

      {!isLastSlide && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={goToLogin}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.skipText}>Lewati</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
      />

      <View style={styles.bottomBar}>
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>
            {isLastSlide ? 'Mulai' : 'Next'}
          </Text>
          <Text style={styles.nextButtonChevron}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  skipButton: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 10,
  },

  skipText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.9,
  },

  slide: {
    width,
  },

  illustrationArea: {
    height: height * 0.55,
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

  iconPill: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },

  iconText: {
    fontSize: 64,
  },

  textArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    letterSpacing: -0.3,
  },

  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 21,
  },

  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: 36,
    alignItems: 'center',
  },

  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },

  dotActive: {
    backgroundColor: '#E05A3A',
    width: 20,
  },

  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E05A3A',
    borderRadius: 30,
    paddingVertical: 16,
    width: '100%',
    gap: 4,
  },

  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  nextButtonChevron: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: -2,
  },
});