import React from "react";
import { FaInstagram, FaTelegramPlane } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useCategoryStore } from "@/app/category/store";
import { useGetCategories } from "@/hooks/getCategories";
import {
  useGetSiteInfo,
  useGetSocialMediaLinks,
  useGetPhoneNumbers,
} from "@/hooks/getGlobals";
import { getImageUrl } from "@/utils/formatPrice";

const Footer = () => {
  const { t } = useTranslation();
  const setSelectedCategory = useCategoryStore(
    (state) => state.setSelectedCategory
  );

  // API hooks
  const { data: categoriesData } = useGetCategories();
  const { siteName, favicon } = useGetSiteInfo();
  const { socialMedia } = useGetSocialMediaLinks();
  const { phoneNumbers } = useGetPhoneNumbers();

  // Get data from API
  const categories = categoriesData?.data || [];

  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="column">
          <div className="footer__brand">
            <img
              src={favicon?.url ? getImageUrl(favicon.url) : "/icons/logo.png"}
              alt={siteName || "logo"}
              width={60}
            />
            <span>{siteName || t("logo")}</span>
          </div>
          <div className="footer__social">
            {socialMedia?.Instagram && (
              <a
                href={socialMedia.Instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            )}
            {socialMedia?.Telegram && (
              <a
                href={`https://${socialMedia.Telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
              >
                <FaTelegramPlane />
              </a>
            )}
            {socialMedia?.YouTobe && (
              <a
                href={socialMedia.YouTobe}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
            )}
          </div>
          {phoneNumbers && (
            <div className="footer__contact">
              <p>📞 {phoneNumbers.tel1}</p>
              {phoneNumbers.tel2 && <p>📞 {phoneNumbers.tel2}</p>}
              {socialMedia?.Email && <p>📧 {socialMedia.Email}</p>}
            </div>
          )}
        </div>
        <ul className="footer__links">
          <li className="title">{t("shopByCategory")}</li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/category?category=${cat.slug}`}
                onClick={() => {
                  console.log(
                    "Footer: Category clicked:",
                    cat.name,
                    "slug:",
                    cat.slug
                  );
                  setSelectedCategory(cat.name);
                }}
              >
                {cat.name}
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
