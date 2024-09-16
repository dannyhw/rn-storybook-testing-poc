// @ts-ignore
// import { getMain } from "@storybook/react-native/scripts/loader.js";
import { normalizeStories } from "@storybook/core/common";
import { toId } from "@storybook/csf";
// @ts-ignore
import * as glob from "glob";
import * as path from "path";
import * as fs from "fs";
import { loadCsf } from "@storybook/csf-tools";

function ensureRelativePathHasDot(relativePath: string) {
  return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
}

export function GoThroughAllStories() {
  const configPath = "./.ondevice";
  const mainImport = require(path.resolve(
    process.cwd(),
    configPath,
    `main.ts`
  ));
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
      .map((storyPath: string) => {
        const pathWithDirectory = path.join(specifier.directory, storyPath);
        const requirePath = absolute
          ? storyPath
          : ensureRelativePathHasDot(
              path.relative(configPath, pathWithDirectory)
            );

        const normalizePathForWindows = (str: string) =>
          path.sep === "\\" ? str.replace(/\\/g, "/") : str;

        return normalizePathForWindows(requirePath);
      });
    return [...acc, ...paths];
  }, [] as string[]);

  const csfStories = storyPaths.map((storyPath) => {
    const code = fs.readFileSync(storyPath, { encoding: "utf-8" }).toString();
    return loadCsf(code, {
      fileName: storyPath,
      makeTitle: (userTitle) => userTitle,
    }).parse();
  });

  const storyMap: Record<string, { id: string; filename: string }[]> = {};
  for (const { meta, stories } of csfStories) {
    const title = meta.title;

    if (title) {
      storyMap[title] = stories.map((story) => ({
        id: toId(title, story.name),
        filename: `${title}-${story.name}`,
      }));
    }
  }

  return storyMap;
}
