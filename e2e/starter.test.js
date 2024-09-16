import "../me2e/storybook-test-util.js";

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
