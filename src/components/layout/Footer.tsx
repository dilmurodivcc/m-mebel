import React from "react";
import { FaInstagram, FaTelegramPlane } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const categories = [
  { name: "sofas", path: "/category/sofas" },
  { name: "sectionals", path: "/category/sectionals" },
  { name: "coffeeTables", path: "/category/coffee-tables" },
  { name: "endTables", path: "/category/end-tables" },
  { name: "tvStands", path: "/category/tv-stands" },
  { name: "armchairs", path: "/category/armchairs" },
];

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="column">
          <div className="footer__brand">
            <img src="/icons/logo.png" alt="logo" width={60} />
            <span>{t("logo")}</span>
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
          <li className="title">{t("shopByCategory")}</li>
          {categories.map((cat) => (
            <li key={cat.name}>
              <a href={cat.path}>{t(cat.name)}</a>
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
