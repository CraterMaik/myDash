const express = require('express');
const router = express.Router();
//const CheckAuth = require('../auth/auth');

/*PLANTILLA TEST, SIN LOGIN*/
router.get('/', async(req, res) => {
    res.render("erro404.ejs", {
        status: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : "Login"),
        client: req.bot,
        user: req.user,
        login: (req.isAuthenticated() ? "si": "no"),
        invite: `https://discordapp.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=0&scope=bot`

    }); 
});

module.exports = router; 
