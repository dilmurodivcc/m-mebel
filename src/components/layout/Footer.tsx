import React from "react";
import { FaInstagram, FaTelegramPlane } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useCategoryStore } from "@/app/category/store";

const categories = [
  { name: "sofas" },
  { name: "coffeeTables" },
  { name: "endTables" },
  { name: "tvStands" },
  { name: "armchairs" },
];

const Footer = () => {
  const { t } = useTranslation();
  const setSelectedCategory = useCategoryStore((state) => state.setSelectedCategory);

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
              <Link
                href="/category"
                onClick={() => setSelectedCategory(cat.name)}
              >
                {t(cat.name)}
              </Link>
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
