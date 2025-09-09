
# Style Guide for Portfolio Website

## 0) Design Tokens
- **Colors**
  - `base` = `#0f1b31` (global background)
  - `surface` = `#13223d` (card background)
  - `primary` = `#375c88` (buttons, titles, highlights)
  - `accent` = `#ba7a79` (secondary emphasis, tags)
  - `text-primary` = `#ffffff` 90%
  - `text-muted` = `#ffffff` 60%
  - `border-muted` = `rgba(255,255,255,.08)`
- **Radii**: lg=0.75rem, xl=1rem, 2xl=1.25rem
- **Shadow**: soft=0 6px 30px rgba(0,0,0,.35), focus=0 0 0 3px rgba(186,122,121,.45)
- **Fonts**: Inter (sans), JetBrains Mono (mono)
- **Container**: max-w-7xl, px-4 md:px-6 lg:px-8
- **Transitions**: transition-all duration-200 ease-out

## 1) Tailwind Config
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        base: "#0f1b31",
        surface: "#13223d",
        primary: { DEFAULT: "#375c88" },
        accent: { DEFAULT: "#ba7a79" }
      },
      boxShadow: {
        soft: "0 6px 30px rgba(0,0,0,.35)",
        focus: "0 0 0 3px rgba(186,122,121,.45)"
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
      fontFamily: {
        sans: ["Inter","system-ui"],
        mono: ["JetBrains Mono","ui-monospace"]
      }
    }
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")]
}
```

## 2) Base Styles
```css
@layer base {
  body { @apply bg-base text-white/90 antialiased; }
  a { @apply text-white/80 hover:text-white; }
  ::selection { @apply bg-primary/70 text-white; }
}
@layer components {
  .btn { @apply inline-flex items-center rounded-2xl px-5 py-3 font-medium transition; }
  .btn-primary { @apply btn bg-primary text-white hover:bg-primary-500; }
  .btn-accent { @apply btn bg-accent text-white hover:bg-accent-500; }
  .card { @apply bg-surface rounded-2xl shadow-soft border border-white/5; }
  .tag { @apply inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-accent/20 text-white/90; }
  .section-title { @apply text-3xl md:text-4xl font-bold text-white; }
}
```

## 3) Components
- **Navigation**: fixed top, responsive with mobile toggle
- **Hero**: headline, CTA buttons (`btn-primary`, `btn-accent`)
- **About**: two-column grid (text + image)
- **Skills**: tags with `.tag`
- **Works**: `.card` grid
- **Blog**: card with thumbnail, title, excerpt
- **Contact**: form styled with `.card` and `.btn-primary`

## 4) Interaction (JS)
- Mobile menu toggle
- Scrollspy to highlight active section
- Smooth scrolling behavior

## 5) Accessibility
- High contrast text (#fff over #0f1b31)
- Focus states with `focus:ring-accent`
- Alt text for images
- Responsive grid layout

## 6) Gradient Borders

These border styles are designed to fit the theme colors:  
- Background (base) = `#0f1b31`  
- Primary (blue) = `#375c88`  
- Accent (pink) = `#ba7a79`  

### 6.1 Linear Gradient Border (Blue → Pink)
```html
<div class="p-[2px] rounded-[2rem] bg-gradient-to-r from-[#375c88] to-[#ba7a79]">
  <div class="rounded-[2rem] bg-[#0f1b31] p-6">
    <!-- Content -->
  </div>
</div>
```

### 6.2 Diagonal Gradient Border (Blue → Pink, Top-Right)
```html
<div class="p-[2px] rounded-[2rem] bg-gradient-to-tr from-[#375c88] to-[#ba7a79]">
  <div class="rounded-[2rem] bg-[#0f1b31] p-6">
    <!-- Content -->
  </div>
</div>
```

### 6.3 Gradient Border with Glow
```html
<div class="relative p-[2px] rounded-[2rem] 
            bg-gradient-to-r from-[#375c88] to-[#ba7a79] 
            shadow-[0_0_20px_rgba(186,122,121,0.45)]">
  <div class="rounded-[2rem] bg-[#0f1b31] p-6">
    <!-- Content -->
  </div>
</div>
```

💡 Recommendations:  
- Use **6.1** for profile or general cards.  
- Use **6.2** for hero highlights.  
- Use **6.3** for call-to-action or project showcase.  
