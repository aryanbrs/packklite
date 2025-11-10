-- SQL Script to Update Product Images
-- Run this in your database client or via Prisma Studio

-- 1. Brown 5-Ply Universal Boxes (Fix wrong image)
UPDATE "Product" 
SET "imageUrl" = '/images/universal_box_brown_5ply.jpg'
WHERE name LIKE '%Brown 5-Ply Universal%' 
   OR name LIKE '%5-Ply Universal%'
   OR "productCode" LIKE '%5P%';

-- 2. Pizza Box Style (Fix wrong image)
UPDATE "Product" 
SET "imageUrl" = '/images/pizza_box_style.jpg'
WHERE name LIKE '%Pizza Box%' 
   OR category = 'Pizza Boxes';

-- 3. Custom Branded Tape (New image)
UPDATE "Product" 
SET "imageUrl" = '/images/custom_branded_tape.jpg'
WHERE name LIKE '%Custom%Printed%Tape%' 
   OR name LIKE '%Branded Tape%'
   OR name LIKE '%Custom Tape%';

-- 4. Thermocol JAR Packaging (New image)
UPDATE "Product" 
SET "imageUrl" = '/images/thermocol_jar_packaging.jpg'
WHERE name LIKE '%Thermocol JAR%' 
   OR (name LIKE '%Thermocol%' AND name LIKE '%JAR%');

-- 5. EPE Foam JAR Packaging (New image)
UPDATE "Product" 
SET "imageUrl" = '/images/epe_foam_jar_packaging.jpg'
WHERE name LIKE '%EPE Foam JAR%' 
   OR (name LIKE '%EPE%' AND name LIKE '%JAR%');

-- Verify updates
SELECT name, "imageUrl" FROM "Product" 
WHERE "imageUrl" IN (
  '/images/universal_box_brown_5ply.jpg',
  '/images/pizza_box_style.jpg',
  '/images/custom_branded_tape.jpg',
  '/images/thermocol_jar_packaging.jpg',
  '/images/epe_foam_jar_packaging.jpg'
)
ORDER BY name;
