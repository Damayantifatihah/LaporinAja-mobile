import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";

import { getUser } from "@/store/auth.store";

interface HomepageProps {
  totalLaporan?: number;
  verifikasi?: number;
  diproses?: number;
  selesai?: number;
  ditolak?: number;
}

export default function Homepage({
  totalLaporan = 12,
  verifikasi = 2,
  diproses = 2,
  selesai = 7,
  ditolak = 1,
}: HomepageProps) {
  const [userName, setUserName] =
    useState("User");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getUser();

        console.log("USER:", user);

        setUserName(
          user?.name ||
            user?.nama ||
            "User"
        );
      } catch (error) {
        console.log(error);
      }
    };

    loadUser();
  }, []);

  const today = new Date().toLocaleDateString(
    "id-ID",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

const stats = [
  {
    label: "Total Laporan",
    value: totalLaporan,
    bg: "#EFF6FF",
    icon: "📋",
  },
  {
    label: "Menunggu",
    value: verifikasi,
    bg: "#DBEAFE",
    icon: "🔵",
  },
  {
    label: "Diproses",
    value: diproses,
    bg: "#FFFBEB",
    icon: "⏳",
  },
  {
    label: "Selesai",
    value: selesai,
    bg: "#F0FDF4",
    icon: "✅",
  },
  {
    label: "Ditolak",
    value: ditolak,
    bg: "#FEF2F2",
    icon: "❌",
  },
];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={
        styles.container
      }
    >
      {/* HERO */}
      <View style={styles.hero}>
        <Image
          source={require("../../../assets/images/welcome.png")}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <View style={styles.overlay} />

        <View style={styles.heroContent}>
          <Text style={styles.date}>
            {today}
          </Text>

          <Text style={styles.welcome}>
            Selamat datang,
          </Text>

          <Text style={styles.username}>
            {userName}
          </Text>

          <Text style={styles.subtitle}>
            Kelola laporan kamu dengan
            mudah dan cepat.
          </Text>
        </View>
      </View>

      {/* STATS */}
      <View
        style={styles.statsContainer}
      >
        {stats.map(
          (item, index) => (
            <View
              key={index}
              style={styles.card}
            >
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor:
                      item.bg,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 18,
                  }}
                >
                  {item.icon}
                </Text>
              </View>

              <View
                style={{ flex: 1 }}
              >
                <Text
                  style={
                    styles.cardValue
                  }
                >
                  {item.value}
                </Text>

                <Text
                  style={
                    styles.cardLabel
                  }
                >
                  {item.label}
                </Text>
              </View>
            </View>
          )
        )}
      </View>

      {/* TIPS */}
      <View style={styles.tipCard}>
        <View style={styles.tipIcon}>
          <Text
            style={{ fontSize: 18 }}
          >
            💡
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={styles.tipTitle}
          >
            Tips: Pastikan foto
            laporan jelas & terang
          </Text>

          <Text
            style={styles.tipText}
          >
            Sertakan foto dan titik
            lokasi yang jelas agar
            laporan kamu diproses
            lebih cepat oleh
            petugas.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },

  hero: {
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    marginBottom: 16,
    backgroundColor: "#FDDCC8",
  },

  heroImage: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: "100%",
  height: "100%",
},

overlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(255,244,238,0.88)",
},
  heroContent: {
    paddingHorizontal: 20,
    zIndex: 2,
  },

  date: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8B3A2A",
    marginBottom: 6,
    textTransform: "uppercase",
  },

  welcome: {
    fontSize: 14,
    color: "#8B5E3C",
  },

  username: {
    fontSize: 28,
    fontWeight: "800",
    color: "#8B3A2A",
    marginTop: 2,
  },

  subtitle: {
    fontSize: 13,
    color: "#A06040",
    marginTop: 6,
    lineHeight: 20,
    maxWidth: 260,
  },

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:
      "space-between",
    marginBottom: 16,
  },

  card: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,

    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,

    elevation: 2,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  cardValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  cardLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 3,
  },

  tipCard: {
    backgroundColor: "#006D62",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor:
      "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  tipTitle: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 4,
  },

  tipText: {
    color:
      "rgba(255,255,255,0.85)",
    fontSize: 12,
    lineHeight: 18,
  },
});