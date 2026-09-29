import fs from "fs"
import { getOfficialFamily, getOfficialRelease } from "../helper/official"
import defVer from "../helper/fonts"
import { downloadFile } from "../main/file-downloader"
import waittime from "../helper/waittime"

const baseUrl = "https://site-assets.fontawesome.com/releases"

const isNewOnly = process.argv.some((k) => k === "--newOnly=true")

export async function startDownloadSprites(): Promise<void> {
  let numCompleted: number = 0

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
      console.log(`? ${progress} ${fileName} (existed)`)
      await waittime(175)
    } else {
      await downloadFile(url, dir, progress)
      numCompleted++
    }

    if (numCompleted >= 2000) {
      break
    }
  }

  console.log(`+ ${numCompleted} SVG Sprites Downloaded`)
}

startDownloadSprites()
