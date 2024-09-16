import AsyncStorage from "@react-native-async-storage/async-storage";
import { view } from "./storybook.requires";
import { SafeAreaView } from "react-native";

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  onDeviceUI: false,
});

export default () => (
  <SafeAreaView style={{ flex: 1 }}>
    <StorybookUIRoot />
  </SafeAreaView>
);
