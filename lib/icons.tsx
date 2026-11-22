import type { IconType } from "react-icons"
import {
  FaBootstrap, FaBug, FaCss3Alt, FaDev, FaFacebook, FaFigma, FaGithub, FaHtml5,
  FaLinkedin, FaNodeJs, FaReact, FaWhatsapp, FaYoutube,
} from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { SiExpress, SiFirebase, SiJavascript, SiMongodb, SiNextdotjs, SiRedux, SiTailwindcss, SiWebpack } from "react-icons/si"

export const skillIcons: Record<string, IconType> = {
  html5: FaHtml5, css3: FaCss3Alt, javascript: SiJavascript, react: FaReact, redux: SiRedux,
  nextjs: SiNextdotjs, tailwind: SiTailwindcss, bootstrap: FaBootstrap, nodejs: FaNodeJs,
  express: SiExpress, mongodb: SiMongodb, firebase: SiFirebase, github: FaGithub,
  webpack: SiWebpack, figma: FaFigma, bug: FaBug,
}

export const socialIcons: Record<string, IconType> = {
  github: FaGithub, linkedin: FaLinkedin, twitter: FaXTwitter, facebook: FaFacebook,
  youtube: FaYoutube, dev: FaDev, whatsapp: FaWhatsapp,
}
