# CROSHARA Google Sheets Dashboard

Create 3 sheets in one Google Sheets workbook:

## Sheet 1: Content Calendar

| Date | Day | Platform | Format | Topic | Caption | Hashtags | Status | Engagement | Notes |
|------|-----|----------|--------|-------|---------|----------|--------|------------|-------|
|      | Mon | Instagram | Reel | Brand intro | [paste] | [#tags] | Posted | 500 reach |       |
|      | Tue | Pinterest | Pin x5 | Product | [paste] | [#tags] | Scheduled | - |       |
|      | Wed | Instagram | Carousel | Tips | [paste] | [#tags] | Draft | - |       |

## Sheet 2: Sales Tracker

| Date | Order # | Product | Qty | Amount | Customer | Channel | Payment | Status | Delivery |
|------|---------|---------|-----|--------|----------|---------|---------|--------|----------|
|      | CR001 | Booties | 1 | ₹599 | Name | WhatsApp | Paid | Shipped | 10-Jul |
|      | CR002 | Gift Set | 1 | ₹1,299 | Name | Instamojo | Paid | Processing | - |

### Summary Row (auto-calculated)
Total Orders: [=COUNTA(B:B)-1]
Total Revenue: [=SUM(E:E)]
Avg Order Value: [=AVERAGE(E:E)]

## Sheet 3: Analytics Dashboard

| Date | Instagram | | | Pinterest | | | WhatsApp | |
|------|-----------|-|-|-----------|-|-|----------|-|
|      | Followers | Reach | Engagement | Impressions | Saves | Clicks | Messages | Orders |
| 1-Jul | 50 | 500 | 5% | 200 | 15 | 5 | 20 | 1 |
| 2-Jul | 55 | 600 | 4.5% | 250 | 20 | 8 | 25 | 2 |

### Weekly Summary (auto-calculated)
Week 1: Followers +50 (+100%), Total Reach 3,500, Orders 5, Revenue ₹3,500
Week 2: [formula]

## How to Set Up
1. Go to sheets.google.com
2. Create new blank spreadsheet
3. Rename to "CROSHARA Business Dashboard"
4. Create 3 tabs at bottom (rename to Content Calendar, Sales Tracker, Analytics)
5. Paste headers as shown above
6. Add formulas for auto-calculation

### Useful Formulas
- Total revenue: `=SUM(E:E)`
- Followers growth: `=(B2-B1)/B1*100`
- Engagement rate: `=(D2/C2)*100`
- Conversion rate: `=(orders/visitors)*100`
- Running 7-day average: `=AVERAGE(OFFSET(B2,0,0,7))`
