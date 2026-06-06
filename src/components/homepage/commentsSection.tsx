import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import {
  MessageCircle,
  Send,
} from "lucide-react-native";

import api from "@/services/api";

interface Props {
  laporanId: number;
}

interface Comment {
  id: number;
  comment: string;
  name: string;
}

function avatarColor(name: string) {
  const colors = [
    ["#FDE68A", "#F59E0B"],
    ["#BFDBFE", "#3B82F6"],
    ["#BBF7D0", "#10B981"],
    ["#FBCFE8", "#EC4899"],
    ["#DDD6FE", "#8B5CF6"],
    ["#FED7AA", "#F97316"],
  ];

  const idx =
    (name?.charCodeAt(0) ?? 0) %
    colors.length;

  return colors[idx];
}

export default function CommentSection({
  laporanId,
}: Props) {
  const [comments, setComments] =
    useState<Comment[]>([]);

  const [comment, setComment] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const fetchComments = async () => {
    try {
      const res = await api.get(
        `/comments/${laporanId}`
      );

      setComments(res.data);
    } catch (error) {
      console.log(
        "Gagal memuat komentar:",
        error
      );
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      setLoading(true);

      await api.post("/comments", {
        laporan_id: laporanId,
        comment,
      });

      setComment("");

      await fetchComments();
    } catch (error) {
      console.log(
        "Gagal mengirim komentar:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [laporanId]);

  return (
    <View>
      {/* Header */}
      <View style={styles.commentHeader}>
        <MessageCircle
          size={12}
          color="#9CA3AF"
        />

        <Text style={styles.commentCount}>
          {comments.length > 0
            ? `${comments.length} Komentar`
            : "Komentar"}
        </Text>
      </View>

      {/* List Komentar */}
      {comments.map((item) => {
        const [, text] =
          avatarColor(item.name);

        return (
          <View
            key={item.id}
            style={styles.commentRow}
          >
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor:
                    text,
                },
              ]}
            >
              <Text
                style={
                  styles.avatarText
                }
              >
                {item.name
                  ?.charAt(0)
                  ?.toUpperCase()}
              </Text>
            </View>

            <View
              style={
                styles.commentBubble
              }
            >
              <Text
                style={
                  styles.commentName
                }
              >
                {item.name}
              </Text>

              <Text
                style={
                  styles.commentText
                }
              >
                {item.comment}
              </Text>
            </View>
          </View>
        );
      })}

      {/* Input Komentar */}
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Tulis komentar..."
          value={comment}
          onChangeText={setComment}
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />

        <TouchableOpacity
          onPress={handleComment}
          disabled={
            loading ||
            !comment.trim()
          }
          style={[
            styles.sendButton,
            {
              backgroundColor:
                loading ||
                !comment.trim()
                  ? "#D1D5DB"
                  : "#C84B31",
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#FFF"
            />
          ) : (
            <Send
              size={16}
              color="#FFF"
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    commentHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },

    commentCount: {
      marginLeft: 6,
      fontSize: 11,
      fontWeight: "600",
      color: "#9CA3AF",
    },

    commentRow: {
      flexDirection: "row",
      marginBottom: 8,
    },

    avatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
      marginTop: 2,
    },

    avatarText: {
      color: "#FFF",
      fontSize: 10,
      fontWeight: "700",
    },

    commentBubble: {
      flex: 1,
      backgroundColor: "#FFF",
      borderWidth: 1,
      borderColor: "#F3F4F6",
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },

    commentName: {
      fontSize: 11,
      fontWeight: "700",
      color: "#374151",
      marginBottom: 2,
    },

    commentText: {
      fontSize: 12,
      color: "#6B7280",
      lineHeight: 18,
    },

    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
    },

    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      borderRadius: 12,
      backgroundColor: "#FFF",
      paddingHorizontal: 12,
      height: 42,
      fontSize: 12,
      color: "#111827",
    },

    sendButton: {
      width: 42,
      height: 42,
      borderRadius: 12,
      marginLeft: 8,
      alignItems: "center",
      justifyContent: "center",
    },
  });