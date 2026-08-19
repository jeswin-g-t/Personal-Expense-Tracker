# Publish the Expense Tracker

The app is deployed as one Node web service. Express serves the built Vite website and the Gemini chat and bill scanning API from the same public URL.

## Deploy with Render

1. Put this `project` folder in a GitHub repository.
2. Open [render.com](https://render.com), sign in, and choose **New > Blueprint**.
3. Select the repository and the `project/render.yaml` file.
4. When Render asks for `GEMINI_API_KEY`, enter it as a secret. Do not commit it to the repository.
5. Deploy the service. Render will provide a public `https://...onrender.com` website URL to share.

The URL is not created by GitHub alone. Until the Blueprint is deployed in Render, an `onrender.com` URL will return `404 Not Found`.

The frontend uses its own public origin for API requests, so chat and bill scanning work from the same public site without a second URL.

## Important

- Keep `server/.env` local and private. It is ignored by git.
- Use `server/.env.example` only as a template.
- Rotate any Gemini key that was exposed in a repository, screenshot, chat, or log.
- The expense list is currently stored in each user's browser local storage. It is not shared between users or devices.