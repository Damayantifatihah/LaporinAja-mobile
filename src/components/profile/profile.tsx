import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import {
  Camera,
  LogOut,
} from "lucide-react-native";

import { useRouter } from "expo-router";

import {
  getUser,
  saveUser,
  logout,
} from "@/store/auth.store";

import api from "@/services/api";

const PRIMARY = "#B45743";

export default function Profile() {
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<any>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
    bio: "",
  });

  const [photo, setPhoto] =
    useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = await getUser();

      if (!userData) return;

      setUser(userData);

      setForm({
        email: userData.email || "",
        password: "",
        bio: userData.bio || "",
      });

      if (userData.photo) {
        setPhoto(userData.photo);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const pickImage = async () => {
    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "email",
        form.email
      );

      formData.append(
        "bio",
        form.bio
      );

      if (form.password) {
        formData.append(
          "password",
          form.password
        );
      }

      if (
        photo &&
        !photo.startsWith("http")
      ) {
        formData.append("photo", {
          uri: photo,
          name: "profile.jpg",
          type: "image/jpeg",
        } as any);
      }

      await api.put(
        "/auth/profile",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      const updatedUser = {
        ...user,
        email: form.email,
        bio: form.bio,
        photo,
      };

      await saveUser(updatedUser);

      setUser(updatedUser);

      Alert.alert(
        "Berhasil",
        "Profil berhasil diperbarui"
      );

      setEditing(false);
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.message ||
          "Gagal update profil"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Yakin ingin keluar?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();

            router.replace(
              "/(auth)/login" as any
            );
          },
        },
      ]
    );
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((x: string) => x[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        Profil Saya
      </Text>

      <View style={styles.avatarSection}>
        {photo ? (
          <Image
            source={{ uri: photo }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {initials}
            </Text>
          </View>
        )}

        {editing && (
          <TouchableOpacity
            style={styles.cameraBtn}
            onPress={pickImage}
          >
            <Camera
              size={18}
              color="#fff"
            />
          </TouchableOpacity>
        )}

        <Text style={styles.name}>
          {user?.name}
        </Text>

        <Text style={styles.role}>
          {user?.role || "Warga"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          editable={editing}
          value={form.email}
          onChangeText={(v) =>
            setForm({
              ...form,
              email: v,
            })
          }
          style={styles.input}
        />

        <Text style={styles.label}>
          Password
        </Text>

        <TextInput
          secureTextEntry
          editable={editing}
          placeholder="Kosongkan jika tidak ingin mengubah"
          value={form.password}
          onChangeText={(v) =>
            setForm({
              ...form,
              password: v,
            })
          }
          style={styles.input}
        />

        <Text style={styles.label}>
          Bio
        </Text>

        <TextInput
          multiline
          editable={editing}
          value={form.bio}
          onChangeText={(v) =>
            setForm({
              ...form,
              bio: v,
            })
          }
          style={styles.bio}
        />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          Tips Keamanan
        </Text>

        <Text style={styles.infoText}>
          • Gunakan password yang kuat
        </Text>

        <Text style={styles.infoText}>
          • Jangan bagikan akun ke orang lain
        </Text>

        <Text style={styles.infoText}>
          • Perbarui email jika diperlukan
        </Text>
      </View>

      {editing ? (
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveText}>
            {loading
              ? "Menyimpan..."
              : "Simpan Perubahan"}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() =>
            setEditing(true)
          }
        >
          <Text style={styles.editText}>
            Edit Profil
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
      >
        <LogOut
          size={18}
          color="#EF4444"
        />
        <Text style={styles.logoutText}>
          Logout
        </Text>
      </TouchableOpacity>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  avatarSection: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
  },

  cameraBtn: {
    position: "absolute",
    bottom: 35,
    right: 120,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: "700",
  },

  role: {
    color: "#666",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },

  label: {
    fontWeight: "600",
    marginBottom: 6,
    color: "#444",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 14,
    marginBottom: 14,
    backgroundColor: "#FAFAFA",
  },

  bio: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    minHeight: 100,
    padding: 14,
    backgroundColor: "#FAFAFA",
    textAlignVertical: "top",
  },

  infoCard: {
    backgroundColor: "#FAECE7",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  infoTitle: {
    color: PRIMARY,
    fontWeight: "700",
    marginBottom: 8,
  },

  infoText: {
    color: "#8B3A2A",
    marginBottom: 5,
  },

  editBtn: {
    backgroundColor: PRIMARY,
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  saveBtn: {
    backgroundColor: PRIMARY,
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  editText: {
    color: "#fff",
    fontWeight: "700",
  },

  saveText: {
    color: "#fff",
    fontWeight: "700",
  },

  logoutBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FECACA",
    marginTop: 12,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  logoutText: {
    color: "#EF4444",
    fontWeight: "700",
  },
});