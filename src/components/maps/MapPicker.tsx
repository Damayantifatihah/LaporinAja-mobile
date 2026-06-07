import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";

import "leaflet/dist/leaflet.css";

type Props = {
  onSelect: (lat: number, lng: number, address: string) => void;
};

export default function MapPicker({ onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [position, setPosition] = useState<[number, number]>([-6.914744, 107.60981]);
  const [Leaflet, setLeaflet] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const RL = await import("react-leaflet");
      const L = await import("leaflet");

      delete (L.Icon.Default.prototype as any)._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });

      setLeaflet({ ...RL, L });
    };

    load();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
        getAddress(lat, lng);
      },
      () => {
        console.log("Gagal mengambil GPS");
      }
    );
  }, []);

  const getAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      const address = data.display_name || `${lat}, ${lng}`;
      setSelectedLocation(address);
      onSelect(lat, lng, address);
    } catch {
      console.log("error geocode");
    }
  };

  const searchLocation = async () => {
    if (!search.trim()) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`
      );
      const data = await res.json();

      if (!data || data.length === 0) {
        Alert.alert("Lokasi tidak ditemukan");
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      setPosition([lat, lng]);
      getAddress(lat, lng);
    } catch {
      Alert.alert("Gagal mencari lokasi");
    }
  };

  if (!Leaflet) {
    return <Text>Loading map...</Text>;
  }

  const { MapContainer, TileLayer, Marker, useMap, useMapEvents } = Leaflet;

  function ResizeMap() {
    const map = useMap();
    useEffect(() => {
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 300);
      return () => clearTimeout(timer);
    }, [map]);
    return null;
  }

  function ChangeView() {
    const map = useMap();
    useEffect(() => {
      map.flyTo(position, 15, { duration: 1 });
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }, [map]);
    useEffect(() => {
      map.flyTo(position, 15);
    }, [position]);
    return null;
  }

  function ClickMap() {
    useMapEvents({
      click(e: any) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        setPosition([lat, lng]);
        getAddress(lat, lng);
      },
    });
    return <Marker position={position} />;
  }

  return (
    <View>
      {!!selectedLocation && (
        <View style={styles.locationBox}>
          <Text style={styles.locationText}>{selectedLocation}</Text>
        </View>
      )}

      <View style={styles.searchRow}>
        <TextInput
          placeholder="Cari lokasi..."
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
        <TouchableOpacity style={styles.btn} onPress={searchLocation}>
          <Text style={styles.btnText}>Cari</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapWrapper}>
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom
          style={{ width: "100%", height: "100%" }}
        >
          <ResizeMap />
          <ChangeView />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickMap />
        </MapContainer>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
  },

  btn: {
    backgroundColor: "#B45743",
    borderRadius: 14,
    paddingHorizontal: 18,
    justifyContent: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
  },

  locationBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },

  locationText: {
    fontSize: 14,
    color: "#334155",
  },

  mapWrapper: {
    width: "100%",
    height: 320,
    minHeight: 320,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#f8fafc",
  },
});