"use client";

import "../i18n";
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
    } catch (err) {
      console.error("changeLanguage error:", err);
    }
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <button onClick={() => changeLanguage("en")}>English</button>
      <button onClick={() => changeLanguage("ru")}>Русский</button>
    </div>
  );
};

export default LanguageSwitcher;
