export default ({ config }) => ({
  ...config,
  name: "Detox Storybook",
  slug: "detox-storybook",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  extra: {
    storybookEnabled: process.env.STORYBOOK_ENABLED,
    eas: {
      projectId: "886abfe6-75fe-46c7-9923-f7b73e8c3908",
    },
  },
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.dannyhw.detoxstorybook",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
    package: "com.dannyhw.detoxstorybook",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: ["@config-plugins/detox"],
});
