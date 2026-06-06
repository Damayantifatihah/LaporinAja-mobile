import Homepage from "@/components/homepage/homepage";
import LaporanFeed from "@/components/homepage/laporanFeed";
import TabBar from "@/components/tabBar/tabBar";
import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import api from "@/services/api";

export default function HomepageScreen() {
  const [totalLaporan, setTotalLaporan] = useState(0);
  const [verifikasi, setVerifikasi] = useState(0);
  const [diproses, setDiproses] = useState(0);
  const [selesai, setSelesai] = useState(0);
  const [ditolak, setDitolak] = useState(0);

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await api.get("/laporan/saya");

        const laporan = res.data.data || [];

        setTotalLaporan(laporan.length);

        setVerifikasi(
          laporan.filter(
            (item: any) => item.status === "verifikasi"
          ).length
        );

        setDiproses(
          laporan.filter(
            (item: any) =>
              item.status === "proses" ||
              item.status === "diproses"
          ).length
        );

        setSelesai(
          laporan.filter(
            (item: any) => item.status === "selesai"
          ).length
        );

        setDitolak(
          laporan.filter(
            (item: any) => item.status === "ditolak"
          ).length
        );
      } catch (error) {
        console.log("ERROR STATS:", error);
      }
    };

    getStats();
  }, []);


  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Homepage
          totalLaporan={totalLaporan}
          verifikasi={verifikasi}
          diproses={diproses}
          selesai={selesai}
          ditolak={ditolak}
        />
        <LaporanFeed />
      </ScrollView>

      <TabBar active="beranda" />
    </View>
  );
}