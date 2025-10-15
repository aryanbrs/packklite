# 🔐 Admin Testing Guide - Packlite E-commerce Platform

## 📋 Table of Contents
1. [Admin Login](#1-admin-login)
2. [Admin Dashboard Overview](#2-admin-dashboard-overview)
3. [Product Management](#3-product-management)
4. [Order Management](#4-order-management)
5. [Quote Request Management](#5-quote-request-management)
6. [Admin Credentials](#admin-credentials)

---

## Admin Credentials

**Important:** You need to create an admin account in the database first.

### Option 1: Create Admin via Script
Run this command to create an admin account:

```bash
npm run dev
```

Then visit in your browser (or use a tool like Postman):
```
http://localhost:3000/api/admin/create-admin
```

This will create an admin with:
- **Email:** admin@packlite.com
- **Password:** Admin123!
- **Name:** Admin User

### Option 2: Manual Database Entry
Or you can manually insert an admin in your database with a hashed password using bcrypt.

---

## 1. Admin Login

### Steps to Test:
1. **Navigate to Admin Login Page:**
   ```
   http://localhost:3000/admin/login
   ```

2. **Verify Login Page Elements:**
   - ✅ "Admin Login" heading visible
   - ✅ Email input field
   - ✅ Password input field
   - ✅ "Sign in" button
   - ✅ NOT visible in navbar (URL-only access)

3. **Test Invalid Login:**
   - Enter wrong email: `wrong@test.com`
   - Enter wrong password: `wrongpass`
   - Click "Sign in"
   - **Expected:** Red error message "Invalid credentials"

4. **Test Valid Login:**
   - Enter: `admin@packlite.com`
   - Enter: `Admin123!`
   - Click "Sign in"
   - **Expected:** Redirect to `/admin/dashboard`

5. **Test Session Persistence:**
   - After login, try accessing `/admin/login` again
   - **Expected:** Should redirect to dashboard (already logged in)

---

## 2. Admin Dashboard Overview

### Steps to Test:
1. **After Login, Verify Dashboard Elements:**
   - ✅ "Admin Dashboard" header
   - ✅ Welcome message with admin name
   - ✅ Logout button (top right)
   - ✅ Quote statistics cards (if quotes exist)
   - ✅ Navigation tabs/links:
     - Products
     - Orders
     - Quotes
   - ✅ Search bar for products
   - ✅ Category filter dropdown
   - ✅ "Add New Product" button

2. **Test Quote Statistics (if available):**
   - **Total Quotes:** Shows count of all quote requests
   - **Pending:** Shows count of pending quotes
   - **Quoted:** Shows count of quotes that have been responded to
   - **Converted:** Shows count of quotes converted to orders

3. **Test Logout:**
   - Click "Logout" button
   - **Expected:** Redirect to `/admin/login`
   - **Expected:** Session cleared (can't access dashboard anymore)

---

## 3. Product Management

### Test 3.1: View Products
1. **From Dashboard, view products list:**
   - ✅ All products displayed in cards/table
   - ✅ Each product shows:
     - Product code
     - Name
     - Description
     - Category
     - Image
     - Variants (sizes & prices)
     - Edit button
     - Delete button

2. **Test Category Filter:**
   - Select "Corrugated Boxes" from dropdown
   - **Expected:** Only corrugated boxes shown
   - Select "All"
   - **Expected:** All products shown

3. **Test Search:**
   - Type "box" in search bar
   - **Expected:** Only products with "box" in name/code shown
   - Clear search
   - **Expected:** All products shown again

### Test 3.2: Add New Product
1. **Click "Add New Product" button**
2. **Verify Add Product Form:**
   - ✅ Product Code field
   - ✅ Product Name field
   - ✅ Description textarea
   - ✅ Category dropdown
   - ✅ Image URL field
   - ✅ Custom Inquiry checkbox
   - ✅ Variants section (SKU, Size, Price)
   - ✅ "Add Variant" button
   - ✅ "Save Product" button
   - ✅ "Cancel" button

3. **Test Adding a Product:**
   ```
   Product Code: TEST-001
   Name: Test Product
   Description: This is a test product
   Category: Corrugated Boxes
   Image URL: https://example.com/test.jpg
   Custom Inquiry: NO
   
   Variant 1:
   - SKU: TEST-001-SM
   - Size: Small
   - Base Price: 10
   
   Variant 2:
   - SKU: TEST-001-MD
   - Size: Medium
   - Base Price: 15
   ```

4. **Click "Save Product"**
   - **Expected:** Success message
   - **Expected:** Redirect to dashboard
   - **Expected:** New product appears in list

5. **Verify New Product:**
   - Check that product is visible on frontend `/products` page
   - Check that product can be added to cart

### Test 3.3: Edit Product
1. **Click "Edit" button on any product**
2. **Verify Edit Form:**
   - ✅ All fields populated with current data
   - ✅ All variants shown
   - ✅ Can add new variants
   - ✅ Can remove variants

3. **Make Changes:**
   - Change product name
   - Update a price
   - Add a new variant
   - Click "Update Product"

4. **Verify Changes:**
   - **Expected:** Success message
   - **Expected:** Changes reflected in product list
   - **Expected:** Changes visible on frontend

### Test 3.4: Delete Product
1. **Click "Delete" button on test product**
2. **Verify Confirmation:**
   - **Expected:** Confirmation dialog appears
   - **Expected:** "Are you sure?" message

3. **Confirm Delete:**
   - Click "Yes" or "Confirm"
   - **Expected:** Product removed from list
   - **Expected:** Product no longer visible on frontend

---

## 4. Order Management

### Test 4.1: View Orders
1. **Navigate to Orders section:**
   ```
   http://localhost:3000/admin/orders
   ```

2. **Verify Orders List:**
   - ✅ All orders displayed
   - ✅ Each order shows:
     - Order Number
     - Customer Name/Email
     - Total Amount
     - Status
     - Created Date
     - View Details button

3. **Test Status Filter:**
   - Filter by "pending"
   - **Expected:** Only pending orders shown
   - Filter by "completed"
   - **Expected:** Only completed orders shown

### Test 4.2: View Order Details
1. **Click "View Details" on any order**
2. **Verify Order Details Page:**
   - ✅ Order number
   - ✅ Customer information:
     - Name
     - Email
     - Phone
     - Company (if provided)
   - ✅ Shipping address
   - ✅ Order items:
     - Product name
     - Variant/size
     - Quantity
     - Unit price
     - Subtotal
   - ✅ Pricing breakdown:
     - Subtotal
     - Bulk discount (if applied)
     - Total
   - ✅ Order status
   - ✅ Created/Updated timestamps
   - ✅ "Update Status" dropdown
   - ✅ "Save" button

### Test 4.3: Update Order Status
1. **From order details, change status:**
   - Select "processing" from dropdown
   - Click "Save"
   - **Expected:** Status updated
   - **Expected:** Email sent to customer (check console logs)

2. **Try other statuses:**
   - `pending` → `processing`
   - `processing` → `shipped`
   - `shipped` → `delivered`

3. **Verify Email Notifications:**
   - Check console logs for email sending
   - Check customer receives status update email

---

## 5. Quote Request Management

### Test 5.1: View Quote Requests
1. **Navigate to Quotes section:**
   ```
   http://localhost:3000/admin/quotes
   ```

2. **Verify Quotes List:**
   - ✅ All quote requests displayed
   - ✅ Each quote shows:
     - Request ID
     - Customer Name
     - Company Name
     - Email
     - Phone
     - Status
     - Created Date
     - View Details button

3. **Test Status Filter:**
   - Filter by "pending"
   - **Expected:** Only pending quotes shown
   - Filter by "quoted"
   - **Expected:** Only quoted requests shown

### Test 5.2: View Quote Details
1. **Click "View Details" on any quote**
2. **Verify Quote Details Page:**
   - ✅ Quote ID
   - ✅ Customer information:
     - Full Name
     - Company Name
     - Phone Number
     - Email Address
   - ✅ Additional comments
   - ✅ Product items requested:
     - Product Type
     - Dimensions
     - Quantity
     - Notes
   - ✅ Status
   - ✅ Created date
   - ✅ "Update Status" dropdown
   - ✅ "Add Notes" textarea
   - ✅ "Save" button

### Test 5.3: Update Quote Status
1. **From quote details, change status:**
   - Select "quoted" from dropdown
   - Add admin notes: "Quote sent via email"
   - Click "Save"
   - **Expected:** Status updated
   - **Expected:** Admin notes saved

2. **Try status progression:**
   - `pending` → `quoted`
   - `quoted` → `converted` (if customer accepts)

3. **Verify Workflow:**
   - Pending quotes appear at top of list
   - Converted quotes show special indicator
   - Can add internal notes for tracking

---

## 🧪 Complete Admin Testing Checklist

### Authentication & Authorization
- [ ] Admin login with valid credentials works
- [ ] Admin login with invalid credentials fails
- [ ] Admin session persists across page refreshes
- [ ] Admin can logout successfully
- [ ] Non-authenticated users redirected to login
- [ ] Admin routes not accessible without login
- [ ] Admin login NOT visible in public navbar

### Dashboard
- [ ] Dashboard loads after login
- [ ] Welcome message shows admin name
- [ ] Quote statistics display correctly
- [ ] Navigation links work
- [ ] Logout button works

### Product Management
- [ ] View all products
- [ ] Filter products by category
- [ ] Search products by name/code
- [ ] Add new product with variants
- [ ] Edit existing product
- [ ] Delete product
- [ ] Changes reflect on frontend

### Order Management
- [ ] View all orders
- [ ] Filter orders by status
- [ ] View order details
- [ ] Update order status
- [ ] Email notifications sent on status change
- [ ] Customer information displays correctly
- [ ] Order totals calculate correctly

### Quote Request Management
- [ ] View all quote requests
- [ ] Filter quotes by status
- [ ] View quote details
- [ ] Update quote status
- [ ] Add admin notes
- [ ] Customer info displays correctly
- [ ] Product items display correctly

---

## 🐛 Common Issues & Troubleshooting

### Issue 1: Can't Login
**Symptom:** "Invalid credentials" error
**Solution:**
1. Verify admin account exists in database
2. Check password is correct (hashed)
3. Run admin creation script
4. Check console for errors

### Issue 2: Orders Not Showing
**Symptom:** Empty orders page
**Solution:**
1. Place a test order from frontend
2. Check database for orders table
3. Verify Prisma schema is up to date
4. Run `npx prisma db push`

### Issue 3: Quote Requests Not Showing
**Symptom:** Empty quotes page
**Solution:**
1. Submit a test quote from `/get-quote` page
2. Check database for quoteRequest table
3. Verify API route is working

### Issue 4: Can't Add Products
**Symptom:** Error when adding product
**Solution:**
1. Check all required fields filled
2. Verify at least one variant added
3. Check console for validation errors
4. Verify database connection

---

## 🎯 Next Steps After Testing

1. **Test Email Notifications:**
   - Configure Resend API key
   - Test order confirmation emails
   - Test quote confirmation emails
   - Test admin notification emails

2. **Test Customer Flow:**
   - Complete end-to-end customer journey
   - Verify orders appear in admin panel
   - Test order status updates

3. **Performance Testing:**
   - Test with 50+ products
   - Test with 100+ orders
   - Check page load times
   - Test search/filter performance

4. **Security Testing:**
   - Verify admin routes are protected
   - Test JWT token expiration
   - Test session management
   - Verify customer data isolation

---

## 📊 Expected Results Summary

After completing all tests, you should have:
- ✅ Fully functional admin authentication
- ✅ Product CRUD operations working
- ✅ Order management system operational
- ✅ Quote request handling functional
- ✅ Email notifications configured
- ✅ Admin dashboard displaying accurate stats
- ✅ All data properly isolated and secure

---

## 🚀 Start Testing!

**Begin with this sequence:**
1. Create admin account
2. Login to admin panel
3. Add a test product
4. View product on frontend
5. Place a test order
6. View order in admin panel
7. Submit a quote request
8. View quote in admin panel
9. Update statuses
10. Verify emails

**Good luck testing! 🎉**
