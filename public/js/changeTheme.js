// Change Theme by Free de la HOY
// PD: Crater dame de una Aprendiz

/**

Que son las cookies? y poque las utilizo?

Bueno si has investigado y has desarrollado una pagin web sabras lo que es :v sino te explico brevemente:

Los Cookies son archivos creados por un sitio web que contienen pequeñas cantidades de datos y que se envían entre un emisor y un receptor.
En el caso de Internet el emisor sería el servidor donde está alojada la página web y el receptor es el navegador que usas para visitar cualquier página web.

En este caso uso las cookies para guardar el tema de que elijan atravez de su direccion ip :v

22/05/2019


*/

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

if (getCookie('theme') === 'white') {
    document.getElementById('themeDiv').innerHTML = '<link href="../css/white.css" rel="stylesheet" id="theme"/>';
} else {
    document.getElementById('themeDiv').innerHTML = '<link href="../css/black.css" rel="stylesheet" id="theme"/>';
}

async function changeTheme() {
    var t = document.getElementById('theme').href;
    let theme;
    if (t === `https://mydash.glitch.me/css/white.css`) {
       theme = 'white';
    } else{
        theme = 'black';
    }
    console.log('Tema cambiado a' + theme)
  console.log(t)
  
    if (theme === 'white') {
        document.getElementById('theme').href = '../css/black.css';
        setCookie('theme', 'black', 1);
        console.log('Changed to dark theme');
    } else if(theme === 'black'){
        document.getElementById('theme').href = '../css/white.css';
        setCookie('theme', 'white', 1);
        console.log('Changed to light theme');
    }
  console.log(getCookie('theme'))
}

console.log(getCookie('theme'))