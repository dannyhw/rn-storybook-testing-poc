import { GoThroughAllStories } from "./storybook-test-util";
import { expect } from "detox";
import fs from "fs/promises";
import { WebSocketServer } from "ws";

describe("Example", () => {
  const storiesList = GoThroughAllStories();
  // const ws = new WebSocket("ws://localhost:7007");
  const port = 7007;

  const host = "localhost";
  let wss: WebSocketServer = new WebSocketServer({ port, host });

  beforeAll(async () => {
    wss.on("connection", function connection(ws: any) {
      console.log("websocket connection established");

      ws.on("error", console.error);

      // ws.on("message", function message(data: any) {
      //   try {
      //     const json = JSON.parse(data.toString());

      //   } catch (error) {
      //     console.error(error);
      //   }
      // });
    });
    await device.launchApp();
  });

  beforeEach(async () => {
    // await device.reloadReactNative();
  });

  afterAll(async () => {
    wss.clients.forEach((wsClient: any) => wsClient.close());
    wss.close();
    // @ts-ignore
    wss = null;
  });

  it("should show all stories", async () => {
    for await (const [title, stories] of Object.entries(storiesList)) {
      for await (const story of stories) {
        // ws.send(
        //   JSON.stringify({
        //     type: "setCurrentStory",
        //     args: [{ storyId: story.id }],
        //   })
        // );
        wss.clients.forEach((wsClient: any) =>
          wsClient.send(
            JSON.stringify({
              type: "setCurrentStory",
              args: [{ storyId: story.id }],
            })
          )
        );

        (async () =>
          await new Promise((resolve) => setTimeout(resolve, 200)))();
        // // do navigate to story
        const imagePath = await element(by.id("storybook-ui")).takeScreenshot(
          story.filename
        );

        if (!imagePath) throw new Error("imagePath is null");

        // expectBitmapsToBeEqual(imagePath, snapshottedImagePath);
      }
    }
  });
});

async function expectBitmapsToBeEqual(
  imagePath: string,
  expectedImagePath: string
) {
  const bitmapBuffer = await fs.readFile(imagePath);
  const expectedBitmapBuffer = await fs.readFile(expectedImagePath);
  if (!bitmapBuffer.equals(expectedBitmapBuffer)) {
    throw new Error(
      `Expected image at ${imagePath} to be equal to image at ${expectedImagePath}, but it was different!`
    );
  }
}
