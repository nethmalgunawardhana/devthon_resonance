# 🎯 Resonance Backend: Node.js for Stripe & Firestore

This is the Node.js backend application for the Resonance project, designed to handle Stripe payment transactions and store related data in Firebase Firestore. It includes a secure Stripe webhook endpoint to automatically capture and log payment events.

## 🚀 Features

-   ✅  Record Stripe payment transactions manually or via webhook
-   🔒  Secure Stripe webhook verification
-   🗃️  Store transactions in Firestore under `research/{projectDocId}/stripeTransactions`
-   📦  Built using plain Node.js
-   🔧  Environment variable support via `.env`
-   💽  LLM API (Gemini) for AI-powered research summarization and insights
-   🔍  Google Scholar for real-time research paper indexing
-    💰 Stripe integration for payments, donations, grant distribution

## 🛠️ Requirements

-   Node.js (v14 or above)
-   npm or yarn
-   Firebase Admin SDK service account key file (path to your JSON key)
-   Stripe account with webhook secret

## ⚙️ Setup Instructions

1.  **Clone the Repository**

    ```bash
    git clone [https://github.com/nethmalgunawardhana/resonance_backend.git](https://github.com/nethmalgunawardhana/resonance_backend.git)
    cd resonance_backend
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables**

    Create a `.env` file in the root of the backend directory and add the following (replace with your actual values):

    ```
    STRIPE_SECRET_KEY=sk_live_your_live_secret_key
    STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
    FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/your/serviceAccountKey.json
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    # Add other necessary environment variables
    ```

    **Important:** Do not commit your `.env` file to version control. Add it to your `.gitignore` file.

4.  **Run the Backend**

    ```bash
    npm run start #  Or the script defined for starting the backend in your package.json
    # or
    node index.js
    ```

    Refer to your `package.json` file for available scripts.  You might need to set up a start script.

## ⚙️ Configuration

-   **Stripe:** Ensure your Stripe webhook endpoint is configured to send relevant events to your backend's webhook URL.
-   **Firebase:** Make sure your Firebase Admin SDK is initialized correctly using the provided service account key.
-   **Gemini:** If using the LLM features, ensure your Gemini API key is correctly set in the `.env` file.

## ---------- TECH STACK (Backend) ----------

* Backend: Node.js
* Database: Firebase Firestore
* Payments: Stripe
* AI/ML Integration: LLM API (Gemini)
* Research Indexing: Google Scholar Integration

## ---------- DEPLOYMENT ----------
* Deployment & Scaling: Vercel (verify and update as needed)

## ---------- TEAM MEMBERS ----------

* Tharin Edirisinghe
* Garuka Satharasinghe
* Nethmal Gunawardhana
* Harindu Hadithya
* Sachintha Lakmin
