import { getMain } from "@storybook/react-native/scripts/loader.js";
import { normalizeStories } from "@storybook/core/common";
import { toId } from "@storybook/csf";
import * as glob from "glob";
import * as path from "path";
import * as fs from "fs";
import { loadCsf } from "@storybook/csf-tools";

function ensureRelativePathHasDot(relativePath) {
  return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
}

export async function GoThroughAllStories() {
  const configPath = "./.ondevice";
  const mainImport = getMain({ configPath });
  const main = mainImport.default ?? mainImport;
  const absolute = true;

  const storiesSpecifiers = normalizeStories(main.stories, {
    configDir: configPath,
    workingDir: process.cwd(),
  });

  const storyPaths = storiesSpecifiers.reduce((acc, specifier) => {
    const paths = glob
      .sync(specifier.files, {
        cwd: path.resolve(process.cwd(), specifier.directory),
        absolute,
        // default to always ignore (exclude) anything in node_modules
        ignore: ["**/node_modules"],
      })
      .map((storyPath) => {
        const pathWithDirectory = path.join(specifier.directory, storyPath);
        const requirePath = absolute
          ? storyPath
          : ensureRelativePathHasDot(
              path.relative(configPath, pathWithDirectory)
            );

        const normalizePathForWindows = (str) =>
          path.sep === "\\" ? str.replace(/\\/g, "/") : str;

        return normalizePathForWindows(requirePath);
      });
    return [...acc, ...paths];
  }, []);

  const csfStories = storyPaths.map((storyPath) => {
    const code = fs.readFileSync(storyPath, { encoding: "utf-8" }).toString();
    return loadCsf(code, {
      fileName: storyPath,
      makeTitle: (userTitle) => userTitle,
    }).parse();
  });

  for await (const { meta, stories } of csfStories) {
    if (meta.title) {
      for await (const { name: storyName } of stories) {
        console.log("story", meta.title, storyName);

        const storyId = toId(meta.title, storyName);

        const doit = () =>
          new Promise((resolve) => {
            setTimeout(() => {
              console.log("emitting story", storyId, meta.title, storyName);
              // channel.emit(Events.SET_CURRENT_STORY, { storyId });

              // delay 500ms
              setTimeout(async () => {
                console.log(`${meta.title}-${storyName}`);
                // await takeScreenshot(`${meta.title}-${storyName}`);
                resolve(true);
              }, 0 /* 1000 */);
            }, 0 /* 1000 */);
          });

        await doit();
      }
    }
  }
}
