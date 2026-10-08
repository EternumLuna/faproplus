import fs from "fs"
import waittime from "../helper/waittime"
import { enableFaMotion } from "../main/motion-enabler"

const pName = "webfont-awesome-pro"
const cssFolder = `${pName}/css`

function manageAllCss(useDir: string, cssUrls: string[]): void {
  const fullStyle = cssUrls
    .filter((css) => css !== "all.css")
    .map((css) => `@import "${cssFolder}/${css}";`)
    .join("\n")

  fs.writeFileSync(`./${useDir}/css/full.css`, `${fullStyle}\n`, "utf-8")

  if (!fs.existsSync(`./${useDir}/scss`)) fs.mkdirSync(`./${useDir}/scss`)

  fs.writeFileSync(`./${useDir}/scss/full.scss`, `@use "${cssFolder}/full.css";\n`, "utf-8")

  cssUrls.forEach((css) => {
    const cssDir = `./${useDir}/css/${css}`
    const newCssFile = fs.readFileSync(cssDir, "utf-8").replace(/\.\./g, pName)

    const isContainReduce = ["all.css", "fontawesome.css"].includes(css)

    const parsedCssFile = isContainReduce ? enableFaMotion(newCssFile) : newCssFile

    fs.writeFileSync(cssDir, parsedCssFile, "utf-8")

    const scssDir = `./${useDir}/scss/${css.replace(".css", ".scss")}`
    const scssContent = `@use "${cssFolder}/${css}";\n`
    fs.writeFileSync(scssDir, scssContent, "utf-8")
  })
}

export async function createRelease(useDir: string, cssUrls: string[]): Promise<void> {
  await waittime(1000)
  console.log("--------")
  console.log("? Creating Assets Folder")
  manageAllCss(useDir, cssUrls)
  await waittime(1000)
  fs.cpSync(useDir, "../dist", { recursive: true })
  fs.rmSync(useDir, { recursive: true, force: true })
}
