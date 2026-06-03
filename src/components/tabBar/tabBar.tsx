import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import {
  Home,
  FilePlus2,
  ClipboardList,
  User,
} from "lucide-react-native";
import { useRouter } from "expo-router";

interface TabBarProps {
  active:
    | "beranda"
    | "laporan"
    | "saya"
    | "profil";
}

export default function TabBar({
  active,
}: TabBarProps) {
  const router = useRouter();

  const tabs = [
    {
      key: "beranda",
      label: "Beranda",
      icon: Home,
      route: "/homepage",
    },
    {
      key: "laporan",
      label: "Lapor",
      icon: FilePlus2,
      route: "/form-laporan",
    },
    {
      key: "saya",
      label: "Laporan Saya",
      icon: ClipboardList,
      route: "/laporan-saya",
    },
    {
      key: "profil",
      label: "Profil",
      icon: User,
      route: "/profile",
    },
  ];

  return (
    <View style={styles.wrapper}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          active === tab.key;

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.item}
            onPress={() =>
              router.push(
                tab.route as any
              )
            }
          >
            <View
              style={[
                styles.iconWrapper,
                isActive &&
                  styles.activeIconWrapper,
              ]}
            >
              <Icon
                size={22}
                color={
                  isActive
                    ? "#FFFFFF"
                    : "#8D8D8D"
                }
              />
            </View>

            <Text
              style={[
                styles.label,
                isActive &&
                  styles.activeLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",

    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",

    paddingVertical: 10,

    justifyContent:
      "space-around",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,

    elevation: 10,
  },

  item: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",
  },

  activeIconWrapper: {
    backgroundColor: "#B45743",
  },

  label: {
    marginTop: 4,
    fontSize: 11,
    color: "#8D8D8D",
  },

  activeLabel: {
    color: "#B45743",
    fontWeight: "700",
  },
});