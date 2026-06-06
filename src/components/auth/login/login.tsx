import React, { useState } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  loginUser,
} from "@/services/authService";

import {
  saveToken,
  saveUser,
} from "@/store/auth.store";

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

 const handleLogin = async () => {
  if (
    !email.trim() ||
    !password.trim()
  ) {
    Alert.alert(
      "Oops",
      "Email dan kata sandi wajib diisi."
    );
    return;
  }

  try {
    setLoading(true);

    const data =
      await loginUser(
        email.trim(),
        password
      );

    await saveToken(
      data.token
    );

    await saveUser(
      data.user
    );

    Alert.alert(
      "Berhasil",
      "Login berhasil"
    );

    router.replace("/homepage" as any);
  } catch (error: any) {
    Alert.alert(
      "Login Gagal",
      error?.response?.data
        ?.message ||
        "Terjadi kesalahan"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Background circles dekoratif */}
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
          <Text style={styles.heading}>Selamat Datang!</Text>
          <Text style={styles.subheading}>Masuk ke akun LaporinAja-mu</Text>
        </View>

        {/* FORM CARD */}
        <View style={styles.card}>

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
              autoCorrect={false}
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
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={22}
                  color="#777"
                />
            </TouchableOpacity>
            </View>
          
          </View>

          {/* BUTTON MASUK */}
          <TouchableOpacity
            style={[styles.btnLogin, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnLoginText}>Masuk</Text>
            )}
          </TouchableOpacity>

          {/* DIVIDER */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* REGISTER */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}>Daftar Gratis</Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* Tagline bawah */}
        <Text style={styles.tagline}>
          Suaramu penting untuk kotamu 🏙️
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E05A3A',
    overflow: 'hidden',
  },

  // Decorative circles (sama dengan splash)
  circleTopRight: {
    position: 'absolute',
    top: -width * 0.25,
    right: -width * 0.2,
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: width * 0.425,
    backgroundColor: 'rgba(255,255,255,0.06)',
    zIndex: 0,
  },
  circleTopRightInner: {
    position: 'absolute',
    top: -width * 0.05,
    right: -width * 0.3,
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: width * 0.325,
    backgroundColor: 'rgba(255,255,255,0.05)',
    zIndex: 0,
  },
  circleBottomLeft: {
    position: 'absolute',
    bottom: -width * 0.2,
    left: -width * 0.25,
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width * 0.375,
    backgroundColor: 'rgba(0,0,0,0.06)',
    zIndex: 0,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: height * 0.08,
    paddingBottom: 40,
    paddingHorizontal: 24,
    zIndex: 1,
  },

  // Logo
logoContainer: {
  marginBottom: 30,
  alignItems: "center",
},

logoPill: {
  backgroundColor: "rgba(255,255,255,0.92)",
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 50,

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 5,
},

logo: {
  width: 250,
  height: 65,
},

  // Heading
headingContainer: {
  alignItems: 'center',
  marginBottom: 32,
  paddingHorizontal: 20,
},

heading: {
  fontSize: 34,
  fontWeight: '800',
  color: '#FFFFFF',
  textAlign: 'center',
},

subheading: {
  fontSize: 15,
  color: 'rgba(255,255,255,0.90)',
  marginTop: 6,
  textAlign: 'center',
  lineHeight: 22,
},


  // Card form
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },

  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 7,
  },
  input: {
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#F7F7F8',
    borderWidth: 1.5,
    borderColor: '#ECECEC',
  },

  // Password field
  passwordWrapper: {
    position: 'relative',
  },
  inputPassword: {
    paddingRight: 48,
  },
  eyeBtn: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  eyeIcon: {
    fontSize: 20,
  },

  forgotContainer: {
    alignSelf: 'flex-end',
    marginTop: 7,
  },
  forgotText: {
    fontSize: 12,
    color: '#E05A3A',
    fontWeight: '500',
  },

  // Button
  btnLogin: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#E05A3A',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#E05A3A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnLoginText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ECECEC',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: '#AAAAAA',
  },

  // Register row
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 13,
    color: '#888',
  },
  registerLink: {
    fontSize: 13,
    color: '#E05A3A',
    fontWeight: '700',
  },

  // Tagline
  tagline: {
    marginTop: 28,
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
  },
});