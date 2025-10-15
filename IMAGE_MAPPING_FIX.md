# 🔧 Image Mapping Fix Guide

## ❌ Issues Found:

1. **Wrong filenames in folder:**
   - `publicimagesbubble_wrap_roll.jpg` → Should be `bubble_wrap_roll.jpg`
   - `publicImagescustom_printed_box.jpg` → Should be `custom_printed_box.jpg`

2. **Missing images** - Need to create copies/rename existing images

---

## ✅ STEP 1: Rename These Files

**In folder:** `public/images/`

**Rename:**
```
FROM: publicimagesbubble_wrap_roll.jpg
TO:   bubble_wrap_roll.jpg

FROM: publicImagescustom_printed_box.jpg  
TO:   custom_printed_box.jpg
```

---

## ✅ STEP 2: Create Copies for Missing Images

**Copy these files with new names:**

### Corrugated Boxes:
```
COPY: universal_box_brown_default.jpg
TO:   corrugated-box-3ply.jpg

COPY: mailer_box_brown_5ply.jpg
TO:   corrugated-box-5ply.jpg

COPY: mailer_box_brown_5ply.jpg
TO:   brown-mailer-3ply.jpg

COPY: mailer_box_brown_5ply.jpg
TO:   brown-mailer-5ply.jpg

COPY: universal_box_brown_default.jpg
TO:   pizza-box.jpg
```

### Protective Packaging:
```
COPY: bubble_wrap_roll.jpg (after renaming!)
TO:   bubble-wrap.jpg

COPY: epe_foam_sheet.jpg
TO:   epe-foam-sheet.jpg

COPY: epe_foam_sheet.jpg
TO:   epe-foam-jar.jpg
```

### Tapes:
```
COPY: clear_bopp_tape.jpg
TO:   bopp-tape.jpg

COPY: brown_packing_tape.jpg
TO:   specialty-tape.jpg

COPY: brown_packing_tape.jpg
TO:   custom-tape.jpg
```

### Foam Products:
```
COPY: thermocol_sheet_white.jpg
TO:   thermocol-sheet.jpg

COPY: thermocol_sheet_white.jpg
TO:   thermocol-jar.jpg
```

### Stretch Film:
```
COPY: stretch_film_roll.jpg
TO:   stretch-film.jpg
```

---

## 🎯 STEP 3: Complete File Operations

**Total operations needed:**
- 2 renames
- 15 copies

---

## 📋 Final Image List (After Fix)

Your `public/images/` folder should have:

**Existing (Keep as is):**
- brown_packing_tape.jpg ✅
- category_corrugated_boxes.jpg ✅
- category_protective.jpg ✅
- category_tapes.jpg ✅
- category_thermocol_foam.jpg ✅
- clear_bopp_tape.jpg ✅
- epe_foam_sheet.jpg ✅
- hero-background.jpg ✅
- mailer_box_brown_5ply.jpg ✅
- placeholder_category.jpg ✅
- thermocol_sheet_white.jpg ✅
- universal_box_brown_default.jpg ✅
- stretch_film_roll.jpg ✅
- foam_sheet_packaging.jpg ✅
- placeholder.png ✅

**After Rename:**
- bubble_wrap_roll.jpg (renamed from publicimagesbubble_wrap_roll.jpg)
- custom_printed_box.jpg (renamed from publicImagescustom_printed_box.jpg)

**New Copies:**
- corrugated-box-3ply.jpg
- corrugated-box-5ply.jpg
- brown-mailer-3ply.jpg
- brown-mailer-5ply.jpg
- pizza-box.jpg
- bubble-wrap.jpg
- epe-foam-sheet.jpg
- epe-foam-jar.jpg
- bopp-tape.jpg
- specialty-tape.jpg
- custom-tape.jpg
- thermocol-sheet.jpg
- thermocol-jar.jpg
- stretch-film.jpg

---

**Total files after fix: 31 images**
