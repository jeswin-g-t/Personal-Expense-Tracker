# Personal Expense Tracker

A React and Express expense tracker with dashboards, analytics, local expense storage, AI budgeting help, and bill-image scanning.

> The live website link will work after the Render service is deployed. Follow the [deployment steps](DEPLOYMENT.md) to create it.

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

The included `render.yaml` deploys the built website and API as one Render web service. See [DEPLOYMENT.md](DEPLOYMENT.md) for the publishing steps.

After deployment, replace the deployment notice above with:

```html
<p><a href="https://YOUR-RENDER-SERVICE.onrender.com"><strong>Try it live</strong></a></p>
```

Expenses are stored in browser local storage, so each user has a separate local expense list.