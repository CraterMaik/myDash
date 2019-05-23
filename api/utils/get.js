const sqlite = require("sqlite3");
const db = new sqlite.Database("../mydash.sqlite3");

const getUser = id =>
  new Promise((resolve, reject) => {
    db.get("SELECT * FROM perfiles WHERE idusu = ?", id, async (err, filas) => {
      if (err) {
        return reject(err);
      }
      resolve(filas);
    });
  });

const getViews = id => 
  new Promise((resolve, reject) => {
    
  });

module.exports = {
  getUser
};
// Cuando vuelvs lees discord c:, y otra pregunta
// que necesito para convertirme en aprendi? PD: free de la hoiya