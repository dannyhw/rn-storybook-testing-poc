const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

const withStorybook = require("@storybook/react-native/metro/withStorybook");

module.exports = withStorybook(defaultConfig, {
  enabled: true,
  configPath: path.resolve(__dirname, "./.ondevice"),
});
