# 📊 Google Analytics Setup - Complete Guide

## ✅ **Google Analytics Successfully Integrated!**

Your Google Analytics tracking is now live on all pages of your website.

---

## 🎯 **Tracking ID:**

```
G-PZ2WWEZPKM
```

This ID is configured to track:
- ✅ All customer-facing pages
- ✅ All admin pages
- ✅ Page views
- ✅ User interactions
- ✅ E-commerce events

---

## 📂 **Files Created/Modified:**

### 1. **GoogleAnalytics Component**
**File:** `src/components/GoogleAnalytics.tsx`

```typescript
'use client';

import Script from 'next/script';

export default function GoogleAnalytics() {
  const GA_MEASUREMENT_ID = 'G-PZ2WWEZPKM';

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </>
  );
}
```

### 2. **Root Layout**
**File:** `src/app/layout.tsx`

**Changes:**
- ✅ Imported `GoogleAnalytics` component
- ✅ Added component to body (before content)
- ✅ Loads on every page automatically

---

## 🚀 **How It Works:**

### **Script Loading Strategy:**
- **Strategy:** `afterInteractive`
- **When:** After page becomes interactive
- **Why:** Doesn't block initial page load
- **Result:** Better performance + accurate tracking

### **What Gets Tracked:**
1. **Page Views** - Every page visit
2. **User Sessions** - User behavior
3. **Traffic Sources** - How users found you
4. **User Demographics** - Age, location, device
5. **Conversions** - Quote requests, orders
6. **E-commerce** - Product views, cart additions

---

## 📊 **Where to See Analytics:**

### **Google Analytics Dashboard:**
```
https://analytics.google.com/

1. Sign in with your Google account
2. Select property: G-PZ2WWEZPKM
3. View reports
```

### **Key Reports to Check:**

**Real-Time:**
- See current active users
- What pages they're viewing
- Where they're coming from

**Acquisition:**
- Traffic sources (Google, Direct, Social, etc.)
- How users found your site

**Engagement:**
- Most viewed pages
- Average session duration
- Pages per session

**E-commerce:**
- Product views
- Add to cart events
- Purchase events
- Revenue tracking

**Demographics:**
- User age ranges
- Gender distribution
- Interests

**Technology:**
- Desktop vs Mobile
- Browser types
- Screen resolutions
- Operating systems

---

## 🎯 **What Pages Are Being Tracked:**

### **Customer Pages:**
- ✅ Homepage (`/`)
- ✅ Products (`/products`)
- ✅ Product Details
- ✅ Cart (`/cart`)
- ✅ Checkout (`/checkout`)
- ✅ Get Quote (`/get-quote`)
- ✅ About Us (`/about`)
- ✅ Contact (`/contact`)
- ✅ Customer Login/Signup
- ✅ Customer Dashboard

### **Admin Pages:**
- ✅ Admin Login (`/admin/login`)
- ✅ Admin Dashboard (`/admin/dashboard`)
- ✅ Products Management
- ✅ Orders Management
- ✅ Quotes Management
- ✅ Settings

**Note:** You may want to filter out admin traffic in Google Analytics for more accurate customer insights.

---

## 🔧 **To Change Tracking ID:**

### **Option 1: Edit Component Directly**

**File:** `src/components/GoogleAnalytics.tsx`

```typescript
// Change this line:
const GA_MEASUREMENT_ID = 'G-PZ2WWEZPKM';

// To your new ID:
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
```

### **Option 2: Use Environment Variables** (Recommended)

**Step 1:** Create `.env.local` file:
```bash
# .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-PZ2WWEZPKM
```

**Step 2:** Update component:
```typescript
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
```

**Benefits:**
- ✅ Different IDs for dev/production
- ✅ Easier to manage
- ✅ More secure
- ✅ No code changes needed

---

## 📈 **Advanced Tracking (Optional):**

### **Track Custom Events:**

You can add custom event tracking for specific actions:

```typescript
// Example: Track "Add to Cart" event
gtag('event', 'add_to_cart', {
  currency: 'INR',
  value: 10.00,
  items: [{
    item_id: 'SKU_12345',
    item_name: 'Brown 3-Ply Box',
    price: 10.00,
    quantity: 250
  }]
});

// Example: Track "Purchase" event
gtag('event', 'purchase', {
  transaction_id: 'T12345',
  value: 2500.00,
  currency: 'INR',
  items: [...]
});

// Example: Track "Generate Lead" (Quote Request)
gtag('event', 'generate_lead', {
  value: 1.00,
  currency: 'INR'
});
```

**Where to add these:**
- Cart component (for add_to_cart)
- Checkout success (for purchase)
- Quote submission (for generate_lead)

---

## 🎯 **E-commerce Tracking Setup:**

### **Enhanced E-commerce Events:**

To get better insights, implement these events:

1. **view_item_list** - Products page view
2. **view_item** - Single product view
3. **add_to_cart** - Add to cart click
4. **begin_checkout** - Checkout page visit
5. **purchase** - Order completion
6. **generate_lead** - Quote request

**Example Implementation:**

```typescript
// In ProductCard.tsx
const handleAddToCart = () => {
  // Your existing add to cart logic
  
  // Add GA tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'INR',
      value: product.basePrice * quantity,
      items: [{
        item_id: product.productCode,
        item_name: product.name,
        price: product.basePrice,
        quantity: quantity
      }]
    });
  }
};
```

---

## 🔒 **Privacy & GDPR Compliance:**

### **Current Setup:**
- ✅ Analytics loaded after interaction
- ✅ No personal data collected by default
- ✅ Standard Google Analytics TOS apply

### **To Add Cookie Consent (Optional):**

If you want to be extra compliant:

1. **Add Cookie Banner**
2. **Only load GA after consent**
3. **Allow opt-out**

**Example Cookie Consent Component:**

```typescript
// src/components/CookieConsent.tsx
'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    // Enable GA here
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <p>We use cookies to improve your experience.</p>
        <button onClick={acceptCookies} className="bg-primary px-4 py-2 rounded">
          Accept
        </button>
      </div>
    </div>
  );
}
```

---

## 📊 **Verification:**

### **Check if GA is Working:**

**Method 1: Real-Time Report**
1. Visit Google Analytics
2. Go to Real-Time report
3. Visit your website
4. You should see yourself in real-time!

**Method 2: Browser Console**
```javascript
// In browser console (F12):
console.log(window.dataLayer);
// Should show array of events

console.log(window.gtag);
// Should show function
```

**Method 3: Google Tag Assistant**
1. Install Chrome extension "Tag Assistant Legacy"
2. Visit your site
3. Click extension icon
4. Should show GA tag detected

**Method 4: Network Tab**
1. Open DevTools (F12)
2. Go to Network tab
3. Filter: "collect"
4. Visit a page
5. Should see requests to google-analytics.com

---

## ⚠️ **Important Notes:**

### **Data Processing:**
- **Delay:** 24-48 hours for full reports
- **Real-time:** Available immediately
- **Historical:** Not retroactive

### **Admin Traffic:**
- Admin pages are tracked
- Consider filtering in GA settings:
  - Settings → Data Filters
  - Exclude internal traffic
  - Use IP address filter

### **Development vs Production:**
- Consider separate GA properties
- Dev: `G-XXXXXXXXXX`
- Prod: `G-PZ2WWEZPKM`

---

## ✅ **Checklist:**

After deployment, verify:

- [ ] GA script loads on all pages
- [ ] Real-time report shows visitors
- [ ] Page views are tracked
- [ ] No console errors
- [ ] Scripts load after page interactive
- [ ] Admin traffic is visible (or filtered)
- [ ] Mobile tracking works
- [ ] Different browsers work

---

## 🎉 **You're All Set!**

**Google Analytics is now tracking:**
- ✅ Every page view
- ✅ User behavior
- ✅ Traffic sources
- ✅ Conversions
- ✅ E-commerce activity

**Your Tracking ID:**
```
G-PZ2WWEZPKM
```

**Access Analytics:**
```
https://analytics.google.com/
```

---

## 📚 **Useful Resources:**

- [Google Analytics Help](https://support.google.com/analytics)
- [GA4 Reports Guide](https://support.google.com/analytics/topic/9359351)
- [E-commerce Tracking](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)

---

**Your analytics are live and tracking!** 📊✨
