"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { LuSunMedium, LuMoon } from "react-icons/lu";
import { GrLanguage } from "react-icons/gr";
import { useCategoryStore } from "@/app/category/store";
import type { CategoryState } from "@/app/category/store";
import { useRouter } from "next/navigation";

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
const categories = [
  { name: "Sofas" },
  { name: "Tables" },
  { name: "Chairs" },
  { name: "Storage" },
  { name: "Beds" },
  { name: "Decor" },
];
const Header = () => {
  const [theme, setTheme] = useState("light");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const selectedCategory = useCategoryStore(
    (state: CategoryState) => state.selectedCategory
  );
  const setSelectedCategory = useCategoryStore(
    (state: CategoryState) => state.setSelectedCategory
  );
  const router = useRouter();
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isDropdownOpen && target && !target.closest(".dropdown-content")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);
  return (
    <header className="header">
      <div className="logo">
        <img width={80} src="/icons/logo.png" alt="logo" />
        <h5>forniture</h5>
      </div>
      <nav className="navbar">
        <ul className="menu-list">
          <li>
            <Link href="/category">Best Sellers </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.name}>
              <button
                className={
                  selectedCategory === cat.name ? "active-category" : ""
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "inherit",
                  font: "inherit",
                }}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  router.push("/category");
                }}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
        <ul className="btn-group">
          <li>
            <button className="primary-btn">
              <IoSearchOutline />
            </button>
          </li>
          <li>
            <button className="primary-btn" onClick={toggleTheme}>
              {theme === "light" ? <LuSunMedium /> : <LuMoon />}
            </button>
          </li>
          <li>
            <button
              className="primary-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <GrLanguage />
            </button>
            {isDropdownOpen && (
              <div className="dropdown-overlay">
                <ul className="dropdown-content">
                  {languages.map((language) => (
                    <li key={language.code}>
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
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Header;
