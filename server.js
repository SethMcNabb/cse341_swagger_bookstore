require('dotenv').config();
console.log("🔍 [1/6] dotenv configuration loaded.");

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

console.log("🔍 [2/6] Core modules successfully imported.");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Request Logger Middleware
app.use((req, res, next) => {
    console.log(`🌐 [INCOMING REQUEST] ${req.method} ${req.url}`);
    next();
});

console.log("🔍 [3/6] Session & Passport config initializing...");
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    console.log("💾 Serializing user session:", user.id || user);
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    console.log("🔓 Deserializing user session context.");
    done(null, obj);
});

console.log("🔍 [4/6] Configuring GitHub OAuth Strategy...");
console.log(`   👉 Client ID available: ${!!process.env.GITHUB_CLIENT_ID}`);
console.log(`   👉 Client Secret available: ${!!process.env.GITHUB_CLIENT_SECRET}`);

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || 'dummy_id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy_secret',
    callbackURL: process.env.NODE_ENV === 'production'
        ? "https://your-render-app-name.onrender.com/auth/github/callback"
        : "http://localhost:4000/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
    console.log("👋 GitHub verification callback triggered! Profile received:", profile.username);
    return done(null, profile);
}));

console.log("🔍 [5/6] Initializing Swagger docs generation...");
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: { title: 'Bookstore REST API', version: '1.0.0' }
    },
    apis: ['./swagger.yaml'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log("   👉 Swagger route configured at /api-docs");

// Link to the master MVC router
console.log("🔍 [6/6] Binding application routing layer...");
app.use('/', require('./routes'));

// Global Express Error Catch
app.use((err, req, res, next) => {
    console.error("💥 [EXPRESS CRITICAL ERROR] Caught inside middleware chain:", err);
    res.status(500).json({ error: "Internal middleware crash." });
});

app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

const dbURI = process.env.MONGODB_URI || process.env.MONGO_URI;
console.log("🔌 Attempting connection to MongoDB Atlas cluster...");

mongoose.connect(dbURI)
    .then(() => console.log('✅ SUCCESS: Connected to MongoDB Atlas!'))
    .catch((err) => console.error('❌ ERROR: MongoDB connection failure:', err));