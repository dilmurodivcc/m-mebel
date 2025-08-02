"use client";

import React, { useState, useEffect } from "react";
import { GrLanguage } from "react-icons/gr";
import { useTranslation } from "react-i18next";

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
  {
    name: "English",
    code: "en",
    icon: "/icons/en.jpg",
  },
];



const LanguageChanger = ({
  className = "",
}) => {
  const { i18n } = useTranslation();
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
    setIsDropdownOpen(false);
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
                <img
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