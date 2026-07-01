# CROSHARA Make.com / n8n Automation Flows

## Setup Instructions
1. Go to make.com (free tier: 1,000 operations/month) OR
2. Self-host n8n on Railway/Render (free tier) for unlimited operations

## Flow 1: AI Content Generator

### Trigger: Schedule (Daily at 6:00 AM)
### Actions:
1. **HTTP Request** → Call Gemini API (free)
   - Prompt: "Create Instagram Reel script for CROSHARA baby shoes"
   - Save response to variable

2. **Google Sheets** → Append content to content calendar
   - Date, Post type, Script, Caption, Hashtags, Status

3. **Email** → Send content preview to yourself
   - Subject: "Today's CROSHARA Content Ready"
   - Body: Generated content

### Flow 1 Setup (n8n):
```
1. Schedule Trigger (6:00 AM daily)
2. HTTP Request node → POST https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent
3. Function node → Format response
4. Google Sheets node → Add row to content tracker
5. Email node → Send notification
```

---

## Flow 2: Instagram Auto-Engagement

### Trigger: Schedule (Daily at 4:00 PM)
### Actions:
1. **Instagram Business API** → Get list of competitor posts
2. **Instagram Business API** → Like 30 posts
3. **Instagram Business API** → Comment on 15 posts (use saved template comments)
4. **Google Sheets** → Log engagement activity

---

## Flow 3: WhatsApp Order Processing

### Trigger: New WhatsApp message containing "order"
### Actions:
1. **Parse message** → Extract product, quantity, address
2. **Google Sheets** → Add order to orders log
3. **Email** → Notify you of new order
4. **WhatsApp** → Send order confirmation to customer

---

## Flow 4: Daily Analytics Report

### Trigger: Schedule (Daily at 9:00 PM)
### Actions:
1. **Instagram Business API** → Get today's metrics
2. **Pinterest API** → Get today's metrics
3. **WhatsApp API** → Get metrics (if available)
4. **Google Sheets** → Append daily metrics
5. **Email** → Send daily summary report

---

## Flow 5: Lead Magnet Auto-Delivery

### Trigger: New subscriber (form submission or WhatsApp message)
### Actions:
1. **Parse contact info** → Name, email, baby age
2. **Email** → Send Baby Foot Care Guide PDF
3. **WhatsApp** → Send welcome message with catalog
4. **Google Sheets** → Add to subscriber list
5. **MailerLite** → Add to email sequence (via API)

---

## Pro Tips
- Start with Flow 1 (content generation) - highest ROI
- Use n8n if you need unlimited operations (free self-hosted)
- Use Make.com if you want quick setup with templates
- Test each flow individually before activating
- Store API keys securely (environment variables)
