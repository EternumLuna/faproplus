import fs from "fs"
import { getOfficialIcons, getOfficialRelease } from "../helper/official"
import defVer from "../helper/fonts"
import { downloadFile } from "../main/file-downloader"

const baseUrl = "https://site-assets.fontawesome.com/releases"

const maxHour = 3 * 60 * 60 * 1000

const isNewOnly = process.argv.some((k) => k === "--newOnly=true")

export async function startDownloadSingles(): Promise<void> {
  const maxTime = Date.now() + maxHour

  let numCompleted: number = 0

  const fileExisted: string[] = []

  const officialRelease = await getOfficialRelease()

  const officialLatest = officialRelease?.releases?.find((k) => k.isLatest === true)

  const useVersion = officialLatest?.version || defVer.version

  const officialIcons = await getOfficialIcons(useVersion)

  const releaseUrl = `${baseUrl}/v${useVersion}`

  let lastPack: number = -1

  for (let ipack = 0; ipack < officialIcons.length; ipack++) {
    const shorthands = officialIcons[ipack].shorthands
    const iconId = officialIcons[ipack].id

    if (Date.now() >= maxTime) {
      break
    }

    for (let i = 0; i < shorthands.length; i++) {
      const dir = `../dist/svgs/${shorthands[i]}`

      const progress = `[${ipack + 1}/${officialIcons.length}]`

      const fileName = `${iconId}.svg`

      const url = `${releaseUrl}/svgs/${shorthands[i]}/${fileName}`

      const usePrintLog = ipack > lastPack

      lastPack = ipack

      const fileExists = fs.existsSync(`${dir}/${fileName}`)

      if (isNewOnly && fileExists) {
        if (!fileExisted.includes(fileName)) {
          fileExisted.push(fileName)
        }
      } else {
        if (fileExisted.length >= 1) {
          console.log(`? [EXISTED]: ${fileExisted.join(", ")}`)
          fileExisted.splice(0, fileExisted.length)
        }

        await downloadFile(url, dir, progress, !usePrintLog)
        numCompleted++
      }

      if (Date.now() >= maxTime) {
        break
      }
    }

    if (Date.now() >= maxTime) {
      break
    }
  }

  console.log(`+ ${numCompleted} SVG Singles Downloaded`)
}

startDownloadSingles()
