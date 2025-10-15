# Email Notifications Setup Guide

## 📧 Phase 2: Email Notifications - COMPLETE!

All email functionality has been implemented. Now you just need to configure your email service.

---

## 🔧 Setup Instructions

### Step 1: Get Resend API Key

1. **Sign up for Resend** (Free tier available)
   - Go to: https://resend.com/signup
   - Sign up with your email
   - Verify your email address

2. **Create API Key**
   - Go to Dashboard → API Keys
   - Click "Create API Key"
   - Name it: "Packlite Production"
   - Copy the API key (starts with `re_`)

3. **Add Domain (Optional but Recommended)**
   - Go to Dashboard → Domains
   - Click "Add Domain"
   - Add your domain (e.g., `packlite.com`)
   - Follow DNS setup instructions
   - **Until verified**, use default: `onboarding@resend.dev`

---

### Step 2: Configure Environment Variables

Add these to your `.env` file:

```env
# Email Configuration (Resend)
RESEND_API_KEY="re_your_api_key_here"
FROM_EMAIL="orders@yourdomain.com"  # Or use "onboarding@resend.dev" temporarily
ADMIN_EMAIL="aryanenterprises721@gmail.com"

# Application URL (for email links)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"  # Change to your production URL when deployed
```

**Important Notes:**
- Replace `re_your_api_key_here` with your actual Resend API key
- If you haven't verified a domain yet, use `FROM_EMAIL="onboarding@resend.dev"`
- `ADMIN_EMAIL` is where you'll receive new quote notifications
- `NEXT_PUBLIC_BASE_URL` should be your production URL (e.g., `https://packlite.com`) when deployed

---

### Step 3: Restart Your Dev Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

That's it! Email notifications are now active. 🎉

---

## ✉️ What Emails Get Sent?

### 1. **Customer Quote Confirmation**
**When:** Customer submits a quote request  
**To:** Customer's email (if provided)  
**Contains:**
- Confirmation message
- Quote reference number
- Summary of requested items
- Company contact information
- Next steps information

### 2. **Admin New Quote Notification**
**When:** Customer submits a quote request  
**To:** Admin email (from `ADMIN_EMAIL` env variable)  
**Contains:**
- Alert about new quote
- Customer contact details (with clickable phone/email)
- All requested items in a table
- Direct link to view quote in admin panel
- Quick action buttons

### 3. **Admin Quote Response**
**When:** Admin sends quote response from detail page  
**To:** Customer's email  
**Contains:**
- Personalized message from admin
- Pricing details (if provided)
- Delivery information (if provided)
- Company contact information
- Next steps for customer

---

## 🎯 How to Use

### For Customers:
1. Customer fills out quote form at `/get-quote`
2. **Automatically receives confirmation email** with:
   - Quote reference number
   - Summary of their request
   - What happens next
3. Receives pricing email when admin responds

### For Admin:
1. **Receives instant notification** when new quote arrives
2. Email contains:
   - Customer details
   - Requested items
   - Quick action links (call, email, WhatsApp)
   - Link to admin panel
3. Can respond directly from admin panel:
   - Go to `/admin/quotes/[id]`
   - Click "Send Quote Response" button
   - Fill in message, pricing, and delivery info
   - Click send - customer receives professional email

---

## 📱 Email Features

### Beautiful HTML Templates
- ✅ Responsive design (mobile-friendly)
- ✅ Professional branding
- ✅ Color-coded sections
- ✅ Clear call-to-actions
- ✅ Company information in footer

### Smart Functionality
- ✅ Non-blocking (doesn't slow down quote submission)
- ✅ Graceful failure (quote still saves if email fails)
- ✅ Logging for debugging
- ✅ Conditional sections (only shows if data provided)

### Status Integration
- ✅ When admin sends quote response, status automatically updates to "quoted"
- ✅ Email only sent if customer provided email address
- ✅ Error handling with helpful messages

---

## 🧪 Testing

### Test Quote Submission:
1. Go to `http://localhost:3000/get-quote`
2. Fill out the form with YOUR email
3. Submit
4. Check your inbox for:
   - Customer confirmation email
5. Check admin email for:
   - New quote notification

### Test Admin Response:
1. Login to admin panel
2. Go to a quote with email
3. Click "Send Quote Response"
4. Fill in the form
5. Send
6. Check customer email inbox

### Troubleshooting:
- **No emails received?** 
  - Check `.env` has `RESEND_API_KEY` set
  - Check Resend dashboard for logs
  - Look at terminal for error messages
  
- **Emails go to spam?**
  - Use verified domain instead of `onboarding@resend.dev`
  - Add SPF/DKIM records (Resend provides these)
  
- **"Failed to send email" error?**
  - Verify API key is correct
  - Check Resend account isn't suspended
  - Ensure email addresses are valid

---

## 🚀 Production Checklist

Before going live:

- [ ] Get Resend API key
- [ ] Add and verify your domain in Resend
- [ ] Update `FROM_EMAIL` to use your domain
- [ ] Update `ADMIN_EMAIL` to correct admin email
- [ ] Update `NEXT_PUBLIC_BASE_URL` to production URL
- [ ] Test all three email types
- [ ] Check emails don't go to spam
- [ ] Verify "View in Admin Panel" link works

---

## 💰 Resend Pricing

**Free Tier:**
- 3,000 emails per month
- 100 emails per day
- Perfect for starting out!

**Paid Plans:**
- Start at $20/month for 50,000 emails
- Only needed if you get 100+ quotes per day

For a packaging business, free tier is usually enough to start!

---

## 🎨 Customizing Email Templates

Email templates are in: `src/lib/email.ts`

You can customize:
- **Colors:** Change hex colors in style attributes
- **Content:** Edit the HTML text
- **Branding:** Update company name, logo, colors
- **Sections:** Add/remove information blocks

Example - Change primary color:
```typescript
// Find this in email.ts:
style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)"

// Change to your brand colors:
style="background: linear-gradient(135deg, #your-color 0%, #your-color-2 100%)"
```

---

## 📊 Monitoring Emails

### Resend Dashboard:
- View all sent emails
- See delivery status
- Check open rates
- View bounce/spam reports
- Debug failed emails

### Application Logs:
- Terminal shows email send attempts
- Success/failure logged
- Helpful for debugging

---

## 🔐 Security Best Practices

✅ **Do's:**
- Keep `RESEND_API_KEY` in `.env` (never commit to git)
- Use verified domain for production
- Enable SPF/DKIM authentication
- Monitor Resend dashboard for abuse

❌ **Don'ts:**
- Don't share API key
- Don't hardcode API key in code
- Don't use `onboarding@resend.dev` in production

---

## 🆘 Support

### Resend Support:
- Docs: https://resend.com/docs
- Discord: Join Resend Discord community
- Email: support@resend.com

### Common Issues:

**Issue:** "Customer didn't receive email"
**Solution:** 
- Verify customer entered email correctly
- Check Resend logs in dashboard
- Check spam folder
- Ensure API key is valid

**Issue:** "Admin notification not received"
**Solution:**
- Check `ADMIN_EMAIL` in `.env` is correct
- Verify email isn't being filtered/blocked
- Check Resend dashboard logs

**Issue:** "Email links don't work"
**Solution:**
- Update `NEXT_PUBLIC_BASE_URL` in `.env`
- Should be full URL (e.g., `https://yourdomain.com`)

---

## ✅ Phase 2 Complete!

You now have:
- ✅ Automatic customer confirmations
- ✅ Instant admin notifications
- ✅ Professional quote responses
- ✅ Beautiful email templates
- ✅ Error handling
- ✅ Non-blocking operation

**Ready for Phase 3?** Choose next:
- **Option B:** Order Management System
- **Option C:** Payment Integration (Razorpay)
- **Option D:** Customer Dashboard

Let me know which phase to implement next! 🚀
