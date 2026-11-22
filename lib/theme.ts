export type Theme = "dark" | "light"
export const THEME_KEY = "mt-theme"

/** Runs before first paint (inlined in <head>) so there is no flash of the wrong theme. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','dark')}})();`

export const getTheme = (): Theme =>
  typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark"

/** Light mode darkens the brand colors slightly so they keep contrast on a light background. */
export const colorFactor = () => (getTheme() === "light" ? 0.82 : 1)
