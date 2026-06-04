import BuatLaporan from "@/components/buat-laporan/buatLaporan";
import TabBar from "@/components/tabBar/tabBar";

import {
  View,
  StyleSheet,
} from "react-native";

export default function Page() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <BuatLaporan />
      </View>

      <TabBar active="laporan" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
  },
});