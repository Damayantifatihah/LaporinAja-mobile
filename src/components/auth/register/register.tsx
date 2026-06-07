import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { registerUser } from "@/services/authService";

const { width, height } = Dimensions.get("window");

const showAlert = (title: string, message: string) => {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nik, setNik] = useState("");
  const [noTlp, setNoTlp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (name.trim().length < 3) {
      showAlert("Validasi", "Nama minimal 3 karakter.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert("Validasi", "Format email tidak valid.");
      return;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(noTlp)) {
      showAlert("Validasi", "Nomor telepon harus 10-15 digit angka.");
      return;
    }

    const nikRegex = /^[0-9]{16}$/;
    if (!nikRegex.test(nik)) {
      showAlert("Validasi", "NIK harus 16 digit angka.");
      return;
    }

    if (password.length < 6) {
      showAlert("Validasi", "Password minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("Validasi", "Konfirmasi password tidak cocok.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name,
        email,
        password,
        nik,
        no_tlp: noTlp,
      });

      showAlert("Berhasil", "Akun berhasil dibuat. Silakan masuk.");

      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 500);
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 409) {
        showAlert("Akun Sudah Ada", "Email ini sudah terdaftar. Silakan masuk.");
      } else if (status === 422) {
        showAlert("Data Tidak Valid", message || "Periksa kembali data yang kamu masukkan.");
      } else if (!error?.response) {
        showAlert("Koneksi Gagal", "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.");
      } else {
        showAlert("Register Gagal", message || "Terjadi kesalahan. Coba beberapa saat lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.circleTopRight} />
      <View style={styles.circleTopRightInner} />
      <View style={styles.circleBottomLeft} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* LOGO */}
        <View style={styles.logoContainer}>
          <View style={styles.logoPill}>
            <Image
              source={require('../../../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* HEADING */}
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Buat Akun Baru</Text>
          <Text style={styles.subheading}>
            Daftar dan mulai laporkan masalah di sekitarmu
          </Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>

          {/* NAMA */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Masukkan nama lengkap"
              placeholderTextColor="#C0C0C0"
            />
          </View>

          {/* EMAIL */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="contoh@email.com"
              placeholderTextColor="#C0C0C0"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* NIK */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>NIK</Text>
            <TextInput
              style={styles.input}
              value={nik}
              onChangeText={setNik}
              placeholder="Masukkan NIK"
              placeholderTextColor="#C0C0C0"
              keyboardType="numeric"
            />
          </View>

          {/* NO HP */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nomor Telepon</Text>
            <TextInput
              style={styles.input}
              value={noTlp}
              onChangeText={setNoTlp}
              placeholder="08xxxxxxxxxx"
              placeholderTextColor="#C0C0C0"
              keyboardType="phone-pad"
            />
          </View>

          {/* PASSWORD */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Kata Sandi</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, styles.inputPassword]}
                value={password}
                onChangeText={setPassword}
                placeholder="Masukkan kata sandi"
                placeholderTextColor="#C0C0C0"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#777"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* CONFIRM PASSWORD */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Konfirmasi Kata Sandi</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, styles.inputPassword]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Ulangi kata sandi"
                placeholderTextColor="#C0C0C0"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#777"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            style={[styles.btnLogin, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnLoginText}>Daftar</Text>
            )}
          </TouchableOpacity>

          {/* DIVIDER */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* LOGIN */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Sudah punya akun?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.registerLink}> Masuk</Text>
            </TouchableOpacity>
          </View>

        </View>

        <Text style={styles.tagline}>Suaramu penting untuk kotamu 🏙️</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E05A3A",
    overflow: "hidden",
  },

  circleTopRight: {
    position: "absolute",
    top: -width * 0.25,
    right: -width * 0.2,
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: width * 0.425,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  circleTopRightInner: {
    position: "absolute",
    top: -width * 0.05,
    right: -width * 0.3,
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: width * 0.325,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  circleBottomLeft: {
    position: "absolute",
    bottom: -width * 0.2,
    left: -width * 0.25,
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width * 0.375,
    backgroundColor: "rgba(0,0,0,0.06)",
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: height * 0.05,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },

  logoContainer: {
    marginBottom: 25,
    alignItems: "center",
  },

  logoPill: {
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  logo: {
    width: 250,
    height: 65,
  },

  headingContainer: {
    alignItems: "center",
    marginBottom: 25,
  },

  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFF",
  },

  subheading: {
    marginTop: 6,
    fontSize: 14,
    textAlign: "center",
    color: "rgba(255,255,255,0.9)",
  },

  card: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },

  fieldGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    marginBottom: 7,
  },

  input: {
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    backgroundColor: "#F7F7F8",
    borderWidth: 1.5,
    borderColor: "#ECECEC",
  },

  passwordWrapper: {
    position: "relative",
  },

  inputPassword: {
    paddingRight: 50,
  },

  eyeBtn: {
    position: "absolute",
    right: 15,
    top: 15,
  },

  btnLogin: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#E05A3A",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  btnDisabled: {
    opacity: 0.6,
  },

  btnLoginText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ECECEC",
  },

  dividerText: {
    marginHorizontal: 12,
    color: "#AAA",
    fontSize: 12,
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
  },

  registerText: {
    color: "#888",
    fontSize: 13,
  },

  registerLink: {
    color: "#E05A3A",
    fontWeight: "700",
    fontSize: 13,
  },

  tagline: {
    marginTop: 25,
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },
});