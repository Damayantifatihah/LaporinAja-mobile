import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { RefreshCw } from "lucide-react-native";
import api from "@/services/api";
import LaporanCard from "./laporanCard";

interface Laporan {
  id: number;
  judul_laporan: string;
  isi_laporan: string;
  lokasi: string;
  status: string;
  gambar: string[];
  user_name: string;
  created_at?: string;
}

export default function LaporanFeed() {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchLaporan = async () => {
    try {
      setError(false);
      const res = await api.get("/laporan");
      setLaporan(res.data.data);
    } catch (err) {
      console.log("Gagal memuat laporan:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerState}>
        <ActivityIndicator size="small" color="#B45743" />
        <Text style={styles.stateText}>Memuat laporan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.stateText}>Gagal memuat laporan</Text>
        <TouchableOpacity onPress={fetchLaporan} style={styles.retryButton} activeOpacity={0.8}>
          <RefreshCw size={14} color="#FFFFFF" />
          <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (laporan.length === 0) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.emptyText}>Belum ada laporan</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.accentBar} />
          <Text style={styles.sectionTitle}>Laporan Terbaru</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{laporan.length} laporan</Text>
        </View>
      </View>

      {laporan.map((item) => (
        <LaporanCard key={item.id} laporan={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  centerState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 10,
  },
  stateText: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#B45743",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 4,
    // shadow
    shadowColor: "#B45743",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  accentBar: {
    width: 4,
    height: 18,
    backgroundColor: "#B45743",
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: -0.2,
  },
  countBadge: {
    backgroundColor: "#FDF0ED",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  countText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#B45743",
  },
});