const express = require('express');
const Discord = require('discord.js');
const router = express.Router();
const passport = require("passport");
const CheckAuth = require('../auth/auth');

router.post("/send-msg", CheckAuth, (req, res) => { 
  console.log(req.body)
  if (req.body.msg && req.body.color && req.body.titulo && req.body.canal) {
    if (!req.bot.channels.get(req.body.canal)) sendStatus(res, {"status": "error", "error": "no_channel"});
    req.bot.channels.get(req.body.canal).send(
      new Discord.RichEmbed()
      .setTitle(req.body.titulo)
      .setDescription(req.body.msg)
      .setColor(req.body.color)
      .setFooter(`Enviado por ${req.user.username}#${req.user.discriminator}`, `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`)
  )
      .then(() => {
        sendStatus(res, {"status": "sent","message": req.body.msg});
      })
      .catch(err => {
        sendStatus(res, {"status": "error","error": err});
      })
  }
})

let sendStatus = (res, status) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(status, null, 3));
}

module.exports = router;