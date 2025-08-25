"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  style?: React.CSSProperties;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
}

export default function SafeImage({
  src,
  alt,
  width,
  height,
  style,
  className,
  priority = false,
  onClick,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc("/img/cardimg.png");
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      style={style}
      className={className}
      priority={priority}
      onClick={onClick}
      onError={handleError}
    />
  );
}
