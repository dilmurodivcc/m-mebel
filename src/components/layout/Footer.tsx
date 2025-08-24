import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { useCategoryStore } from "@/app/category/store";
import { useGetCategories } from "@/hooks/getCategories";
import { FaPhone } from "react-icons/fa6";
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

  const { data: categoriesData } = useGetCategories();
  const { siteName, favicon } = useGetSiteInfo();
  const { socialMedia } = useGetSocialMediaLinks();
  const { phoneNumbers } = useGetPhoneNumbers();

  const categories = categoriesData?.data || [];

  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="column">
          <Link href="/" className="footer__brand">
            <Image
              src={
                favicon?.url ? getImageUrl(favicon.url) : "/icons/favicon.png"
              }
              alt={siteName || "logo"}
              width={60}
              height={60}
              style={{ objectFit: "contain" }}
            />
            <span suppressHydrationWarning>{siteName || t("logo")}</span>
          </Link>
          <div className="footer__social">
            {socialMedia?.Instagram && (
              <a
                href={socialMedia.Instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Image
                  src="/icons/instagram.webp"
                  width={20}
                  height={20}
                  alt="instagram"
                  style={{ objectFit: "contain" }}
                />
              </a>
            )}
            {socialMedia?.Telegram && (
              <a
                href={`https://${socialMedia.Telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
              >
                <Image
                  src="/icons/telegram.webp"
                  width={20}
                  height={20}
                  alt="telegram"
                  style={{ objectFit: "contain" }}
                />
              </a>
            )}
            {socialMedia?.YouTobe && (
              <a
                href={socialMedia.YouTobe}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <Image
                  src="/icons/youtube.png"
                  width={20}
                  height={20}
                  alt="youtube"
                  style={{ objectFit: "contain" }}
                />
              </a>
            )}
          </div>
          {phoneNumbers && (
            <div className="footer__contact">
              <a href={`tel:${phoneNumbers.tel1}`}>
                <FaPhone color="green" /> +{phoneNumbers.tel1}
              </a>
              {phoneNumbers.tel2 && (
                <a href={`tel:${phoneNumbers.tel2}`}>
                  <FaPhone color="green" /> +{phoneNumbers.tel2}
                </a>
              )}
              {socialMedia?.Email && (
                <a
                  href={`mailto:${socialMedia.Email}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Image
                    width={20}
                    height={20}
                    src="/icons/gmail.png"
                    alt="gmail"
                    style={{ display: "inline-block", objectFit: "contain" }}
                  />
                  <span style={{ color: "var(--text-tertiary)", fontSize: 16 }}>
                    {socialMedia.Email}
                  </span>
                </a>
              )}
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
