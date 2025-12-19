# 🖼️ Update Product Images - Step by Step Guide

## ✅ Your New Images Are Ready!

You've added these 6 images to `public/images/`:
1. ✅ `universal_box_brown_default.jpg` (3-ply - already working)
2. ✅ `universal_box_brown_5ply.jpg` (NEW - needs database update)
3. ✅ `pizza_box_style.jpg` (NEW - needs database update)
4. ✅ `custom_branded_tape.jpg` (NEW - needs database update)
5. ✅ `thermocol_jar_packaging.jpg` (NEW - needs database update)
6. ✅ `epe_foam_jar_packaging.jpg` (NEW - needs database update)

---

## 🚀 **OPTION 1: Automatic Update (Recommended)**

### Run the automated script:

```bash
# Make sure you're in the project directory
cd "c:/my files/DOdes/packlite-com/packlite-next"

# Run the update script
node scripts/update-images.js
```

**This will:**
- ✅ Find all matching products
- ✅ Update their image URLs automatically
- ✅ Show you what was updated
- ✅ Complete in seconds

---

## 🔧 **OPTION 2: Manual Update via Admin Panel**

If the script doesn't work, update manually:

### **Step-by-Step:**

1. **Login to Admin:**
   ```
   http://localhost:3000/admin/login
   Email: admin@packlite.com
   Password: Admin123!
   ```

2. **Go to Dashboard:**
   ```
   http://localhost:3000/admin/dashboard
   ```

3. **Find and Edit Each Product:**

#### **Product 1: Brown 5-Ply Universal Boxes**
- Click "Edit" on the product
- Find "Image URL" field
- Change to: `/images/universal_box_brown_5ply.jpg`
- Click "Update Product"

#### **Product 2: Pizza Boxes**
- Click "Edit" on Pizza Box product
- Find "Image URL" field
- Change to: `/images/pizza_box_style.jpg`
- Click "Update Product"

#### **Product 3: Custom Branded Tape**
- Click "Edit" on Custom/Branded Tape product
- Find "Image URL" field
- Change to: `/images/custom_branded_tape.jpg`
- Click "Update Product"

#### **Product 4: Thermocol JAR Packaging**
- Click "Edit" on Thermocol JAR product
- Find "Image URL" field
- Change to: `/images/thermocol_jar_packaging.jpg`
- Click "Update Product"

#### **Product 5: EPE Foam JAR Packaging**
- Click "Edit" on EPE Foam JAR product
- Find "Image URL" field
- Change to: `/images/epe_foam_jar_packaging.jpg`
- Click "Update Product"

---

## 🗄️ **OPTION 3: Direct Database SQL**

If you have database access (Prisma Studio or pgAdmin):

### **Run this SQL:**

```sql
-- Update Brown 5-Ply Universal Boxes
UPDATE "Product" 
SET "imageUrl" = '/images/universal_box_brown_5ply.jpg'
WHERE name ILIKE '%5-Ply Universal%' 
   OR name ILIKE '%Brown 5-Ply%';

-- Update Pizza Boxes
UPDATE "Product" 
SET "imageUrl" = '/images/pizza_box_style.jpg'
WHERE name ILIKE '%Pizza Box%';

-- Update Custom Branded Tape
UPDATE "Product" 
SET "imageUrl" = '/images/custom_branded_tape.jpg'
WHERE name ILIKE '%Custom%Tape%' 
   OR name ILIKE '%Branded%';

-- Update Thermocol JAR
UPDATE "Product" 
SET "imageUrl" = '/images/thermocol_jar_packaging.jpg'
WHERE name ILIKE '%Thermocol%' AND name ILIKE '%JAR%';

-- Update EPE Foam JAR
UPDATE "Product" 
SET "imageUrl" = '/images/epe_foam_jar_packaging.jpg'
WHERE name ILIKE '%EPE%' AND name ILIKE '%JAR%';

-- Verify updates
SELECT id, name, "imageUrl" FROM "Product" 
WHERE "imageUrl" LIKE '%universal_box_brown_5ply%'
   OR "imageUrl" LIKE '%pizza_box_style%'
   OR "imageUrl" LIKE '%custom_branded_tape%'
   OR "imageUrl" LIKE '%thermocol_jar_packaging%'
   OR "imageUrl" LIKE '%epe_foam_jar_packaging%'
ORDER BY name;
```

---

## ✅ **After Updating:**

### **1. Restart Dev Server:**
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### **2. Test on Products Page:**
```
Visit: http://localhost:3000/products
```

### **3. Verify Each Product:**
- ✅ Brown 5-Ply Universal Boxes - Shows sturdy box (not mailer)
- ✅ Pizza Boxes - Shows flip-top style box
- ✅ Custom Branded Tape - Shows tape with printing
- ✅ Thermocol JAR - Shows cylindrical jar holders
- ✅ EPE Foam JAR - Shows foam jar sleeves

---

## 🐛 **Troubleshooting:**

### **Image Not Showing?**

**Check 1: File exists**
```bash
# List files in images folder
ls "public/images/"
# or
dir "public\images\"
```

**Check 2: Correct filename**
- Must be exact: `universal_box_brown_5ply.jpg` (not `universal_box_brown_5ply.jpeg`)
- Case sensitive on some systems

**Check 3: Clear browser cache**
- Hard refresh: `Ctrl + Shift + R` (Windows)
- Or open in incognito/private window

**Check 4: Check database**
```bash
# Open Prisma Studio
npx prisma studio
# Then check Product table, imageUrl column
```

---

## 📋 **Quick Verification Checklist:**

After updating, check these:

- [ ] All 5 new images are in `public/images/` folder
- [ ] Database has been updated (via script, admin, or SQL)
- [ ] Dev server restarted
- [ ] Products page loads without errors
- [ ] Each product shows correct image
- [ ] Images load on mobile view
- [ ] No 404 errors in browser console (F12)

---

## 🎉 **Success Indicators:**

You'll know it worked when:
- ✅ Brown 5-Ply shows heavy-duty box (not mailer)
- ✅ Pizza Box shows flip-top style
- ✅ Branded Tape shows printed text
- ✅ Thermocol JAR shows molded holders
- ✅ EPE Foam JAR shows tubular sleeves
- ✅ No broken image icons
- ✅ All images load smoothly

---

## 💡 **Pro Tips:**

1. **Use Option 1** (automated script) - fastest and safest
2. **If script fails**, use Option 2 (admin panel) - visual and easy
3. **Always restart server** after database changes
4. **Test in incognito** to avoid cache issues
5. **Check browser console** (F12) for errors

---

## 🚀 **Ready to Update?**

**Recommended Command:**
```bash
node scripts/update-images.js
```

Then restart:
```bash
npm run dev
```

**That's it! Your product images will be fixed!** 🎨✨
