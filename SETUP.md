# MAGICALDERO - Expense & Income Tracker

## Quick Start Guide

### Installation & Running

1. **Install Dependencies:**
   ```bash
   cd c:\Users\USER\Desktop\magcalderoo
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```

3. **Open in Browser:**
   Navigate to `http://localhost:3000`

### Features Implemented ✅

✅ **Logo Integration**
- MAGICALDERO logo displayed in header (cal.jpg)
- Contact information footer with Bill John Buenaflor's details (call.jpg)
- Professional red/yellow color scheme matching brand

✅ **Core Functionality**
- All 10 form fields (Date, Capital, Expenses, Loans, Rejects, Production, Gross Income)
- Automatic Net Income calculation
- Automatic Total Capital Remaining calculation
- Add/Delete records functionality

✅ **Analytics & Charts**
- 3 chart types: Line, Bar, Pie charts
- Daily/Monthly summary toggle
- Real-time expense breakdown visualization

✅ **Data Management**
- Detailed data table with all records
- CSV export functionality
- Real-time calculations

✅ **Design**
- Responsive mobile-friendly layout
- Professional Tailwind CSS styling
- Color-coded statistics cards
- Matching MAGICALDERO brand colors (Red/Yellow)

### Project Structure

```
magcalderoo/
├── public/
│   ├── cal.jpg          (Logo)
│   └── call.jpg         (Contact card)
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
│       └── ExpenseTracker.tsx
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

### Formulas Used

**Net Income:**
```
Gross Income - (Factory Expenses + Personal Expenses + Loans + Rejects)
```

**Total Capital Remaining:**
```
Capital - Net Income
```

### Technologies

- Next.js 14 (React Framework)
- TypeScript
- Tailwind CSS (Styling)
- Recharts (Charts)
- date-fns (Date utilities)
- Lucide React (Icons)

### Build for Production

```bash
npm run build
npm start
```

---

**Owner:** BILL JOHN BUENAFLOR  
**Contact:** Magicaldero888@gmail.com | 0922-892-2458 | 0920-931-8456  
**Location:** Purok 5 brgy. Tawan-Tawan Mlang, North Cotabato
