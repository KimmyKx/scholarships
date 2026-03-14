const router = require('express').Router()
const cca = require("./MicrosoftAuth")

// middleware
const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login")
    }
    next();
};

// gets
router.get('/', (req, res) => {
    res.render('index', { user: req.session.user })
})

router.get("/login", async (req,res)=>{
    const authCodeUrlParameters = {
        scopes: ["user.read"],
        redirectUri: "http://localhost:3000/auth/microsoft/callback" // This should be the same as the redirect URI you set in Azure AD app registration
    }

    const response = await cca.getAuthCodeUrl(authCodeUrlParameters);
    res.redirect(response);
})

router.get("/auth/microsoft/callback", async (req,res) => {

    const tokenRequest = {
        code: req.query.code,
        scopes: ["user.read"],
        redirectUri: "http://localhost:3000/auth/microsoft/callback" // This should be the same as the redirect URI you set in Azure AD app registration
    }

    const response = await cca.acquireTokenByCode(tokenRequest)
    req.session.user = response.account
    res.redirect("/dashboard")
})

router.get("/dashboard", authMiddleware, (req,res) => {
    res.render("dashboard",{ user: req.session.user })
})

router.get("/scholarships", authMiddleware, (req,res) => {
    res.render("scholarships", { user: req.session.user })
})

router.get("/user/:username", authMiddleware, (req,res) => {
    if (req.params.username != req.session.user.username.split('@')[0]) {
        return res.status(403).render('403', { user: req.session.user });
    }
    res.render("user", { user: req.session.user })
})

router.get("/logout",(req,res) => {
    req.session.destroy()
    res.redirect("/")
})

module.exports = router