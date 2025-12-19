# Admin Interface Setup & Usage Guide

## 🎉 What's Been Implemented

### 1. **Database Setup**
- ✅ Prisma schema with Product, Variant, and Admin models
- ✅ PostgreSQL database with Neon
- ✅ Database migration completed
- ✅ **32 products** seeded with **253 variants**

### 2. **Product Data**
All your products have been organized and seeded into the database:
- **Brown Mailer Boxes** (3-Ply & 5-Ply) - 158 variants
- **Corrugated Boxes** (3-Ply & 5-Ply) - 65 variants
- **Pizza Boxes** - 5 variants
- **Protective Packaging** (Bubble Wrap, Stretch Film) - 2 variants
- **Tapes & Adhesives** (BOPP Tapes, Specialty) - 10 variants
- **Thermocol & Foam** (JAR Packaging, Sheets, EPE Foam) - 28 variants

### 3. **Admin Authentication**
- ✅ JWT-based session management
- ✅ Bcrypt password hashing
- ✅ Secure admin login/logout
- ✅ Protected admin routes

### 4. **Admin Dashboard**
- ✅ Product listing with search & category filter
- ✅ Statistics dashboard (total products, variants, categories)
- ✅ Product management interface

### 5. **Product Management**
- ✅ Add new products with multiple variants
- ✅ Edit existing products
- ✅ Delete products
- ✅ Manage product variants (SKU, size, price)
- ✅ Custom inquiry products support

## 🔐 Admin Login Credentials

**Email:** `admin@packlite.com`  
**Password:** `admin123`

⚠️ **IMPORTANT:** Please change this password after your first login!

## 🚀 How to Access Admin Panel

1. **Login Page:**
   ```
   http://localhost:3000/admin/login
   ```

2. **After Login - Dashboard:**
   ```
   http://localhost:3000/admin/dashboard
   ```

## 📋 Admin Features

### Dashboard Overview
- View total products, variants, and categories
- Search products by name or code
- Filter by category
- Quick stats at a glance

### Managing Products

#### **Add New Product**
1. Click "Add Product" button in dashboard
2. Fill in product details:
   - Product Code (unique identifier)
   - Product Name
   - Description
   - Category
   - Image URL
   - Custom Inquiry checkbox (for quote-only products)
3. Add variants with SKU, size, and price
4. Click "Create Product"

#### **Edit Product**
1. Click the edit icon (pencil) next to any product
2. Modify product details or variants
3. Click "Update Product"

#### **Delete Product**
1. Click the delete icon (trash) next to any product
2. Confirm deletion
3. Product and all its variants will be removed

## 🗂️ File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx          # Admin login page
│   │   ├── dashboard/page.tsx       # Admin dashboard
│   │   └── products/
│   │       ├── new/page.tsx         # Add new product
│   │       └── [id]/page.tsx        # Edit product
│   ├── api/
│   │   └── admin/
│   │       ├── login/route.ts       # Login API
│   │       ├── logout/route.ts      # Logout API
│   │       └── products/
│   │           ├── route.ts         # List/Create products
│   │           └── [id]/route.ts    # Get/Update/Delete product
│   └── products/page.tsx            # Public products page (now DB-driven)
├── components/
│   ├── AdminDashboard.tsx           # Dashboard UI component
│   └── ProductForm.tsx              # Product add/edit form
└── lib/
    └── auth.ts                      # Authentication utilities

prisma/
├── schema.prisma                    # Database schema
├── seed.ts                          # Product seeding script
├── seed-admin.ts                    # Admin user seeding script
├── seed-data.json                   # Mailer boxes data
├── seed-data-corrugated.json        # Corrugated boxes data
└── seed-data-other.json             # Other products data
```

## 🔄 Database Commands

### Re-seed Products
If you need to reset products to initial data:
```bash
npx prisma db seed
```

### Create Admin User
If you need to create a new admin:
```bash
npx ts-node --project tsconfig.seed.json prisma/seed-admin.ts
```

### Reset Database
To completely reset the database:
```bash
npx prisma migrate reset
```

## 🎨 Admin UI Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Search & Filter** - Quickly find products
- **Inline Editing** - Direct access to edit forms
- **Variant Management** - Add/remove variants dynamically
- **Category Grouping** - Organized product views

## 🔒 Security Features

- JWT session tokens (7-day expiry)
- Bcrypt password hashing
- HTTP-only cookies
- Protected API routes
- Session validation on all admin pages

## 📝 Next Steps

1. **Change Admin Password**
   - Currently, you can do this by running the seed-admin script with a new password
   - Future: Add password change UI in admin dashboard

2. **Add Image Upload**
   - Current: Manual URL input
   - Future: File upload with storage service (AWS S3, Cloudinary, etc.)

3. **Bulk Operations**
   - Future: Import/export products via CSV
   - Bulk delete/edit capabilities

4. **Advanced Features**
   - Product categories management UI
   - Variant bulk pricing
   - Product analytics

## 🐛 Troubleshooting

### Can't Login?
- Verify admin user exists in database
- Check database connection in .env
- Ensure cookies are enabled in browser

### Products Not Showing?
- Run `npx prisma db seed` to seed products
- Check database connection
- Verify Prisma client is generated: `npx prisma generate`

### API Errors?
- Check terminal/console for error messages
- Verify all environment variables are set
- Ensure database is accessible

## 📞 Support

For issues or questions, check:
1. Console logs in browser DevTools
2. Terminal output for server errors
3. Database connection status

---

**Built with:** Next.js 14, Prisma, PostgreSQL (Neon), TailwindCSS, TypeScript
