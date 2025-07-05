# אשף Zip2Vercel - גרסה 2 (ייצור) | Zip2Vercel Wizard v2 (Production)

<div align="center">

![Zip2Vercel Logo](https://via.placeholder.com/200x100/667eea/ffffff?text=Zip2Vercel)

**העלאה מהירה לאינטרנט בקלות | Quick Website Deployment Made Easy**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## 🌟 תיאור | Description

### עברית

אשף Zip2Vercel הוא כלי מתקדם ומאובטח להעלאת אתרים לאינטרנט בקלות ובמהירות. הכלי מאפשר למשתמשים להעלות קובץ ZIP המכיל את האתר שלהם, ליצור repository ב-GitHub ולפרוס את האתר ב-Vercel - הכל בתהליך פשוט של 4 שלבים.

**תכונות עיקריות:**
- ממשק משתמש בעברית עם תמיכה מלאה ב-RTL
- אבטחה מתקדמת עם הגנות מפני התקפות
- אנימציות חלקות ומיקרו-אינטראקציות
- תמיכה בגרירה ושחרור לקבצים
- אפקט קונפטי בעמוד ההצלחה
- קישור ישיר ל-WhatsApp לתמיכה
- התראות אוטומטיות ל-Slack

### English

Zip2Vercel Wizard is an advanced and secure tool for easy and fast website deployment. The tool allows users to upload a ZIP file containing their website, create a GitHub repository, and deploy the site on Vercel - all through a simple 4-step process.

**Key Features:**
- Hebrew UI with full RTL support
- Advanced security with attack protections
- Smooth animations and micro-interactions
- Drag and drop file support
- Confetti effect on success page
- Direct WhatsApp link for support
- Automatic Slack notifications

---

## 🚀 התחלה מהירה | Quick Start

### דרישות מוקדמות | Prerequisites

- Node.js 18+ 
- pnpm 8+
- חשבון GitHub עם הרשאות OAuth
- חשבון Vercel עם API token
- (אופציונלי) Slack webhook לקבלת התראות

### התקנה | Installation

```bash
# שכפול הפרויקט | Clone the project
git clone https://github.com/your-username/zip2vercel-wizard-v2-production.git
cd zip2vercel-wizard-v2-production

# התקנת תלויות | Install dependencies
pnpm install

# העתקת קובץ הגדרות הסביבה | Copy environment file
cp .env.example .env

# עריכת משתני הסביבה | Edit environment variables
nano .env
```

### הגדרת משתני סביבה | Environment Configuration

ערוך את קובץ `.env` והוסף את הערכים הנדרשים:

```env
# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Vercel API Configuration  
VERCEL_TOKEN=your_vercel_token_here
VERCEL_PROJECT_ID=your_vercel_project_id_here
VERCEL_ORG_ID=your_vercel_org_id_here

# Slack Webhook (Optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK

# Security Configuration
JWT_SECRET=your_super_secret_jwt_key_here
CSRF_SECRET=your_csrf_secret_key_here

# WhatsApp Contact
WHATSAPP_NUMBER=972523456789
```

### הרצה מקומית | Local Development

```bash
# הרצת שרת הפיתוח | Start development server
pnpm dev

# בניית הפרויקט | Build project
pnpm build

# הרצת בדיקות | Run tests
pnpm test

# בדיקת קוד | Lint code
pnpm lint
```

האתר יהיה זמין בכתובת: `http://localhost:3000`

---

## 🏗️ ארכיטקטורה | Architecture

### מבנה הפרויקט | Project Structure

```
zip2vercel-wizard-v2-production/
├── 📁 src/                     # קוד הלקוח | Client code
│   ├── 📁 components/          # רכיבי React | React components
│   │   ├── 📁 ui/             # רכיבי UI בסיסיים | Basic UI components
│   │   └── 📁 steps/          # שלבי האשף | Wizard steps
│   ├── 📁 lib/                # כלי עזר | Utilities
│   ├── 📁 hooks/              # React hooks מותאמים | Custom hooks
│   └── 📁 types/              # הגדרות TypeScript | Type definitions
├── 📁 api/                    # API endpoints
│   └── 📁 utils/              # כלי עזר לשרת | Server utilities
├── 📁 samples/                # קבצי דוגמה | Sample files
├── 📁 tests/                  # בדיקות | Tests
├── 📁 public/                 # קבצים סטטיים | Static files
├── 📄 package.json            # תלויות הפרויקט | Project dependencies
├── 📄 vite.config.ts          # הגדרות Vite | Vite configuration
├── 📄 tailwind.config.ts      # הגדרות Tailwind | Tailwind configuration
└── 📄 README.md               # תיעוד זה | This documentation
```

### טכנולוגיות | Technologies

**Frontend:**
- React 19 עם TypeScript
- Tailwind CSS 4 עם תמיכה ב-RTL
- Framer Motion לאנימציות
- Radix UI לרכיבי UI
- React Router לניווט
- Sonner לתצוגת הודעות

**Backend:**
- Node.js עם TypeScript
- Express.js לשרת API
- Helmet לאבטחה
- Multer להעלאת קבצים
- JSZip לעיבוד קבצי ZIP

**אבטחה | Security:**
- Rate limiting מתקדם
- CSRF protection
- Helmet security headers
- קבצי ZIP validation
- הגנה מפני zip bombs

**פריסה | Deployment:**
- Vercel לפריסת frontend
- GitHub OAuth לאימות
- Vercel API לפריסה אוטומטית

---

## 🔧 הגדרת GitHub OAuth | GitHub OAuth Setup

### יצירת GitHub App | Creating GitHub App

1. עבור ל-GitHub Settings > Developer settings > OAuth Apps
2. לחץ על "New OAuth App"
3. מלא את הפרטים:
   - **Application name:** Zip2Vercel Wizard
   - **Homepage URL:** `https://your-domain.com`
   - **Authorization callback URL:** `https://your-domain.com/api/github-callback`
4. העתק את `Client ID` ו-`Client Secret` לקובץ `.env`

### הרשאות נדרשות | Required Permissions

האפליקציה דורשת את ההרשאות הבאות:
- `repo` - יצירה ועריכה של repositories
- `user:email` - קריאת כתובת האימייל של המשתמש

---

## 🌐 הגדרת Vercel API | Vercel API Setup

### יצירת API Token | Creating API Token

1. עבור ל-Vercel Dashboard > Settings > Tokens
2. לחץ על "Create Token"
3. בחר scope מתאים (Vercel for GitHub)
4. העתק את הטוקן לקובץ `.env`

### קבלת Organization ID | Getting Organization ID

```bash
# באמצעות Vercel CLI | Using Vercel CLI
vercel teams list

# או דרך API | Or via API
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.vercel.com/v2/teams
```

---

## 🔒 אבטחה | Security

### תכונות אבטחה | Security Features

**Rate Limiting:**
- 100 בקשות לכל 10 דקות (גלובלי)
- 10 בקשות לדקה ל-API endpoints
- הגנה מפני DDoS ו-brute force

**הגנת קבצים | File Protection:**
- בדיקת MIME type
- הגבלת גודל קובץ (20MB)
- סריקת zip bombs
- ולידציה של נתיבי קבצים

**אבטחת תקשורת | Communication Security:**
- HTTPS בלבד בייצור
- CSRF tokens
- Secure cookies
- CORS מוגדר

**Headers אבטחה | Security Headers:**
```
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### בדיקות אבטחה | Security Testing

```bash
# בדיקת vulnerabilities | Check vulnerabilities
pnpm audit

# בדיקה עם Snyk | Check with Snyk
npx snyk test

# בדיקת headers | Check headers
curl -I https://your-domain.com
```

---

## 🧪 בדיקות | Testing

### הרצת בדיקות | Running Tests

```bash
# בדיקות יחידה | Unit tests
pnpm test

# בדיקות אינטגרציה עם Playwright | Integration tests with Playwright
pnpm test:e2e

# בדיקות עם UI | Tests with UI
pnpm test:ui

# כיסוי בדיקות | Test coverage
pnpm test:coverage
```

### תרחישי בדיקה | Test Scenarios

**Happy Path:**
1. העלאת קובץ ZIP תקין
2. אימות GitHub מוצלח
3. פריסה ב-Vercel מוצלחת
4. הצגת עמוד הצלחה

**Error Handling:**
1. קובץ ZIP לא תקין
2. כשל באימות GitHub
3. שגיאה בפריסת Vercel
4. בדיקת rate limiting

---

## 📱 תמיכה ב-RTL | RTL Support

### הגדרות RTL | RTL Configuration

הפרויקט כולל תמיכה מלאה בעברית ו-RTL:

```css
/* הגדרות בסיסיות | Basic settings */
html {
  direction: rtl;
  lang: he;
}

/* פונטים | Fonts */
body {
  font-family: 'Heebo', 'Inter', system-ui, sans-serif;
}

/* כיתות עזר | Helper classes */
.hebrew-text {
  font-family: 'Heebo', system-ui, sans-serif;
  direction: rtl;
  text-align: right;
}

.english-text {
  font-family: 'Inter', system-ui, sans-serif;
  direction: ltr;
  text-align: left;
}
```

### Tailwind RTL Plugin

```javascript
// tailwind.config.ts
module.exports = {
  plugins: [
    require('tailwindcss-rtl'),
  ],
}
```

---

## 🎨 עיצוב ואנימציות | Design & Animations

### מערכת עיצוב | Design System

**צבעים | Colors:**
- Primary: Blue (#667eea)
- Secondary: Purple (#764ba2)
- Success: Green (#4CAF50)
- Warning: Amber (#F59E0B)
- Error: Red (#EF4444)

**טיפוגרפיה | Typography:**
- כותרות: Heebo Bold
- טקסט רגיל: Heebo Regular
- טקסט אנגלי: Inter

**אנימציות | Animations:**
```css
/* אנימציות מותאמות | Custom animations */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes success-bounce {
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0, 0, 0); }
  40%, 43% { transform: translate3d(0, -30px, 0); }
  70% { transform: translate3d(0, -15px, 0); }
  90% { transform: translate3d(0, -4px, 0); }
}
```

### Framer Motion

```typescript
// דוגמה לאנימציית מעבר | Example transition animation
const pageVariants = {
  initial: { opacity: 0, x: 50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -50 }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
}
```

---

## 🚀 פריסה | Deployment

### פריסה ב-Vercel | Vercel Deployment

```bash
# התקנת Vercel CLI | Install Vercel CLI
npm i -g vercel

# התחברות | Login
vercel login

# פריסה | Deploy
vercel --prod
```

### הגדרות Vercel | Vercel Configuration

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### משתני סביבה ב-Vercel | Environment Variables in Vercel

הוסף את משתני הסביבה הבאים ב-Vercel Dashboard:

```
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
VERCEL_TOKEN
VERCEL_ORG_ID
SLACK_WEBHOOK_URL
JWT_SECRET
CSRF_SECRET
WHATSAPP_NUMBER
```

---

## 📊 ניטור וביצועים | Monitoring & Performance

### מדדי ביצועים | Performance Metrics

**Core Web Vitals:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**אופטימיזציות | Optimizations:**
- Code splitting אוטומטי
- Lazy loading לרכיבים
- Image optimization
- Bundle size optimization

### לוגים ומעקב | Logging & Tracking

```typescript
// דוגמה ללוגים | Example logging
console.log('User action:', {
  action: 'file_upload',
  fileSize: file.size,
  fileName: file.name,
  timestamp: new Date().toISOString()
})
```

---

## 🤝 תרומה לפרויקט | Contributing

### הנחיות פיתוח | Development Guidelines

1. **Code Style:** השתמש ב-ESLint ו-Prettier
2. **Commits:** השתמש ב-Conventional Commits
3. **Testing:** כתוב בדיקות לכל feature חדש
4. **Documentation:** עדכן תיעוד לכל שינוי

### תהליך PR | PR Process

```bash
# יצירת branch חדש | Create new branch
git checkout -b feature/new-feature

# ביצוע שינויים | Make changes
git add .
git commit -m "feat: add new feature"

# דחיפה ויצירת PR | Push and create PR
git push origin feature/new-feature
```

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

---

## 🐛 פתרון בעיות | Troubleshooting

### בעיות נפוצות | Common Issues

**שגיאת GitHub OAuth:**
```
Error: Invalid state parameter
```
**פתרון:** בדוק שה-callback URL מוגדר נכון ב-GitHub App

**שגיאת Vercel API:**
```
Error: Unauthorized
```
**פתרון:** בדוק שה-Vercel token תקף ויש לו הרשאות מתאימות

**שגיאת העלאת קובץ:**
```
Error: File too large
```
**פתרון:** בדוק שגודל הקובץ קטן מ-20MB

### דיבוג | Debugging

```bash
# הפעלת מצב debug | Enable debug mode
DEBUG=* pnpm dev

# בדיקת לוגים | Check logs
tail -f logs/app.log

# בדיקת network | Check network
curl -v https://your-domain.com/api/health
```

---

## 📞 תמיכה | Support

### דרכי יצירת קשר | Contact Methods

- **WhatsApp:** [+972-52-345-6789](https://wa.me/972523456789)
- **Email:** support@zip2vercel.com
- **GitHub Issues:** [פתח issue חדש](https://github.com/your-username/zip2vercel-wizard-v2-production/issues)

### שעות תמיכה | Support Hours

- ראשון-חמישי: 09:00-18:00 (GMT+2)
- שישי: 09:00-14:00 (GMT+2)
- שבת: סגור

---

## 📄 רישיון | License

פרויקט זה מופץ תחת רישיון MIT. ראה קובץ [LICENSE](LICENSE) לפרטים נוספים.

```
MIT License

Copyright (c) 2025 Zip2Vercel Wizard

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 תודות | Acknowledgments

- **React Team** - על הפריימוורק המדהים
- **Vercel** - על פלטפורמת הפריסה המעולה
- **Tailwind CSS** - על מערכת העיצוב הגמישה
- **Framer Motion** - על ספריית האנימציות
- **הקהילה הישראלית** - על המשוב והתמיכה

---

<div align="center">

**נוצר עם ❤️ על ידי צוות Zip2Vercel**

[🌐 אתר רשמי](https://zip2vercel.com) | [📧 צור קשר](mailto:contact@zip2vercel.com) | [💬 WhatsApp](https://wa.me/972523456789)

</div>

