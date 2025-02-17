module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      // Media query breakpoints
      screens: {
        xxxs: "240px",
        xxs: "350px",
        xs: "460px",
        sm: "640px",
        md: "768px",
        mmd: "872px",
        lg: "1024px",
        llg: "1120px",
        xl: "1280px",
        xxl: "1440px",
        "2xl": "1536px",
      },
      colors: {
        primary: "#ff7700",
        secondary: "#ffb866",
        dark: "#242323",
        dust: "#a4a4a4",
        "dawn-pink": "#ebebeb",
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    styled: true,
    // TODO: Theme needs works
    themes: [
      {
        solana: {
          fontFamily: {
            display: ["PT Mono, monospace"],
            body: ["Inter, sans-serif"],
          },
          primary: "#000000" /* Primary color */,
          "primary-focus": "#9945FF" /* Primary color - focused */,
          "primary-content": "#ffffff" /* Foreground content color to use on primary color */,

          secondary: "#808080" /* Secondary color */,
          "secondary-focus": "#f3cc30" /* Secondary color - focused */,
          "secondary-content": "#ffffff" /* Foreground content color to use on secondary color */,

          accent: "#33a382" /* Accent color */,
          "accent-focus": "#2aa79b" /* Accent color - focused */,
          "accent-content": "#ffffff" /* Foreground content color to use on accent color */,

          neutral: "#2b2b2b" /* Neutral color */,
          "neutral-focus": "#2a2e37" /* Neutral color - focused */,
          "neutral-content": "#ffffff" /* Foreground content color to use on neutral color */,

          "base-100": "#000000" /* Base color of page, used for blank backgrounds */,
          "base-200": "#35363a" /* Base color, a little darker */,
          "base-300": "#222222" /* Base color, even more darker */,
          "base-content": "#f9fafb" /* Foreground content color to use on base color */,

          info: "#2094f3" /* Info */,
          success: "#009485" /* Success */,
          warning: "#ff9900" /* Warning */,
          error: "#ff5724" /* Error */,
        },
      },
      // backup themes:
      // 'dark',
      // 'synthwave'
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
};
