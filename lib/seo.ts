import { SITE_URL, site } from "./content"

export const abs = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`

export const sameAs = site.socials.filter((s) => s.icon !== "whatsapp").map((s) => s.href)

/** Person + WebSite structured data (rich results / knowledge panel). */
export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: site.name,
      alternateName: ["MT", "Moniruzzaman Tonoy"],
      jobTitle: site.jobTitle,
      url: SITE_URL,
      image: abs("/og-image.jpg"),
      email: `mailto:${site.email}`,
      telephone: site.phone,
      address: { "@type": "PostalAddress", addressLocality: "Kendua, Netrokona", addressCountry: "BD" },
      sameAs,
      knowsAbout: site.skills.map((s) => s.name),
      worksFor: [
        { "@type": "Organization", name: "Open IT Institute" },
        { "@type": "Organization", name: "Programming Hero", url: "https://www.programming-hero.com/" },
      ],
      alumniOf: [
        { "@type": "EducationalOrganization", name: "Kendua Government College" },
        { "@type": "EducationalOrganization", name: "Kendua Joyhori Spri Government High School" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: `MT — ${site.name}`,
      description: site.description,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ],
}
