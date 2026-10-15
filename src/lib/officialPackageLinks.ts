export interface OfficialPackageLink {
  label: string
  href: string
  display: string
}

interface OfficialRegistry {
  host: string
  label: string
  packagePath: RegExp
}

const OFFICIAL_REGISTRIES: OfficialRegistry[] = [
  { host: 'npmjs.com', label: 'npm', packagePath: /^\/package\/(?:@[^/]+\/)?[^/]+\/?$/i },
  { host: 'pypi.org', label: 'PyPI', packagePath: /^\/project\/[^/]+(?:\/[^/]+)?\/?$/i },
  { host: 'crates.io', label: 'crates.io', packagePath: /^\/crates\/[^/]+(?:\/[^/]+)?\/?$/i },
  {
    host: 'pub.dev',
    label: 'pub.dev',
    packagePath: /^\/packages\/[^/]+(?:\/versions\/[^/]+)?\/?$/i,
  },
  { host: 'packagist.org', label: 'Packagist', packagePath: /^\/packages\/[^/]+\/[^/]+\/?$/i },
  { host: 'nuget.org', label: 'NuGet', packagePath: /^\/packages\/[^/]+(?:\/[^/]+)?\/?$/i },
  {
    host: 'rubygems.org',
    label: 'RubyGems',
    packagePath: /^\/gems\/[^/]+(?:\/versions\/[^/]+)?\/?$/i,
  },
]

export function extractOfficialPackageLinks(markdown: string): OfficialPackageLink[] {
  const links: OfficialPackageLink[] = []
  const seen = new Set<string>()
  const candidates = markdown.matchAll(/https:\/\/[^\s<>"')\]]+/gi)

  for (const match of candidates) {
    const href = match[0].replace(/[.,;:!?]+$/, '')
    try {
      const url = new URL(href)
      const hostname = url.hostname.toLowerCase().replace(/^www\./, '')
      const registry = OFFICIAL_REGISTRIES.find(
        ({ host, packagePath }) =>
          (hostname === host || hostname.endsWith(`.${host}`)) && packagePath.test(url.pathname),
      )
      if (!registry) continue

      url.search = ''
      url.hash = ''
      if (seen.has(url.href)) continue
      seen.add(url.href)
      links.push({
        label: registry.label,
        href: url.href,
        display: `${url.hostname}${decodeURI(url.pathname)}`,
      })
      if (links.length === 4) break
    } catch {
      // Snapshot text is untrusted; malformed URLs are ignored.
    }
  }

  return links
}
