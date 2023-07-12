import fs from "fs-extra";
import { minify } from "html-minifier-terser";
import rimraf from "rimraf";

const { readFile, writeFile, readdirSync } = fs;

const srcFolder = "./src/";
const publicFolder = "./docs/";

const bundle = async () => {
  rimraf(`${publicFolder}*`, () => {});

  const srcDir = readdirSync(srcFolder);

  const sourceFile = await readFile(`${srcFolder}index.html`, "utf8");

  const minified = await minify(sourceFile, {
    removeAttributeQuotes: false,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true
  });

  await writeFile(`${publicFolder}index.html`, minified);

  await Promise.all(
    srcDir
      .filter(file => file.match(/.*\.(png?)/gi))
      .map(
        async file =>
          await fs.copy(`${srcFolder}${file}`, `${publicFolder}${file}`)
      )
  );
};

bundle();
