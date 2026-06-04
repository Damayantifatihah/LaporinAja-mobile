import LaporanSaya from "@/components/laporan-saya/laporanSaya";
import TabBar from "@/components/tabBar/tabBar";

import {
  View,
  StyleSheet,
} from "react-native";

export default function LaporanSayaScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <LaporanSaya />
      </View>

      <TabBar active="saya" />
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