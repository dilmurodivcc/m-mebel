"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GrLanguage } from "react-icons/gr";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "../../app/theme/store";

const languages = [
  {
    name: "Uzbek",
    code: "uz",
    icon: "/icons/uz.avif",
  },
  {
    name: "Russian",
    code: "ru",
    icon: "/icons/ru.png",
  },
];

/**
 * LanguageChanger component that handles language switching.
 * When a language is selected:
 * 1. Updates i18n language for UI translations
 * 2. Updates the language store for persistence
 * 3. Reloads the page to ensure API requests use the new locale
 *
 * The API interceptor will automatically add locale=uz or locale=ru
 * to all subsequent API requests based on the selected language.
 */
const LanguageChanger = ({ className = "" }) => {
  const { i18n } = useTranslation();
  const { setLanguage } = useThemeStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isDropdownOpen && target && !target.closest(".language-changer")) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);

    setLanguage(languageCode as "uz" | "ru");

    setIsDropdownOpen(false);

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleLanguageButtonClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={`language-changer ${className}`}>
      <button
        className="primary-btn"
        onClick={handleLanguageButtonClick}
        title="Til tanlash"
      >
        <GrLanguage />
      </button>

      {isDropdownOpen && (
        <div className="dropdown-overlay">
          <ul className="dropdown-content dropdown-anim">
            {languages.map((language) => (
              <li
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={i18n.language === language.code ? "active" : ""}
              >
                <Image
                  width={18}
                  height={18}
                  style={{ borderRadius: "50%" }}
                  src={language.icon}
                  alt={language.name}
                />
                {language.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageChanger;
