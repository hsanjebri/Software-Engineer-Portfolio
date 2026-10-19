import type { ImgHTMLAttributes } from "react";
import { imageManifest } from "../data/imageManifest";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  src: string;
  alt: string;
  /** Above-the-fold images opt out of lazy loading. */
  eager?: boolean;
};

/**
 * Serves the optimised WebP variants from the image manifest, with intrinsic
 * width/height so the browser reserves space (no layout shift).
 * Falls back to the original file when an image has no variants.
 */
const Img = ({ src, alt, eager, sizes = "100vw", ...rest }: Props) => {
  const meta = imageManifest[src];
  if (!meta) {
    return <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" {...rest} />;
  }
  const largest = meta.variants[meta.variants.length - 1];
  return (
    <img
      src={largest.src}
      srcSet={meta.variants.map((v) => `${v.src} ${v.w}w`).join(", ")}
      sizes={sizes}
      width={meta.width}
      height={meta.height}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      {...rest}
    />
  );
};

export default Img;
