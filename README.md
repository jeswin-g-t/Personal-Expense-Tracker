# Personal Expense Tracker
An AI-powered, real-time personal finance dashboard — track spending, scan bills automatically, chat with your data, and stay on top of your budget.

->[personal-expense-tracker-qx9ta3h3w.vercel.app](https://personal-expense-tracker-qx9ta3h3w.vercel.app)

Personal Expense Tracker is a web-based financial monitoring system built to help individuals record, categorize, and analyze their daily expenses and income in real time. It combines a clean, responsive dashboard with an AI layer that reads uploaded bills and answers natural-language questions about your spending — turning raw transaction data into decisions you can actually act on.

## Features:
- 📊 **Interactive Dashboard** — total spent, transaction count, average expense, and active categories at a glance
- 🧾 **AI Bill Scanning** — drag and drop a bill image or PDF and have the details auto-extracted into an expense entry
- 💬 **AI Expense Chat** — ask natural-language questions about your spending ("What's my total spending this month?") and get instant answers
- 📈 **Deep Analytics** — category breakdowns, spending distribution, monthly trends, and daily spending patterns via interactive charts
- 📤 **PDF Export** — download analytics reports for personal record-keeping


## Tech Stack

| Layer | Technology |
| --- | --- |
| **Backend** | Python, Flask |
| **Database** | MongoDB (via PyMongo) |
| **Frontend** | Tailwind CSS, JavaScript |
| **Charts** | Chart.js |
| **AI / NLP** | Gemini AI (bill parsing & conversational chat) |
| **Deployment** | Vercel |

Installation
bash
# Clone the repository
git clone https://github.com/<your-username>/personal-expense-tracker.git
cd personal-expense-tracker

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate      # macOS/Linux
venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt
Environment Variables

Create a .env file in the root directory:
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_flask_secret_key
GEMINI_API_KEY=your_gemini_api_key

Run Locally
flask run
