const express = require('express');
const app = express();
const session = require("express-session");
const passport = require("passport");
const { Strategy } = require("passport-discord");
const bodyparser = require("body-parser");

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydash.sqlite3');
//creo que el crea el archivo(? vamos a quitale el .sqlite y ver si sirve ok

const Discord = require("discord.js");
const client = new Discord.Client({
  disableEveryone: true,
  fetchAllMembers: true
});

const path = require("path");
const fs = require("fs");


//BOT DISCORD

let base = db;

client.on('ready', () => {
  
  console.log('estoy listo!');
  client.user.setPresence({
       status: "online",
       game: {
           name: "alarmas",
           type: "WATCHING"
       }
   });

});

let prefix = process.env.PREFIX;

client.on('message', message => {
  
  let enviar = {
    local: function (text){
        message.channel.send(text)
    },
    autor: function (text){
        message.author.send(text)
    },
    log : function (text){
        console.log(text)
    },
    global: function (id, text){
        client.channels.get(id).send(text)
      
    }
  }
  
  if(message.author.bot) return;
  if(message.channel.type == "dm") return;
  let idusuario = message.author.id;
  if(!message.content.startsWith(prefix)) return;
  

  
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
    // CADA VEZ QUE UN USUARIO UTILIZE UN COMANDO DEL BOT SE LE ACTUALIZARA LOS PUNTOS DE XP

  base.get("SELECT * FROM perfiles WHERE idusu = ?", idusuario, function (err, filas) {
    if(err){
      enviar.log(err.message)
    }
    if(!filas) return;
    let curLevel = Math.floor(0.1 * Math.sqrt(filas.xp + 1));
    if (curLevel > filas.nivel) {
       filas.nivel = curLevel;
       base.run(`UPDATE perfiles SET xp = ${filas.xp + 1}, nivel = ${filas.nivel} WHERE idusu = ${message.author.id}`);
        
       enviar.local('Subiste de nivel, '+ message.author.tag)
     }
    
    base.run(`UPDATE perfiles SET xp = ${filas.xp + 1} WHERE idusu = ${message.author.id}`);
    console.log('NEW XP '+ (filas.xp + 1) + ' / '+ message.author.tag)
    //Con esto Crater se cargo nuestros logs.
    //listo a probar en discord y luego login en la web!
  });
  
  if(command === 'perfil'){
    
    let id = message.author.id
    base.run("CREATE TABLE IF NOT EXISTS perfiles (idusu TEXT, nivel INTEGER, xp INTEGER, info TEXT, rep INTEGER, like INTEGER, estado INTEGER)", select(id));
    //luego de crear la tabla que llame a la funcion select()
    function select(idusuario) {
      // aqui registramos los datos del usuario y validamos.
      base.get("SELECT * FROM perfiles WHERE idusu = ?", idusuario, function (err, filas) {
        //hacemos una consulta a la db si el usuario ya esta registrado, enviandole el idusuario..
         if(err){ //aqui verificamos si existe algun error con las SENTENCIAS.
           console.log(err.message) 
         } else {
           // si no existe ningun error 
            if(!filas){
              //usuario No esta registrado
              // si no esta registrado ps! lo registramos no ?
                let sentencia = base.prepare("INSERT INTO perfiles VALUES (?, ?, ?, ?, ?, ?, ?)");
                //aqui para registrar a la tabla perfiles requiere de 5 parametros:
                sentencia.run(idusuario, 0, 1, 'Sin información previa.', 0, 0, 0); // No tocar - Crater
                            // id   nivel: 0, exp: 1, info: cualquiera de inicio estado: 0
              
              //basicamente lo que hiso fue añadir algo a la tabla
              //lo de base.run idusu = idusuario etc etc
              //para aclarar al que no entendio
              
               
                base.get("SELECT * FROM perfiles WHERE idusu = ?", idusuario, function (err, _filas) {
                    if(err){ //aqui verificamos si existe algun error con las SENTENCIAS.
                     console.log(err.message)
                    }
                      let datos = _filas;
                      
                      let expT = Math.trunc(Math.pow((Number(_filas.nivel)) / 0.1, 2)).toString(); 
                      let frameFactor = Math.trunc(Math.pow((Number(_filas.nivel) + 1) / 0.1, 2)) - Math.trunc(Math.pow((Number(_filas.nivel)) / 0.1, 2));

                      let nPorcent = (((Number(_filas.xp) - Number(expT)) / frameFactor) * 100).toFixed(0);
                      let xpStats = `${_filas.xp - expT}/${frameFactor}`;
                  

                      let embed = new Discord.RichEmbed()
                        .setAuthor('Perfil de ' + message.author.username, message.author.displayAvatarURL)
                        .addField('Nivel', datos.nivel, true)
                        .addField('Porcentaje', nPorcent+`%`, true)
                        .addField('XP', xpStats +` (Tot. ${datos.xp})`, true)
                        .addField('Reputación', datos.rep, true)
                        .addField('Likes', datos.like, true)
                        .addField('Descripción', datos.info, true)
                        .setColor("ff7b00")
                      enviar.local(embed);
                     
                  
                });
 
              
              
            }  else {
              // Si el usuario esta registrado, solo obtenemos sus datos.
              
                base.get("SELECT * FROM perfiles WHERE idusu = ?", idusuario, function (err, __filas) {
                    if(err){ //aqui verificamos si existe algun error con las SENTENCIAS.
                     console.log(err.message)
                    }
                         
                      let datos = __filas;

                      let expT = Math.trunc(Math.pow((Number(__filas.nivel)) / 0.1, 2)).toString(); 
                      let frameFactor = Math.trunc(Math.pow((Number(__filas.nivel) + 1) / 0.1, 2)) - Math.trunc(Math.pow((Number(__filas.nivel)) / 0.1, 2));

                      let nPorcent = (((Number(__filas.xp) - Number(expT)) / frameFactor) * 100).toFixed(0);
                      let xpStats = `${__filas.xp - expT}/${frameFactor}`;
                  
                      let embed = new Discord.RichEmbed()
                        .setAuthor('Perfil de ' + message.author.username, message.author.displayAvatarURL)
                        .addField('Nivel', datos.nivel, true)
                        .addField('Porcentaje', nPorcent+`%`, true)
                        .addField('XP', xpStats +` (Tot. ${datos.xp})`, true)
                        .addField('Reputación', datos.rep, true)
                        .addField('Likes', datos.like, true)
                        .addField('Descripción', datos.info, true)
                        .setColor("ff7b00")
                      enviar.local(embed);
                     
                }); 
             
            }
           
         }
         
      });
    };

  
  }
  if(command === 'setinfo'){
    let texto = args.join(' ');
    if(!texto) return enviar.local('Debe escribir un texto para su información de perfil');
    
    base.get("SELECT * FROM perfiles WHERE idusu = ?", idusuario, function (err, filas) {
      if(!filas) return enviar.local('Registrese en la web de myDash.');
      base.run(`UPDATE perfiles SET info = '${texto}' WHERE idusu = ${message.author.id}`);
      enviar.local('Información editada correctamente.')
      console.log('NEW INFO: ' + texto + ' / ' + message.author.tag)
    });
  }

  //lo que se muestra en la web del los datos de perfil al bot
  
  if(command === 'rep'){
    let mencionado = message.mentions.users.first()
    if(!mencionado) return enviar.local('Debe escribir un usuario al que darle la reputación')
    if(mencionado.id == message.author.id) return enviar.local('No puedes darte reputación a ti mismo')
    
    base.get("SELECT * FROM perfiles WHERE idusu = ?", mencionado.id, function (err, filas) {
      if(!filas) return enviar.local('El usuario debe registrarse en la web de myDash');
      base.run(`UPDATE perfiles SET rep = ${filas.rep + 1} WHERE idusu = ${mencionado.id}`);
      message.channel.send('Reputación añadida con éxito.') 
      console.log('NEW REP: ' + (filas.rep + 1) + ' / ' + mencionado.tag)
    });
  }
}); 

client.login(process.env.TK);


// SERVIDOR WEB
passport.serializeUser((user, done) => {
  done(null, user);
  
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
  
});

let scopes = ["identify"];

passport.use(new Strategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: `${process.env.URL}/login`,
  scope: scopes
}, function(accessToken, refreshToken, profile, done){
  process.nextTick(function() {
    return done(null, profile);
  });
}));

app
.use(bodyparser.json())
.use(bodyparser.urlencoded({ extended: true }))
.engine("html", require("ejs").renderFile)
.use(express.static(path.join(__dirname, "/public")))
.set("view engine", "ejs")
.set("views", path.join(__dirname, "views"))
.set('port', process.env.PORT || 3000)
.use(session({
  secret: "mydash",
  resave: false,
  saveUninitialized: false
}))
.use(passport.initialize())
.use(passport.session())
.use(function(req,res,next){
  req.bot = client;
  req.db = db; //aqui estamos creado una base para poder utilizar en las rutas
  next();
})
.use("/", require("./ruta/index"))
.use("/perfil", require("./ruta/perfil"))
.use("/api", require("./ruta/api"))
.use("/whoo", require("./ruta/whoo")) //all works correctely
.use("/about", require("./ruta/about"))
.use("/user", require("./ruta/user"))
.use("/error404", require("./ruta/error"))
.get("*", function(req, res) {
  res.redirect("/error404")
});


app.listen(app.get('port'), function() {
  console.log('Listo en el puerto ' + app.get('port'));
});

process.on("unhandledRejection", (r) => {
  console.dir(r);
});

