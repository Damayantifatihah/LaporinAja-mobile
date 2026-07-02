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
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const monoFont = Platform.select({
  ios: 'Courier',
  android: 'monospace',
  default: 'monospace',
});

type Slide = {
  id: string;
  code: string;
  icon: string;
  stamp: string;
  title: string;
  description: string;
};

const SLIDES: Slide[] = [
  {
    id: '1',
    code: 'LAPOR',
    icon: '📋',
    stamp: 'BARU',
    title: 'Lapor dengan Mudah',
    description:
      'Laporkan masalah di lingkunganmu hanya dengan beberapa ketukan, lengkap dengan foto sebagai bukti.',
  },
  {
    id: '2',
    code: 'LOKASI',
    icon: '📍',
    stamp: 'AKURAT',
    title: 'Lokasi Akurat',
    description:
      'Tandai lokasi kejadian secara otomatis agar laporanmu lebih akurat dan cepat ditindaklanjuti.',
  },
  {
    id: '3',
    code: 'STATUS',
    icon: '🔔',
    stamp: 'TERPANTAU',
    title: 'Pantau Progres',
    description:
      'Ikuti perkembangan laporanmu secara real-time, dari mulai diverifikasi hingga selesai.',
  },
];

const PERFORATION_COUNT = 16;

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList<Slide>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === SLIDES.length - 1;

  const goToLogin = () => {
    router.replace('/login');
  };

  const goToIndex = (index: number) => {
    flatListRef.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
    setActiveIndex(index);
  };

  const handleNext = () => {
    if (isLastSlide) {
      goToLogin();
      return;
    }
    goToIndex(activeIndex + 1);
  };

  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const renderItem = ({ item, index }: { item: Slide; index: number }) => (
    <View style={styles.slide}>
      {/* ===== AREA WARNA (BAGIAN ATAS TIKET) ===== */}
      <View style={styles.ticketTop}>
        <Text style={styles.watermark}>{item.icon}</Text>

        <View style={styles.circleGlow} />
        <View style={styles.dotAccentA} />
        <View style={styles.dotAccentB} />

        <View style={styles.stampWrapper}>
          <View style={styles.stamp}>
            <Text style={styles.stampIcon}>{item.icon}</Text>
            <View style={styles.stampDivider} />
            <Text style={styles.stampLabel}>{item.stamp}</Text>
          </View>
        </View>
      </View>

      {/* ===== SOBEKAN PERFORASI ===== */}
      <View style={styles.perforationRow}>
        {Array.from({ length: PERFORATION_COUNT }).map((_, i) => (
          <View key={i} style={styles.perforationHole} />
        ))}
      </View>

      {/* ===== AREA KERTAS (BAGIAN BAWAH TIKET) ===== */}
      <View style={styles.ticketBottom}>
        <View style={styles.ticketHeaderRow}>
          <Text style={styles.ticketBrand}>LAPORINAJA</Text>
          <Text style={styles.ticketNumber}>
            {item.code} · {String(index + 1).padStart(2, '0')}/
            {String(SLIDES.length).padStart(2, '0')}
          </Text>
        </View>

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
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      <View style={styles.bottomBar}>
        <View style={styles.stubsContainer}>
          {SLIDES.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => goToIndex(index)}
              hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}
            >
              <View
                style={[
                  styles.stub,
                  index === activeIndex && styles.stubActive,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>
            {isLastSlide ? 'Mulai Sekarang' : 'Lanjut'}
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
    backgroundColor: '#E05A3A',
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

  ticketTop: {
    height: height * 0.46,
    backgroundColor: '#E05A3A',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  watermark: {
    position: 'absolute',
    fontSize: 260,
    opacity: 0.1,
    top: -30,
    right: -50,
    transform: [{ rotate: '-12deg' }],
  },

  circleGlow: {
    position: 'absolute',
    bottom: -width * 0.35,
    left: -width * 0.25,
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width * 0.375,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },

  dotAccentA: {
    position: 'absolute',
    top: '20%',
    left: '12%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },

  dotAccentB: {
    position: 'absolute',
    bottom: '26%',
    left: '20%',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },

  stampWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  stamp: {
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.75)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-6deg' }],
  },

  stampIcon: {
    fontSize: 52,
  },

  stampDivider: {
    width: 36,
    height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.6)',
    marginVertical: 8,
  },

  stampLabel: {
    fontFamily: monoFont,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
  },

  perforationRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#E05A3A',
    height: 10,
    transform: [{ translateY: -5 }],
  },

  perforationHole: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFF8F0',
  },

  ticketBottom: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    paddingHorizontal: 28,
    paddingTop: 18,
  },

  ticketHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: '#E3D5C7',
    paddingBottom: 14,
    marginBottom: 20,
  },

  ticketBrand: {
    fontFamily: monoFont,
    fontSize: 12,
    fontWeight: '700',
    color: '#C6461F',
    letterSpacing: 1.5,
  },

  ticketNumber: {
    fontFamily: monoFont,
    fontSize: 12,
    color: '#A8927F',
    letterSpacing: 0.5,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2B2118',
    letterSpacing: -0.3,
  },

  description: {
    fontSize: 14,
    color: '#8A7A6D',
    marginTop: 10,
    lineHeight: 21,
  },

  bottomBar: {
    backgroundColor: '#FFF8F0',
    paddingHorizontal: 28,
    paddingBottom: 36,
    paddingTop: 12,
  },

  stubsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },

  stub: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E3D5C7',
  },

  stubActive: {
    backgroundColor: '#E05A3A',
    width: 36,
  },

  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2B2118',
    borderRadius: 16,
    paddingVertical: 17,
    width: '100%',
    gap: 4,
  },

  nextButtonText: {
    color: '#FFF8F0',
    fontSize: 16,
    fontWeight: '600',
  },

  nextButtonChevron: {
    color: '#E05A3A',
    fontSize: 20,
    fontWeight: '700',
    marginTop: -2,
  },
});