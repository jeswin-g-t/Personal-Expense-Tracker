# Publish the Expense Tracker on Vercel

The app is a Vite website with Vercel serverless API routes for Gemini chat and bill scanning.

## Deploy with Vercel

1. Open [vercel.com](https://vercel.com) and sign in with GitHub.
2. Choose **Add New > Project** and import `jeswin-g-t/Personal-Expense-Tracker`.
3. Keep the framework as **Vite** and the build command as `npm run build`.
4. Add `GEMINI_API_KEY` in **Environment Variables** for Production, Preview, and Development.
5. Optionally add `GEMINI_MODEL=gemini-3.6-flash`.
6. Click **Deploy**. Vercel will provide a public `https://...vercel.app` URL.

The URL is not created by GitHub alone. It is created when the repository is imported and deployed in Vercel.

The `vercel.json` file routes `/api/chat` and `/api/scan-bill` to serverless functions. No separate backend server is needed.

## Important

- Keep `server/.env` local and private. It is ignored by git.
- Use `server/.env.example` only as a template.
- Configure `GEMINI_API_KEY` only in Vercel project settings for a deployed app.
- Rotate any Gemini key that was exposed in a repository, screenshot, chat, or log.
- The expense list is currently stored in each user's browser local storage. It is not shared between users or devices.