import Homepage from "@/components/homepage/homepage";
import TabBar from "@/components/tabBar/tabBar";

import { View } from "react-native";

export default function HomepageScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Homepage
        totalLaporan={12}
        diproses={2}
        selesai={7}
        ditolak={1}
      />

      <TabBar active="beranda" />
    </View>
  );
}