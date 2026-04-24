# Forever — Full-Stack Fashion E-Commerce

A premium fashion e-commerce platform with AI-powered semantic search, an LLM chatbot assistant, Stripe payments, and cinematic GSAP animations.

---

## Live Demo

- **Frontend:** [forever-frontend.vercel.app](https://e-commerce-nihal.vercel.app/)
- **Backend API:** [forever-backend-ten-bice.vercel.app](https://forever-backend-ten-bice.vercel.app)

---

## Project Structure

```
forever/        
|---admin/             # React + Vite + Tailwind + GSAP
├── frontend/          # React + Vite + Tailwind + GSAP
└── backend/           # Node.js + Express + MongoDB
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 6 | Build tool & dev server |
| Tailwind CSS | 4 | Utility-first styling |
| GSAP | 3.14 | Animations & scroll effects |
| React Router DOM | 7 | Client-side routing |
| Axios | 1.13 | HTTP client |
| React Toastify | 11 | Toast notifications |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | 5 | HTTP server & routing |
| MongoDB + Mongoose | 8 | Primary database |
| Cloudinary | 2 | Product image storage & CDN |
| JSON Web Token | 9 | Auth tokens |
| Bcrypt | 6 | Password hashing |
| Multer | 2 | File upload handling |
| Stripe | 19 | Payment processing |
| Groq SDK | 1.1 | LLM chatbot (Llama 3.1) |
| Endee | 1.7 | Vector database |
| @xenova/transformers | 2.17 | Local text embeddings (all-MiniLM-L6-v2) |
| Validator | 13 | Input validation |

---

## Features

### 🛍️ Core E-Commerce
- Product listing, filtering by category & subcategory
- Sort by price (low–high, high–low, relevance)
- Product detail page with image gallery & size selection
- Cart management (add, update quantity, remove)
- Order placement and order history
- User authentication (register/login/logout)
- JWT-based protected routes

### 🔍 AI-Powered Vector Search
Semantic search using a local embedding model (`all-MiniLM-L6-v2` via `@xenova/transformers`) and Endee vector database.

- Converts product name + description + category into 384-dimensional vectors
- Stored in Endee with cosine similarity
- Query text is embedded at search time and matched by similarity score
- Results filtered by `similarity > 0.35` threshold
- Similarity-ordered results preserved in Collection page
- Fallback to keyword match while vector results load
- Related Products section on each product page uses vector search

**Endpoints:**
```
POST /api/search           → semantic product search
POST /api/search/sync      → bulk re-index all products (admin only)
GET  /api/search/health    → compare MongoDB count vs index size
```

### 🤖 AI Style Assistant (Chatbot)


Description:
AI fashion assistant powered by Groq (Llama 3.1 8B Instant).
Handles styling advice and product recommendations with full conversation context.

Features:
- Fashion-scoped responses
- Conversation memory via history
- Vector search product suggestions
- Returns UI-ready product cards

POST /api/chat

### 💳 Payments
- **Stripe** — card payments via Stripe Checkout session
- **Cash on Delivery** — COD option at checkout
- Stripe webhook verification via `/api/order/verifyStripe`

### 🎨 Animations (GSAP)
- **PageLoader** — fullscreen count-up loader on first visit
- **PageTransition** — clip-path wipe between routes
- **CinematicCursor** — custom gold dot + ring cursor (desktop only)
- **ScrollProgress** — gold progress bar fixed at top of page
- **Hero** — parallax background, mouse-tracking image, staggered text entry
- **LatestCollection** — 3D tilt card entrance, ghost watermark parallax
- **BestSeller** — alternating slide-in cards, spotlight glow on hover
- **Navbar** — staggered entry animation, scroll-aware style switching
- **OurPolicy / NewsLetterBox** — scroll-triggered fade + slide reveals
- **About / Contact** — parallax images, FAQ accordion with GSAP height animation

---

## API Routes

### User
```
POST /api/user/register
POST /api/user/login
POST /api/user/admin
```

### Products
```
GET  /api/product/list
POST /api/product/add       (admin)
POST /api/product/remove    (admin)
POST /api/product/single
```

### Cart
```
POST /api/cart/get
POST /api/cart/add
POST /api/cart/update
```

### Orders
```
POST /api/order/place
POST /api/order/stripe
POST /api/order/verifyStripe
POST /api/order/userorders
POST /api/order/list        (admin)
POST /api/order/status      (admin)
```

### Search
```
POST /api/search
POST /api/search/sync       (admin)
GET  /api/search/health
```

### Chat
```
POST /api/chat
```

---

## Environment Variables

### Backend `.env`
```env
MONGODB_URI=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=
JWT_SECRET=
JWT_REFRESH_SECRET=
ADMIN_EMAIL=
ADMIN_PASS=
STRIPE_SECRET_KEY=
GROQ_API_KEY=
ENDEE_TOKEN=
ENDEE_INDEX_NAME=products
```

### Frontend `.env`
```env
VITE_BACKEND_URL=https://your-backend.vercel.app
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Stripe account
- Groq account (free) — [console.groq.com](https://console.groq.com)
- Endee account — [app.endee.io](https://app.endee.io)

### Backend
```bash
cd backend
npm install
# create .env with variables above
npm run server
```

### Frontend
```bash
cd frontend
npm install
# create .env with VITE_BACKEND_URL
npm run dev
```

### First Deploy — Index Products
After deploying the backend, run the sync endpoint once to populate the vector index:

```bash
curl -X POST https://your-backend.vercel.app/api/search/sync \
  -H "token: YOUR_ADMIN_JWT"
```

Or hit it from Postman with your admin token in the `token` header.

---

## Deployment

Both apps are deployed on **Vercel**.

### Backend (`vercel.json`)
```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```

### Frontend
Standard Vite build — Vercel auto-detects. Set `VITE_BACKEND_URL` in Vercel environment variables.

---

## Vector Search Architecture

```
Product added/updated
        ↓
  Text constructed:
  "{name} {description} {category} {subCategory}"
        ↓
  @xenova/transformers
  (all-MiniLM-L6-v2, 384 dims, runs locally)
        ↓
  Float vector [0.23, -0.81, 0.44, ...]
        ↓
  Endee upsert (cosine similarity space)

User search query
        ↓
  Same embedding pipeline
        ↓
  Endee query (topK, optional filters)
        ↓
  Results sorted by similarity score
        ↓
  Frontend filters similarity > 0.35
```

---

## Folder Structure

```
backend/
├── config/
│   ├── mongodb.js
│   └── cloudinary.js
├── controllers/
│   ├── userController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── orderController.js
│   └── chatController.js
├── middleware/
│   ├── auth.js
│   ├── adminAuth.js
│   └── multer.js
├── models/
│   ├── userModel.js
│   ├── productModel.js
│   └── orderModel.js
├── routes/
│   ├── userRoute.js
│   ├── productRoute.js
│   ├── cartRoute.js
│   ├── orderRoute.js
│   └── chatRoute.js
├── vector-search/
│   ├── controllers/searchController.js
│   ├── routes/searchRoute.js
│   └── services/
│       ├── endeeService.js
│       └── productSearchHooks.js
├── server.js
└── vercel.json

frontend/src/
├── assets/
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── LatestCollection.jsx
│   ├── BestSeller.jsx
│   ├── ProductItem.jsx
│   ├── RelatableProducts.jsx
│   ├── Search.jsx
│   ├── Chatbot.jsx
│   ├── CinematicCursor.jsx
│   ├── PageLoader.jsx
│   ├── PageTransition.jsx
│   ├── ScrollProgress.jsx
│   ├── ScrollTop.jsx
│   ├── CartTotal.jsx
│   ├── Footer.jsx
│   ├── Title.jsx
│   ├── OurPolicy.jsx
│   ├── NewsLetterBox.jsx
│   └── animations/
│       └── useGsapButton.js
├── context/
│   └── Shop.jsx
├── hooks/
│   └── useGSAP.js
├── pages/
│   ├── Home.jsx
│   ├── Collection.jsx
│   ├── Product.jsx
│   ├── Cart.jsx
│   ├── PlaceOrder.jsx
│   ├── Order.jsx
│   ├── Login.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   └── Verify.jsx
├── App.jsx
├── main.jsx
└── index.css
```

---

## License

MIT
