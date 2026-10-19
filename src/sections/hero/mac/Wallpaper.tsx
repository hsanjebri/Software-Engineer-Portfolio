/** Rolling-hills wallpaper in the Apple palette (no purple). Pure SVG. */
const Wallpaper = () => (
  <svg className="wallpaper" viewBox="0 0 1280 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="wp-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3aa0ff" />
        <stop offset="0.45" stopColor="#8fd3ff" />
        <stop offset="0.75" stopColor="#ffe3b3" />
        <stop offset="1" stopColor="#ffb36b" />
      </linearGradient>
      <radialGradient id="wp-sun" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fff6d6" />
        <stop offset="0.35" stopColor="#ffd60a" stopOpacity="0.85" />
        <stop offset="1" stopColor="#ff9f0a" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="wp-h1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#64d2ff" />
        <stop offset="1" stopColor="#0a84ff" />
      </linearGradient>
      <linearGradient id="wp-h2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#30d158" />
        <stop offset="1" stopColor="#0f9d8a" />
      </linearGradient>
      <linearGradient id="wp-h3" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#ffd60a" />
        <stop offset="0.5" stopColor="#ff9f0a" />
        <stop offset="1" stopColor="#ff375f" />
      </linearGradient>
      <linearGradient id="wp-h4" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#1f8f6a" />
        <stop offset="1" stopColor="#0b5d63" />
      </linearGradient>
    </defs>
    <rect width="1280" height="800" fill="url(#wp-sky)" />
    <circle cx="930" cy="360" r="230" fill="url(#wp-sun)" />
    <path d="M0 470 C200 395 390 440 570 410 C770 378 950 440 1280 392 V800 H0Z" fill="url(#wp-h1)" />
    <path d="M0 560 C190 498 420 566 650 520 C870 476 1050 560 1280 506 V800 H0Z" fill="url(#wp-h2)" />
    <path d="M0 650 C250 602 470 668 730 626 C950 590 1110 646 1280 612 V800 H0Z" fill="url(#wp-h3)" />
    <path d="M0 728 C270 684 530 748 810 706 C1030 674 1170 724 1280 702 V800 H0Z" fill="url(#wp-h4)" />
  </svg>
);

export default Wallpaper;
