# Mobile Menu Bug Fix - Donate Button Issue

## Problem Identified

When toggling the mobile menu, two donate buttons appeared:
1. **Fixed donate button** - remained visible and overlapped "Bola Na Lesa" text
2. **Inline donate button** - correctly appeared inside the collapsed menu

This created visual clutter and a poor user experience.

---

## Root Cause

The original HTML structure placed the donate button BEFORE the navbar-collapse element:
```html
<a class="navbar-brand">...</a>
<a class="donate-btn-fixed">...</a>  <!-- Problem: Can't hide this with CSS -->
<button class="navbar-toggler">...</button>
<div class="navbar-collapse">...</div>
```

CSS cannot select **previous siblings**, so we couldn't hide `.donate-btn-fixed` when `.navbar-collapse.show` was active.

---

## Solution Implemented

### 1. **HTML Structure Change** (All 7 Pages)

Reordered elements to place navbar-collapse BEFORE donate-btn-fixed:

**NEW ORDER:**
```html
<a class="navbar-brand">...</a>
<button class="navbar-toggler ms-auto">...</button>  <!-- Moved up -->
<a class="donate-btn-fixed">...</a>                   <!-- Moved after toggler -->
<div class="navbar-collapse">...</div>                <!-- Now before donate button -->
```

This allows us to use the **sibling selector (~)** in CSS:
```css
.navbar-collapse.show ~ .donate-btn-fixed { /* Hide when menu open */ }
```

### 2. **CSS Updates** (styles.css)

#### Added Hide Logic:
```css
/* Hide fixed donate button when menu is expanded */
.navbar-collapse.show ~ .donate-btn-fixed {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
}

/* Also hide during collapse animation */
.navbar-collapse.collapsing ~ .donate-btn-fixed {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
}
```

#### Updated Visual Order (Mobile):
```css
@media (max-width: 991.98px) {
    .navbar-brand { order: 1; }         /* Left */
    .donate-btn-fixed { order: 2; }     /* Center (visually) */
    .navbar-toggler { order: 3; }       /* Right */
    .navbar-collapse { order: 4; }      /* Below (when open) */
}
```

#### Fixed Margins:
```css
.navbar-toggler {
    margin-left: 0.5rem; /* Space from donate button */
}

.donate-btn-fixed {
    margin-left: auto;   /* Push to right */
    margin-right: 0;     /* Remove unnecessary spacing */
}
```

#### Z-Index Management:
```css
.navbar-brand { z-index: 1001; }      /* Keep brand visible */
.navbar-toggler { z-index: 1002; }    /* Always clickable */
.donate-btn-fixed { z-index: 1001; }  /* Same as brand */
.navbar-collapse { z-index: 1000; }   /* Below controls */
```

---

## Changes Made

### HTML Files Updated (7 total):
1. ✅ index.html
2. ✅ about.html
3. ✅ contact.html
4. ✅ donate.html
5. ✅ join-us.html
6. ✅ newsletter.html
7. ✅ our-work.html

### CSS Files Updated (1 total):
1. ✅ styles.css

---

## How It Works Now

### **Mobile View - Menu Closed:**
```
┌─────────────────────────────────────────────────┐
│ [Logo] Bola Na Lesa   [Donate]   [≡]           │
└─────────────────────────────────────────────────┘
```
- Fixed donate button is **visible** between brand and menu icon
- Clean horizontal layout maintained

### **Mobile View - Menu Open:**
```
┌─────────────────────────────────────────────────┐
│ [Logo] Bola Na Lesa              [≡]           │ ← Fixed donate hidden!
├─────────────────────────────────────────────────┤
│ • Home                                          │
│ • About Us                                      │
│ • Resources                                     │
│ • Join Us                                       │
│ • Contact Us                                    │
│ ┌───────────────┐                              │
│ │   [♥] Donate  │ ← Only this donate visible   │
│ └───────────────┘                              │
└─────────────────────────────────────────────────┘
```
- Fixed donate button is **hidden** (opacity: 0, visibility: hidden)
- Only the inline donate button inside menu is visible
- No overlap with "Bola Na Lesa" text
- Clean, professional appearance

---

## Technical Details

### Selector Strategy:
- **~** (general sibling selector) - selects `.donate-btn-fixed` that comes after `.navbar-collapse.show`
- Works because we reordered HTML so collapse comes before donate button
- Transitions smoothly with opacity and visibility

### Flexbox Order:
- Visual presentation controlled by CSS `order` property
- HTML order: Brand → Toggler → Donate → Collapse
- Visual order: Brand → Donate → Toggler → Collapse (below)

### Why This Works:
1. **HTML order** enables CSS sibling selector (~)
2. **Flexbox order** maintains visual layout
3. **Opacity + visibility** creates smooth hide/show
4. **Z-index** prevents overlap issues
5. **Pointer-events: none** ensures hidden button isn't clickable

---

## Testing Checklist

✅ **Mobile (≤991px) - Menu Closed:**
- Fixed donate button visible between brand and toggler
- Proper horizontal alignment
- All elements clickable

✅ **Mobile (≤991px) - Menu Open:**
- Fixed donate button hidden
- No overlap with brand text
- Inline donate button visible in menu
- Menu toggler still clickable

✅ **Desktop (≥992px):**
- Fixed donate button visible in navbar
- Inline donate button hidden
- Full navigation menu visible (no collapse)

✅ **Transitions:**
- Smooth fade out when menu opens
- Smooth fade in when menu closes
- No flickering or jumping

---

## Browser Compatibility

✅ **CSS Features Used:**
- Flexbox order property (IE11+)
- Sibling selector ~ (All browsers)
- Opacity + visibility (All browsers)
- CSS transitions (IE10+)

All features are widely supported across modern browsers.

---

## Summary

**Problem:** Two donate buttons appeared when mobile menu was open, causing overlap and poor UX.

**Solution:** Reordered HTML elements to enable CSS sibling selector, then hide fixed donate button when menu is expanded.

**Result:** Clean mobile menu experience with only one donate button visible at a time, no overlapping elements, and smooth transitions.

---

**Bug Fix Date:** February 3, 2026  
**Status:** ✅ Fixed and Tested  
**Files Modified:** 7 HTML + 1 CSS = 8 total files
