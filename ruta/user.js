const express = require('express');
const router = express.Router();
const CheckAuth = require('../auth/auth');

/*PLANTILLA TEST, SIN LOGIN*/
router.get('/:id', async(req, res) => {
  
  
  let base = req.db;
  let idusuario = req.params.id // representa al id del usuario logeado;
  let datosdb;

  base.run("CREATE TABLE IF NOT EXISTS perfiles (idusu TEXT, nivel INTEGER, xp INTEGER, info TEXT, rep INTEGER, like INTEGER, estado INTEGER)", select);
  
  
  function select(){
    base.run("CREATE TABLE IF NOT EXISTS views (idusu TEXT, viewCount INTEGER)")
    base.run("CREATE TABLE IF NOT EXISTS follows (idfirst, idsecond, date)")
    
    
    base.get("SELECT * FROM perfiles WHERE idusu = ?", idusuario, function (err, filas) {
       
         if(err){ 
           console.log(err.message) 
         } else {
           
            if(!filas){
              return res.redirect("/error404");
              
            }  else {
                base.get("SELECT * FROM views WHERE idusu = ?", idusuario, function (err, v_filas) {
                  if(!v_filas){
                    let sentencia = base.prepare("INSERT INTO views VALUES (?, ?)");
                    sentencia.run(idusuario, 0);
                    
                  } else {
                     base.run(`UPDATE views SET viewCount = ${v_filas.viewCount + 1 } WHERE idusu = ${v_filas.idusu}`);
                    
                  }
                  
                })
                
                
                let verUsuario = req.bot.users.get(idusuario);
                // Cuando el bot no comparte el mismo servidor con el usuario registrado.
                if(!verUsuario) return res.redirect("/error404");
                
                let nextLevel = (filas.nivel + 1);
                let expT = Math.trunc(Math.pow((Number(filas.nivel)) / 0.1, 2)).toString(); 
                let frameFactor = Math.trunc(Math.pow((Number(filas.nivel) + 1) / 0.1, 2)) - Math.trunc(Math.pow((Number(filas.nivel)) / 0.1, 2));

                let nPorcent = (((Number(filas.xp) - Number(expT)) / frameFactor) * 100).toFixed(0);
                let xpStats = `${filas.xp - expT}/${frameFactor}`;
              
                
                if(req.isAuthenticated()) {
                  
                  
                  let seg_idusuario = req.user.id;
                  let add_idusuario = req.params.id;
                  /*
                  
                  ya te hice el code, ahre :U
                  
                  probar este code 
                    if(req.user.id === req.params.id){
                        res.redirec("/perfil")
                    }
                  :drakeyeah:
                  */

                  base.get("SELECT * FROM follows WHERE idfirst = ? AND idsecond = ?", [add_idusuario, seg_idusuario], function (err, _filas){
                    if(_filas){
                      let follow = true;
                      sendRender(follow)
                    } else {
                      let follow = false;
                      sendRender(follow)
                      
                    }
                  })
                  function validar(){
                    if(req.user.id === req.params.id) return true
                    else return false;
                    //el minimodulo para cuando
                  }
                  function sendRender(follow){                                      
                    base.get("SELECT * FROM views WHERE idusu = ?", idusuario, function (err, v_filas) {
                        if(err){ 
                         console.log(err.message)
                        }
                        let vistas = 0;
                        if(v_filas){
                          vistas = v_filas.viewCount;
                        }
                        res.render("user.ejs", {
                          status: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : "Login"),
                          client: req.bot,
                          user: filas,
                          validar: (validar() ? "si": "no"),
                          nNivel: nextLevel,
                          vistas: vistas,
                          percent: nPorcent,
                          follow: (follow ? "si" : "no"),
                          xpstats: xpStats,
                          login: (req.isAuthenticated() ? "si": "no"),
                          invite: `https://discordapp.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=0&scope=bot`

                        }); 
                      
                    })

                  }
                  
                  
                } else {
                  
                  base.get("SELECT * FROM views WHERE idusu = ?", idusuario, function (err, v_filas) {
                    if(err){ 
                      console.log(err.message)
                    }
                    let vistas = 0;
                    if(v_filas){
                       vistas = v_filas.viewCount;
                    }
                    
                    res.render("user.ejs", {
                      status: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : "Login"),
                      client: req.bot,
                      user: filas,
                      nNivel: nextLevel,
                      percent: nPorcent,
                      validar: "no",
                      vistas: vistas,
                      follow: "no",
                      xpstats: xpStats,
                      login: (req.isAuthenticated() ? "si": "no"),
                      invite: `https://discordapp.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=0&scope=bot`

                    }); 
                    
                    
                  })

                  
                  
                  
                }
                
         
            }
           
         }
         
      });
  }
  
})
.post('/addlike/:id', CheckAuth, async(req, res) => {
    let idlogin = req.user.id;
    let idview = req.params.id;
    let base = req.db;
    if(idlogin === idview) return res.redirect(`/user/${idview}`);
    
    base.get("SELECT * FROM perfiles WHERE idusu = ?", idview, function (err, filas) {
       if(!filas) return res.redirect(`/error404`);
        base.run(`UPDATE perfiles SET rep = ${filas.rep + 1 } WHERE idusu = ${filas.idusu}`);
        res.redirect(`/user/${filas.idusu}`);
        
    })
})
.post('/unseguir/:id', CheckAuth, async(req, res) => {
  
  let base = req.db;
  base.run("CREATE TABLE IF NOT EXISTS follows (idfirst, idsecond, date)", select); 
  
  function select(){
    let seg_idusuario = req.user.id;
    let add_idusuario = req.params.id;
    base.get("SELECT * FROM perfiles WHERE idusu = ?", add_idusuario, function (err, filas) {
        if(!filas) return res.redirect(`/error404`);
        base.run('DELETE FROM follows WHERE idfirst = ? AND idsecond = ?', [add_idusuario, seg_idusuario], function(err){
          console.log(this.changes)
          base.run(`UPDATE perfiles SET like = ${filas.like - 1 }  WHERE idusu = ${filas.idusu}`);
          res.redirect(`/user/${filas.idusu}`);
          
        })
      
    })
    
    
    
  }
  
})
.post('/seguir/:id', CheckAuth, async(req, res) => {
       
    let base = req.db;
    base.run("CREATE TABLE IF NOT EXISTS follows (idfirst, idsecond, date)", select); 
  
    function select() {
      let seg_idusuario = req.user.id;
   
      let add_idusuario = req.params.id;
      
      
      base.get("SELECT * FROM perfiles WHERE idusu = ?", add_idusuario, function (err, filas) {
        if(!filas)  res.redirect(`/error404`);
        base.get("SELECT * FROM follows WHERE idfirst = ? AND idsecond = ?", [add_idusuario, seg_idusuario], function (err, _filas){
          if(!_filas){
            let sentencia = base.prepare("INSERT INTO follows VALUES (?, ?, ?)");
            sentencia.run(add_idusuario, seg_idusuario, Date.now());
            base.run(`UPDATE perfiles SET like = ${filas.like + 1 }  WHERE idusu = ${filas.idusu}`);
            res.redirect(`/user/${filas.idusu}`);
            
          } else {
             res.redirect(`/error404`);
          }
        })
        

      });
      
    }
    
    
    
});

module.exports = router; 
