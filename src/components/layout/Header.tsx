"use client"

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { HiSun, HiMoon, HiChevronDown } from "react-icons/hi";

const themes = [
  { label: "Light", value: "light", icon: <HiSun /> },
  { label: "Dark", value: "dark", icon: <HiMoon /> },
];
const languages = [
  { label: "English", value: "en" },
  { label: "O'zbek", value: "uz" },
  { label: "Русский", value: "ru" },
];

const Header = () => {
  return (
    <header className="header">
      
    </header>
  );
};
export default Header;
