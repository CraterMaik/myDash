const express = require('express');
const router = express.Router();
const CheckAuth = require('../auth/auth');


router.get('/', CheckAuth, async(req, res) => {
    // aqui se registra al usuario cada vez que se logea
    // y tenemos que validar si ya esta registrado o no
    // usamos req.db que representa la mydash.sqlite y sus metodos para la sentecias SQL
   // puedo preguntar algo? porque req.db = mydash.sqlite?
  
    let base = req.db;
    let idusuario = req.user.id; // representa al id del usuario logeado;
    let datosdb;
    // CREATE TABLE para crear una tabla en sqlite y agregar las comunlas para la tabla
    // NOT EXISTS significa que si no exite la tabla crea una nueva automaticamente.
   //(duda) que significa INTEGER? / rta: Tipo de dato numerico(? ahh mira vos che
   // el santi escribira por mi xD /
    base.run("CREATE TABLE IF NOT EXISTS perfiles (idusu TEXT, nivel INTEGER, xp INTEGER, info TEXT, rep INTEGER, like INTEGER, estado INTEGER)", select);
    //luego de crear la tabla que llame a la funcion select()
    function select() {
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
                     enviarRender(_filas);
                     
                  
                });
 
              
              
            }  else {
              // Si el usuario esta registrado, solo obtenemos sus datos.
              
                base.get("SELECT * FROM perfiles WHERE idusu = ?", idusuario, function (err, __filas) {
                    if(err){ //aqui verificamos si existe algun error con las SENTENCIAS.
                     console.log(err.message)
                    }
                     //Ahora enviamos los datos registrado al perfil del usuario en la web
                    enviarRender(__filas);
                  
                }); 
             
            }
           
         }
         
      });
    };
  
  function enviarRender (filas){
    base.run("CREATE TABLE IF NOT EXISTS follows (idfirst, idsecond, date)"); 
    let nextLevel = (filas.nivel + 1);
    let expT = Math.trunc(Math.pow((Number(filas.nivel)) / 0.1, 2)).toString(); 
    let frameFactor = Math.trunc(Math.pow((Number(filas.nivel) + 1) / 0.1, 2)) - Math.trunc(Math.pow((Number(filas.nivel)) / 0.1, 2));

    let nPorcent = (((Number(filas.xp) - Number(expT)) / frameFactor) * 100).toFixed(0);
    let xpStats = `${filas.xp - expT}/${frameFactor}`;
   // console.log(filas.idusu);
     let datosSiguiendo = [];
     let datosSeguidores = [];
     base.all("SELECT * FROM follows WHERE idsecond = ?",[filas.idusu], function (err, rows) {
          rows.map(datos => {
              if(req.bot.users.get(datos.idfirst)) {
                 datosSiguiendo.push(datos)
               }
             
           })
          base.all("SELECT * FROM follows WHERE idfirst = ?",[filas.idusu], function (err, rows) {
            rows.map(datos_ => {
               if(req.bot.users.get(datos_.idsecond)) {
                 datosSeguidores.push(datos_)
               }
               
             })
                 base.get("SELECT * FROM views WHERE idusu = ?", idusuario, function (err, v_filas) {
                    if(err){ 
                     console.log(err.message)
                    }
                    let vistas = 0;
                    if(v_filas){
                      vistas = v_filas.viewCount;
                    }

                    res.render("perfil.ejs", {
                      status: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : "login"),
                      client: req.bot,
                      user: req.user,
                      dbuser: filas, // estamos enviando los datos del usuario a la web mediante "dbuser";
                      nNivel: nextLevel,
                      percent: nPorcent,
                      xpstats: xpStats,
                      vistas: vistas,
                      siguiendo: datosSiguiendo,
                      seguidores: datosSeguidores,
                      login: (req.isAuthenticated() ? "si" : "no"),
                      avatarURL:`https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
                      iconURL:`https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=32`
                    });  
                    
                  
                }); 
                   

           })
           
         
     })

 

  }

})
.post('/edit', CheckAuth, async(req, res) => {

    let base = req.db;
    let idusuario = req.user.id;
    let newInfo = req.body.newedit
    
    base.get("SELECT * FROM perfiles WHERE idusu = ?", idusuario, function (err, filas) {
      if(!filas) return;
      base.run(`UPDATE perfiles SET info = '${newInfo}' WHERE idusu = ${idusuario}`);
      res.redirect("/perfil");
    });
    
})


module.exports = router;
