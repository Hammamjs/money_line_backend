# Money Line 💱

Money Line is a bilingual currency conversion and money transfer management system built with **Node.js**, **Drizzle ORM**, and **PostgreSQL**.

The application allows users to send money through supported banks and request currency conversion into their preferred currency. Admin users manage conversion requests, verify transactions, and complete currency exchanges based on user selections.

The platform supports both **English and Arabic (EN/AR)** with localization support and Arabic RTL compatibility.

---

## ✨ Features

### 👤 User Features

- Create and manage accounts
- Submit money transfer requests
- Select the sending bank
- Choose the desired receiving currency
- Track conversion request status
- View transaction history
- Multi-language support (English / Arabic)

### 🛡️ Admin Features

- Admin dashboard
- Manage users
- Review transfer requests
- Verify received payments
- Convert currencies according to user selection
- Manage exchange rates
- Update transaction status
- Monitor transaction history

---

## 🏗️ Project Structure

```
money-line/
│
├── db/
│   └── drizzle/
│       └── 20260712133544_wise_namora/
│
├── src/
│   ├── config/
│   │   └── # Application configuration
│   │
│   ├── controller/
│   │   └── # Request handlers and business logic controllers
│   │
│   ├── middleware/
│   │   └── # Authentication, validation, and custom middleware
│   │
│   ├── routes/
│   │   └── # API route definitions
│   │
│   ├── services/
│   │   └── # Application services and reusable business logic
│   │
│   └── utils/
│       └── # Helper functions and utilities
│
├── package.json
├── drizzle.config.ts
├── .env
└── README.md
```

---

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript
- REST API

### Database

- PostgreSQL
- Drizzle ORM
- Drizzle Kit migrations

### Development Tools

- TSX
- dotenv
- pg driver

---

## 🔄 Application Workflow

1. User creates a currency conversion request.
2. User selects the bank used for sending money.
3. User chooses the currency they want to receive.
4. Admin reviews the submitted request.
5. Admin verifies the transferred amount.
6. Admin converts the money into the selected currency.
7. User receives the updated transaction status.

---

## 🌍 Localization

Money Line supports:

- 🇬🇧 English (EN)
- 🇸🇦 Arabic (AR)

Features:

- Language switching
- Arabic RTL layout support
- Localized currency information

---

## 🗄️ Database

The project uses **PostgreSQL** with **Drizzle ORM**.

Database migrations are stored inside:

```
db/drizzle/
```

Generate migrations:

```bash
npx drizzle-kit generate
```

Apply migrations:

```bash
npx drizzle-kit migrate
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone git@github.com:Hammamjs/money_line_backend.git

cd money-line
```

Install dependencies:

```bash
npm install
```

Create environment variables:

`postgres db needed locally or another porvider for DATABASE_URL`
`for local postgresql you need to make it as url 
 example: postgres://postgres:your_postgresql_password/localhost:5432/db_name`

```env
DATABASE_URL=your_postgres_connection_string
PORT=3000
```

Run development server:

```bash
npm run dev
```

---

## 🔐 Environment Variables

Example:

```env
DATABASE_URL=
PORT=
NODE_ENV=
```

---

## 🚀 Future Improvements

- Real-time exchange rate integration
- Mobile application
- Payment gateway integration
- Email/SMS notifications
- Advanced admin permissions
- Transaction analytics dashboard

---

## 📌 Project Goal

Money Line aims to provide a secure and simple way for users to transfer money and convert currencies through a controlled admin workflow while supporting multiple languages and regional requirements.
