import React, {
  useEffect,
  useState,
} from "react";

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

interface Category {
  id: number;
  name: string;
}

export default function BuatLaporan() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [
    selectedCategoryId,
    setSelectedCategoryId,
  ] = useState<number | null>(null);

  const [judul, setJudul] =
    useState("");

  const [deskripsi, setDeskripsi] =
    useState("");

  const [tanggalKejadian, setTanggalKejadian] =
    useState("");

  const [lokasi, setLokasi] =
    useState("");

  const [images, setImages] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories =
    async () => {
      try {
        const res =
          await api.get(
            "/categories"
          );

        const data =
          res.data.data ||
          res.data;

        setCategories(data);

        if (data.length > 0) {
          setSelectedCategoryId(
            data[0].id
          );
        }
      } catch (err) {
        console.log(err);
      }
    };

  const pickImage =
    async () => {
      if (images.length >= 3) {
        Alert.alert(
          "Maksimal 3 foto"
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync(
          {
            mediaTypes:
              ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsMultipleSelection:
              true,
          }
        );

      if (
        !result.canceled
      ) {
        setImages((prev) => [
          ...prev,
          ...result.assets,
        ]);
      }
    };

  const removeImage =
    (index: number) => {
      setImages((prev) =>
        prev.filter(
          (_, i) =>
            i !== index
        )
      );
    };

  const handleSubmit =
    async () => {
      try {
        if (!judul.trim())
          return Alert.alert(
            "Judul wajib diisi"
          );

        if (!lokasi.trim())
          return Alert.alert(
            "Lokasi wajib diisi"
          );

        if (!deskripsi.trim())
          return Alert.alert(
            "Deskripsi wajib diisi"
          );

        if (!tanggalKejadian)
          return Alert.alert(
            "Tanggal wajib diisi"
          );

        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "category_id",
          String(
            selectedCategoryId
          )
        );

        formData.append(
          "judul_laporan",
          judul
        );

        formData.append(
          "isi_laporan",
          deskripsi
        );

        formData.append(
          "tanggal_kejadian",
          tanggalKejadian
        );

        formData.append(
          "lokasi",
          lokasi
        );

        images.forEach(
          (image, index) => {
            formData.append(
              "gambar",
              {
                uri: image.uri,
                name: `gambar-${index}.jpg`,
                type: "image/jpeg",
              } as any
            );
          }
        );

        await api.post(
          "/laporan",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        Alert.alert(
          "Berhasil",
          "Laporan berhasil dikirim"
        );

        setJudul("");
        setLokasi("");
        setDeskripsi("");
        setTanggalKejadian("");
        setImages([]);
      } catch (err: any) {
        console.log(err);

        Alert.alert(
          "Error",
          err?.response?.data
            ?.message ||
            "Gagal mengirim laporan"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <View style={styles.header}>
        <Text
          style={
            styles.headerSmall
          }
        >
          Buat Laporan Baru
        </Text>

        <Text
          style={
            styles.headerTitle
          }
        >
          Sampaikan Laporan Anda
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Judul Laporan
        </Text>

        <TextInput
          style={styles.input}
          value={judul}
          onChangeText={
            setJudul
          }
          placeholder="Contoh: Jalan berlubang"
        />

        <Text style={styles.label}>
          Kategori
        </Text>

        <View
          style={
            styles.categoryWrap
          }
        >
          {categories.map(
            (cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.category,
                  selectedCategoryId ===
                    cat.id &&
                    styles.categoryActive,
                ]}
                onPress={() =>
                  setSelectedCategoryId(
                    cat.id
                  )
                }
              >
                <Text
                  style={{
                    color:
                      selectedCategoryId ===
                      cat.id
                        ? "#8B3A2A"
                        : "#666",
                  }}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        <Text style={styles.label}>
          Tanggal Kejadian
        </Text>

        <TextInput
          style={styles.input}
          value={
            tanggalKejadian
          }
          onChangeText={
            setTanggalKejadian
          }
          placeholder="2025-06-04"
        />

        <Text style={styles.label}>
          Lokasi
        </Text>

        <TextInput
          style={styles.input}
          value={lokasi}
          onChangeText={
            setLokasi
          }
          placeholder="Masukkan alamat lokasi"
        />

        <Text style={styles.label}>
          Deskripsi
        </Text>

        <TextInput
          multiline
          style={
            styles.textarea
          }
          value={deskripsi}
          onChangeText={
            setDeskripsi
          }
          placeholder="Jelaskan detail laporan"
        />

        <Text style={styles.label}>
          Lampiran Foto
        </Text>

        <TouchableOpacity
          style={
            styles.uploadBtn
          }
          onPress={pickImage}
        >
          <Text
            style={
              styles.uploadText
            }
          >
            + Tambah Foto
          </Text>
        </TouchableOpacity>

        <View
          style={
            styles.previewWrap
          }
        >
          {images.map(
            (
              image,
              index
            ) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  removeImage(
                    index
                  )
                }
              >
                <Image
                  source={{
                    uri: image.uri,
                  }}
                  style={
                    styles.preview
                  }
                />
              </TouchableOpacity>
            )
          )}
        </View>

        <TouchableOpacity
          style={
            styles.submitBtn
          }
          onPress={
            handleSubmit
          }
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={
                styles.submitText
              }
            >
              Kirim Laporan
            </Text>
          )}
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