import fs from "fs"
import { getOfficialFamily, getOfficialRelease } from "../helper/official"
import defVer from "../helper/fonts"
import { downloadFile } from "../main/file-downloader"

const baseUrl = "https://site-assets.fontawesome.com/releases"

const maxCompleted: number = 4000

const isNewOnly = process.argv.some((k) => k === "--newOnly=true")

export async function startDownloadSprites(): Promise<void> {
  let numCompleted: number = 0

  const fileExisted: string[] = []

  const officialRelease = await getOfficialRelease()

  const officialLatest = officialRelease?.releases?.find((k) => k.isLatest === true)

  const useVersion = officialLatest?.version || defVer.version

  const officialFamilies = await getOfficialFamily(useVersion)

  if (!officialFamilies) {
    throw new Error("- Error getting family styles!")
  }

  const releaseUrl = `${baseUrl}/v${useVersion}`

  for (let i = 0; i < officialFamilies.length; i++) {
    const dir = `../dist/sprites`

    const progress = `[${i + 1}/${officialFamilies.length}]`

    const fileName = `${officialFamilies[i]}.svg`

    const url = `${releaseUrl}/sprites/${fileName}`

    const fileExists = fs.existsSync(`${dir}/${fileName}`)

    if (isNewOnly && fileExists) {
      if (!fileExisted.includes(fileName)) {
        fileExisted.push(`${i + 1} ${fileName}`)
        // console.log(`? ${progress} ${fileName} (existed)`)
      }
    } else {
      if (fileExisted.length >= 1) {
        console.log(`? [EXISTED]: ${fileExisted.join(", ")}`)
      }

      await downloadFile(url, dir, progress)
      numCompleted++
    }

    if (numCompleted >= maxCompleted) {
      break
    }
  }

  console.log(`+ ${numCompleted} SVG Sprites Downloaded`)
}

startDownloadSprites()
