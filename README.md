# Personal Expense Tracker

A React and Express expense tracker with dashboards, analytics, local expense storage, AI budgeting help, and bill-image scanning.

->[personal-expense-tracker-qx9ta3h3w.vercel.app](https://personal-expense-tracker-qx9ta3h3w.vercel.app)

## Features

- Add, edit, delete, search, filter, sort, and export expenses.
- View monthly totals, category breakdowns, and spending trends.
- Ask Gemini for budgeting and expense-reduction advice.
- Upload a JPG, PNG, or WebP bill image to extract, categorize, review, and save line items.

## Run Locally

```bash
npm install
npm --prefix server install
npm run dev
npm --prefix server start
```

Copy `server/.env.example` to `server/.env` and add your `GEMINI_API_KEY` before using AI features. The frontend runs at `http://localhost:5173` and the API runs at `http://localhost:3001`.

## Deploy

Vercel deploys the Vite website and serverless Gemini API together. After deployment, replace the deployment notice above with:

```html
<p><a href="https://YOUR-PROJECT.vercel.app"><strong>Try it live</strong></a></p>
```

Expenses are stored in browser local storage, so each user has a separate local expense list.
