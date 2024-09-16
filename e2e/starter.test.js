import { GoThroughAllStories } from "./storybook-test-util.js";

GoThroughAllStories().then((out) => console.log(JSON.stringify(out, null, 2)));

describe("Example", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should show hello screen after tap", async () => {
    await expect(element(by.text("Hello world"))).toBeVisible();
  });
});
