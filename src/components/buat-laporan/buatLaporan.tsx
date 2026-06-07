import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import api from "@/services/api";
import MapPicker from "@/components/maps/MapPicker";

interface Category {
  id: number;
  name: string;
}

export default function BuatLaporan() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggalKejadian, setTanggalKejadian] = useState("");

  // 🔥 MAP STATE
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [alamat, setAlamat] = useState("");

  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      const data = res.data.data || res.data;

      setCategories(data);

      if (data.length > 0) {
        setSelectedCategoryId(data[0].id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const pickImage = async () => {
    if (images.length >= 3) {
      Alert.alert("Maksimal 3 foto");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets]);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!judul.trim()) return Alert.alert("Judul wajib diisi");
      if (!deskripsi.trim()) return Alert.alert("Deskripsi wajib diisi");
      if (!tanggalKejadian) return Alert.alert("Tanggal wajib diisi");
      if (!latitude || !longitude) return Alert.alert("Pilih lokasi di peta");

      setLoading(true);

      const formData = new FormData();

      formData.append("category_id", String(selectedCategoryId));
      formData.append("judul_laporan", judul);
      formData.append("isi_laporan", deskripsi);
      formData.append("tanggal_kejadian", tanggalKejadian);

      // 🔥 LOCATION FROM MAP
      formData.append("latitude", String(latitude));
      formData.append("longitude", String(longitude));
      formData.append("lokasi", alamat);

      images.forEach((img) => {
        formData.append("gambar", img.file ?? img, img.fileName ?? "photo.jpg");
      });

      await api.post("/laporan", formData);

      Alert.alert("Berhasil", "Laporan berhasil dikirim");

      setJudul("");
      setDeskripsi("");
      setTanggalKejadian("");
      setImages([]);
      setLatitude(null);
      setLongitude(null);
      setAlamat("");
    } catch (err: any) {
      console.log(err);
      Alert.alert("Error", "Gagal mengirim laporan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerSmall}>Buat Laporan Baru</Text>
        <Text style={styles.headerTitle}>Sampaikan Laporan Anda</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Judul Laporan</Text>
        <TextInput style={styles.input} value={judul} onChangeText={setJudul} />

        <Text style={styles.label}>Kategori</Text>
        <View style={styles.categoryWrap}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.category,
                selectedCategoryId === cat.id && styles.categoryActive,
              ]}
              onPress={() => setSelectedCategoryId(cat.id)}
            >
              <Text>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Tanggal</Text>
        <TextInput style={styles.input} value={tanggalKejadian} onChangeText={setTanggalKejadian} />

        {/* 🔥 MAP PICKER */}
        <Text style={styles.label}>Lokasi (Pilih di Map)</Text>
        <MapPicker
          onSelect={(lat: number, lng: number, address: string) => {
            setLatitude(lat);
            setLongitude(lng);
            setAlamat(address);
          }}
        />

        {alamat ? (
          <Text style={{ marginTop: 6, color: "#555" }}>{alamat}</Text>
        ) : null}

        <Text style={styles.label}>Deskripsi</Text>
        <TextInput style={styles.textarea} multiline value={deskripsi} onChangeText={setDeskripsi} />

        <Text style={styles.label}>Foto</Text>
        <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
          <Text>+ Tambah Foto</Text>
        </TouchableOpacity>

        <View style={styles.previewWrap}>
          {images.map((img, i) => (
            <Image key={i} source={{ uri: img.uri }} style={styles.preview} />
          ))}
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Kirim</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles =
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor:
        "#F8F8F8",
    },

    header: {
      backgroundColor:
        "#B45743",
      borderRadius: 18,
      padding: 20,
      marginBottom: 16,
    },

    headerSmall: {
      color:
        "rgba(255,255,255,0.7)",
      fontSize: 12,
    },

    headerTitle: {
      color: "#FFF",
      fontSize: 22,
      fontWeight: "700",
      marginTop: 4,
    },

    card: {
      backgroundColor:
        "#FFF",
      borderRadius: 18,
      padding: 16,
    },

    label: {
      fontWeight: "600",
      marginBottom: 8,
      marginTop: 14,
    },

    input: {
      borderWidth: 1,
      borderColor: "#E5E7EB",
      borderRadius: 12,
      paddingHorizontal: 14,
      height: 48,
    },

    textarea: {
      borderWidth: 1,
      borderColor: "#E5E7EB",
      borderRadius: 12,
      padding: 14,
      minHeight: 120,
      textAlignVertical:
        "top",
    },

    categoryWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },

    category: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#E5E7EB",
    },

    categoryActive: {
      backgroundColor:
        "#F9EAE7",
      borderColor:
        "#B45743",
    },

    uploadBtn: {
      height: 50,
      borderRadius: 12,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: "#B45743",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
    },

    uploadText: {
      color: "#B45743",
      fontWeight: "600",
    },

    previewWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 12,
      gap: 10,
    },

    preview: {
      width: 90,
      height: 90,
      borderRadius: 12,
    },

    submitBtn: {
      marginTop: 24,
      backgroundColor:
        "#B45743",
      height: 50,
      borderRadius: 12,
      justifyContent:
        "center",
      alignItems: "center",
    },

    submitText: {
      color: "#FFF",
      fontWeight: "700",
      fontSize: 15,
    },
  });