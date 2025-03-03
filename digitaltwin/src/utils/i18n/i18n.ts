import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import translationEN from "./Locales/en/translation.json"
import translationFR from "./Locales/fr/translation.json"
import translationIT from "./Locales/it/translation.json"
import translationDE from "./Locales/de/translation.json"

type Resources = {
  [ns: string]: {
    [key: string]: string
  }
}

const resources: { [lang: string]: Resources } = {
  en: {
    translation: translationEN,
  },
  fr: {
    translation: translationFR,
  },
  it: {
    translation: translationIT,
  },
  de: {
    translation: translationDE,
  },
}

i18n
  .use(initReactI18next) 
  .init({
    resources,
    lng: "en", 
    keySeparator: false, 
    interpolation: {
      escapeValue: false, 
    },
  })

export default i18n
