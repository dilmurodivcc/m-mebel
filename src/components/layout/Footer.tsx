import React, { useState } from "react";
import { FaInstagram, FaTelegramPlane } from "react-icons/fa";
import { GrLanguage } from "react-icons/gr";
import { LuSunMedium, LuMoon } from "react-icons/lu";
import { FaYoutube } from "react-icons/fa";
const categories = [
  { name: "Sofas", path: "/category/sofas" },
  { name: "Beds", path: "/category/beds" },
  { name: "Dining Tables", path: "/category/dining-tables" },
  { name: "Chairs", path: "/category/chairs" },
  { name: "Storage", path: "/category/storage" },
  { name: "Decor", path: "/category/decor" },
];

const languages = [
  { name: "Uzbek", code: "uz", icon: "/icons/uz.avif" },
  { name: "Russian", code: "ru", icon: "/icons/ru.png" },
  { name: "English", code: "en", icon: "/icons/en.jpg" },
];

const Footer = () => {
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("en");

  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="column">
          <div className="footer__brand">
            <img src="/icons/logo.png" alt="logo" width={60} />
            <span>forniture</span>
          </div>
          <div className="footer__social">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
            >

              <FaTelegramPlane />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
        <ul className="footer__links">
          <li className="title">Categories</li>
          {categories.map((cat) => (
            <li key={cat.name}>
              <a href={cat.path}>{cat.name}</a>
            </li>
          ))}
        </ul>
        <div className="footer__map">
          <iframe
            src="https://yandex.uz/map-widget/v1/?um=constructor%3Aexampleid&amp;source=constructor"
            width="100%"
            height="100%"
            frameBorder="0"
            title="Yandex Map"
            style={{ border: 0 }}
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
