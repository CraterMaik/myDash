Bienvenido a MyDash
=================

Aplicación para el control de datos y perfiles mediante el uso de bots de Discord.

~~~
Última actualización: 15/05/2019 - Por CraterMaik || Free de la hoya.
~~~

Sobre el proyecto:
------------
### La aplicación estará desarollada en:
+ JavaScript usando el npm Express de node.js.
+ La API de Discord usando Discord.js, para interactuar con los servidores y usuarios de Discord.
+ EJS para las plantillas HTML (procesa las paginas html) para conectar con el servidor creado en express.
+ Framework CSS: Materialize css, para el diseño de la web.
+ Sqlite(Temporalmente) para almacenar los datos de usuario.

Otras dependencias del proyecto, por definir.

### Proceso de desarrollo:
- El proceso de desarrollo será progresivo, significa que al menos
uno de los participantes agregará, modificará y/o revisará la aplicación a diario ó interdiario
y dará una definicion de lo agregado, modificado o testado.

- El cual quedará registrado en el sistema de control de versiones de Glitch Team, así tener un control del proceso
de desarrollo de la aplicación por parte de los participantes.

### Propósito del proyecto:
- Aprender sobre el desarrollo de páginas web (Dashboard) y control de datos con la API de Discord (Bots de Discord).


Licencia
----
[MIT](https://es.wikipedia.org/wiki/Licencia_MIT)

El proyecto es totalmente libre, pueden utilizarlo y crear su propia versión
para sus respectivos proyectos.

Desarrollado por la comunidad de MyBOT Team [Discord](https://discord.gg/g6ssSmK)
-------------------

\ ゜o゜)ノ



## Registro de cambios (Changelog):

- ### myDash v0.0.1 - 10/05/19

  - Inicio del proyecto 
  
- ### myDash v0.0.2 - 11/05/19
  
  - Ajustes a la interfaz del inicio  y perfil de la aplicación.
  - Ajustes en el código del lado del servidor y cliente.
  - Vista del perfil de usuario.
  
- ### myDash v0.0.3 - 11/05/19
  
  - Añadida función para enviar mensajes.

- ### myDash v0.0.3.1 - 11/05/19
  
  - Easter egg añadido [/whoo](mydash.glitch.me/whoo) por alguien
  
- ### myDash v0.0.3.2 - 11/05/19

  - Se agrego una base de datos llamada mydash.db, donde se almacena el nivel, experiencia e informacion (likes y reputacion pedientes a ser agregados) del usuario.
  - Se agrego una barra de estadisticas al perfil del usuario conectado.
 
- ### myDash v0.0.3.3 - 12/05/19

  - Se agrego un apartado de informacion acerca del proyecto en la pagina web.

- ### myDash v0.0.4 - 13/05/19

  - Registro de estadísticas de un usuario.
  - Vista de las estadísticas en el perfil de usuario.
  
- ## myDash v0.0.5 - 14/05/19

  - Se agrego los comandos de perfil y modificacion de la informacion de perfil del usuario, 
  al bot de myDash.
  
- ## myDash v0.0.5.1 - 14/05/19

  - Se agrego verificacion de avatar del usuario para evitar el bug de no aparecer el avatar.
  
- ## myDash v0.0.6 - 15/05/19

  - Se agrego nueva ruta para el perfil de usuario publico /user/:id. || By CraterMaik
  - Ahora la imagen del index.ejs tendra una animacion que la hara flotar || By Free de la Hoya