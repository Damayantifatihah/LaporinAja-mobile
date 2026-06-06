import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";
import { MapPin, Calendar } from "lucide-react-native";
import CommentsSection from "./commentsSection";
  
interface Props {
  laporan: {
    id: number;
    judul_laporan: string;
    isi_laporan: string;
    lokasi: string;
    status: string;
    gambar: string[];
    user_name: string;
    created_at?: string;
  };
}

const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; dot: string; label: string }
> = {
  selesai:    { bg: "#ECFDF5", text: "#047857", dot: "#10B981", label: "Selesai"  },
  diproses:   { bg: "#FFFBEB", text: "#B45309", dot: "#F59E0B", label: "Diproses" },
  ditolak:    { bg: "#FEF2F2", text: "#B91C1C", dot: "#EF4444", label: "Ditolak"  },
  verifikasi: { bg: "#EFF6FF", text: "#1D4ED8", dot: "#60A5FA", label: "Menunggu" },
};

const AVATAR_COLORS = ["#F59E0B","#10B981","#3B82F6","#EC4899","#8B5CF6","#F97316"];

function getAvatarColor(name: string) {
  return AVATAR_COLORS[(name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];
}

export default function LaporanCard({ laporan }: Props) {
  const status = STATUS_CONFIG[laporan.status] ?? STATUS_CONFIG.verifikasi;

  const formattedDate = laporan.created_at
    ? new Date(laporan.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userRow}>
          <View style={[styles.avatar, { backgroundColor: getAvatarColor(laporan.user_name) }]}>
            <Text style={styles.avatarText}>
              {laporan.user_name?.charAt(0)?.toUpperCase()}
            </Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{laporan.user_name}</Text>
            <View style={styles.metaRow}>
              <MapPin size={11} color="#9CA3AF" />
              <Text style={styles.metaText} numberOfLines={1}>
                {laporan.lokasi}
              </Text>
              {formattedDate && (
                <>
                  <Text style={styles.metaDot}>·</Text>
                  <Calendar size={11} color="#9CA3AF" />
                  <Text style={styles.metaText}>{formattedDate}</Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Status badge */}
        <View style={[styles.badge, { backgroundColor: status.bg }]}>
          <View style={[styles.badgeDot, { backgroundColor: status.dot }]} />
          <Text style={[styles.badgeText, { color: status.text }]}>{status.label}</Text>
        </View>
      </View>

      {/* Image */}
      {laporan.gambar?.length > 0 && (
        <Image
          source={{ uri: laporan.gambar[0] }}
          resizeMode="cover"
          style={styles.image}
        />
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{laporan.judul_laporan}</Text>
        <Text style={styles.body} numberOfLines={3}>
          {laporan.isi_laporan}
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Comments */}
      <View style={styles.commentsWrapper}>
        <CommentsSection laporanId={laporan.id} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    // Shadow iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    // Shadow Android
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
    flexWrap: "nowrap",
  },
  metaText: {
    fontSize: 11,
    color: "#9CA3AF",
    marginLeft: 3,
    flexShrink: 1,
  },
  metaDot: {
    fontSize: 11,
    color: "#D1D5DB",
    marginHorizontal: 5,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  image: {
    width: "100%",
    height: 210,
    backgroundColor: "#F9FAFB",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  body: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 16,
  },
  commentsWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});