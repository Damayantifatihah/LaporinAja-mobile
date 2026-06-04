import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";

import api from "@/services/api";
import { getToken } from "@/store/auth.store";

interface Laporan {
  id: number;
  judul_laporan: string;
  isi_laporan: string;
  lokasi: string;
  tanggal_kejadian: string;
  status: string;
  category_name: string;
  gambar?: string[];
  tanggapan?: string;
}

const PRIMARY = "#B45743";

export default function LaporanSaya() {
  const [laporan, setLaporan] =
    useState<Laporan[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [filter, setFilter] =
    useState("Semua");

  const [search, setSearch] =
    useState("");

  const statuses = [
    "Semua",
    "Verifikasi",
    "Diproses",
    "Selesai",
    "Ditolak",
  ];

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    try {
      setLoading(true);

      const token =
        await getToken();

      const res = await api.get(
        "/laporan/saya",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        res.data?.data || [];

      const formatted =
        data.map((item: any) => {
          let gambar: string[] = [];

          if (
            Array.isArray(item.gambar)
          ) {
            gambar = item.gambar;
          }

          return {
            ...item,
            gambar,
          };
        });

      setLaporan(formatted);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (
    status: string
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "proses":
        return "Diproses";

      case "selesai":
        return "Selesai";

      case "ditolak":
        return "Ditolak";

      default:
        return "Verifikasi";
    }
  };

  const filtered =
    laporan.filter((item) => {
      const matchStatus =
        filter === "Semua" ||
        formatStatus(
          item.status
        ) === filter;

      const matchSearch =
        item.judul_laporan
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        item.lokasi
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      return (
        matchStatus &&
        matchSearch
      );
    });

  const countOf = (
    status: string
  ) =>
    laporan.filter(
      (item) =>
        formatStatus(
          item.status
        ) === status
    ).length;

  if (loading) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
          color={PRIMARY}
        />
        <Text
          style={{
            marginTop: 12,
          }}
        >
          Memuat laporan...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={
        false
      }
    >
      <Text style={styles.title}>
        Laporan Saya
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        Pantau status laporan
        yang telah dikirim
      </Text>

      {/* STATS */}

      <View
        style={
          styles.statsContainer
        }
      >
        {[
          "Verifikasi",
          "Diproses",
          "Selesai",
          "Ditolak",
        ].map((s) => (
          <View
            key={s}
            style={
              styles.statCard
            }
          >
            <Text
              style={
                styles.statNumber
              }
            >
              {countOf(s)}
            </Text>

            <Text
              style={
                styles.statLabel
              }
            >
              {s}
            </Text>
          </View>
        ))}
      </View>

      {/* SEARCH */}

      <TextInput
        placeholder="Cari laporan..."
        value={search}
        onChangeText={setSearch}
        style={
          styles.searchInput
        }
      />

      {/* FILTER */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        style={{
          marginBottom: 15,
        }}
      >
        {statuses.map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() =>
              setFilter(s)
            }
            style={[
              styles.filterBtn,
              filter === s &&
                styles.activeFilter,
            ]}
          >
            <Text
              style={{
                color:
                  filter === s
                    ? "#fff"
                    : "#555",
              }}
            >
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LIST */}

      {filtered.map((item) => (
        <View
          key={item.id}
          style={
            styles.card
          }
        >
          <Text
            style={
              styles.category
            }
          >
            {
              item.category_name
            }
          </Text>

          <Text
            style={
              styles.cardTitle
            }
          >
            {
              item.judul_laporan
            }
          </Text>

          <Text
            style={
              styles.status
            }
          >
            Status:
            {" "}
            {formatStatus(
              item.status
            )}
          </Text>

          <Text
            style={
              styles.info
            }
          >
            📍 {item.lokasi}
          </Text>

          <Text
            style={
              styles.info
            }
          >
            📅{" "}
            {
              item.tanggal_kejadian
            }
          </Text>

          <Text
            style={
              styles.desc
            }
          >
            {
              item.isi_laporan
            }
          </Text>

          {item.gambar &&
            item.gambar.length >
              0 && (
              <ScrollView
                horizontal
              >
                {item.gambar.map(
                  (
                    img,
                    idx
                  ) => (
                    <Image
                      key={idx}
                      source={{
                        uri: `http://10.211.220.58:5000/uploads/${img}`,
                      }}
                      style={
                        styles.image
                      }
                    />
                  )
                )}
              </ScrollView>
            )}

          {item.tanggapan ? (
            <View
              style={
                styles.responseBox
              }
            >
              <Text
                style={{
                  fontWeight:
                    "700",
                  color:
                    PRIMARY,
                }}
              >
                Tanggapan
                Admin
              </Text>

              <Text>
                {
                  item.tanggapan
                }
              </Text>
            </View>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#F8F8F8",
      padding: 16,
    },

    loadingContainer: {
      flex: 1,
      justifyContent:
        "center",
      alignItems: "center",
    },

    title: {
      fontSize: 24,
      fontWeight: "800",
    },

    subtitle: {
      color: "#666",
      marginBottom: 15,
    },

    statsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent:
        "space-between",
      marginBottom: 15,
    },

    statCard: {
      width: "48%",
      backgroundColor:
        "#fff",
      borderRadius: 12,
      padding: 15,
      marginBottom: 10,
    },

    statNumber: {
      fontSize: 22,
      fontWeight: "800",
      color: PRIMARY,
    },

    statLabel: {
      color: "#666",
      marginTop: 4,
    },

    searchInput: {
      backgroundColor:
        "#fff",
      borderRadius: 12,
      paddingHorizontal: 14,
      height: 50,
      marginBottom: 12,
    },

    filterBtn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor:
        "#fff",
      marginRight: 8,
    },

    activeFilter: {
      backgroundColor:
        PRIMARY,
    },

    card: {
      backgroundColor:
        "#fff",
      borderRadius: 16,
      padding: 16,
      marginBottom: 14,
    },

    category: {
      color: PRIMARY,
      fontWeight: "700",
      marginBottom: 5,
    },

    cardTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 8,
    },

    status: {
      marginBottom: 5,
      fontWeight: "600",
    },

    info: {
      color: "#666",
      marginBottom: 3,
    },

    desc: {
      marginTop: 10,
      lineHeight: 22,
    },

    image: {
      width: 120,
      height: 120,
      borderRadius: 12,
      marginRight: 10,
      marginTop: 10,
    },

    responseBox: {
      marginTop: 12,
      backgroundColor:
        "#F9EAE7",
      borderRadius: 12,
      padding: 12,
    },
  });