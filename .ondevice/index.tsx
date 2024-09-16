import AsyncStorage from "@react-native-async-storage/async-storage";
import { view } from "./storybook.requires";
import { SafeAreaView } from "react-native";

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  onDeviceUI: false,
  enableWebsockets: true,
});

export default () => (
  <SafeAreaView style={{ flex: 1 }} testID="storybook-ui">
    <StorybookUIRoot />
  </SafeAreaView>
);
