Inventory FIFO Management System

An inventory management system with FIFO (First-In-First-Out) stock allocation.
Built using Next.js, Node.js, PostgreSQL, Kafka (Redpanda Cloud), Tailwind CSS, ShadCN UI and deployed on Vercel + Render.

 Features:-

- Add Products to inventory

- Sell Products with FIFO-based batch allocation

- Product List with live quantity tracking

- Sales Ledger showing detailed FIFO breakdown

- Basic Auth secured backend APIs

- Event-driven updates with Kafka (Redpanda Cloud)

 Tech Stack:-

Frontend: Next.js, Tailwind CSS, ShadCN UI
Backend: Node.js, Express, PostgreSQL
Messaging: Kafka (Redpanda Cloud)
Deployment: Vercel (Frontend), Render (Backend + PostgreSQL DB)

Setup Instructions:-
1. Clone the repo
git clone https://github.com/your-username/inventory-fifo-system.git
cd inventory-fifo-system

2. Backend Setup
cd backend
npm install


Create a .env file in /backend:

PORT=4000
DATABASE_URL=your_postgres_connection_string

# Kafka Config (Redpanda Cloud)
REDPANDA_BROKER=your-broker:9092
REDPANDA_SECURITY=SASL_SSL
REDPANDA_MECHANISM=SCRAM-SHA-256
REDPANDA_USERNAME=your-username
REDPANDA_PASSWORD=your-password

# Basic Auth
BASIC_USER=admin
BASIC_PASS=password123


Run backend:

npm start

3. Frontend Setup
cd frontend
npm install


Create a .env.local in /frontend:

NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.onrender.com


Run frontend:

npm run dev

Deployment:-

Frontend → Vercel

Backend → Render

Database → Render PostgreSQL

Kafka Events → Redpanda Cloud
