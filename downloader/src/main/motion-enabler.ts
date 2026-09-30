import postcss from "postcss"

export function normalizeMediaQuery(value: string): string {
  return value.replace(/\s+/g, "").toLowerCase()
}

export function enableFaMotion(css: string): string {
  const root = postcss.parse(css)

  root.walkAtRules("media", (rule) => {
    if (normalizeMediaQuery(rule.params) === "(prefers-reduced-motion:reduce)") {
      rule.remove()
    }
  })

  const result = root.toString()

  return result
}
