// Importamos las dependencias necesarias
const express     = require('express'); // Framework para manejar el servidor HTTP
const path        = require('path'); // Módulo para manejar rutas de archivos y directorios
const bodyParser  = require('body-parser'); // Middleware para manejar datos de formularios
const bcrypt      = require('bcrypt'); // Biblioteca para el cifrado de contraseñas
const mongoose    = require('mongoose'); // ODM para trabajar con MongoDB

// Creamos una instancia de Express
const app         = express();

// Importamos el modelo de usuario
const User        = require('./models/user');

// URI de conexión a la base de datos MongoDB
const mongo_uri   = 'mongodb://localhost:27017/pasteleriaColibri';
const PORT = 3000; // Puerto donde se ejecutará el servidor
const page = "/index.html"; // Página principal

// Middleware para parsear datos JSON y formularios en las peticiones
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Servimos archivos estáticos desde la carpeta "Public"
app.use(express.static(path.join(__dirname, 'Public')));

// Ruta para registrar un nuevo usuario
app.post('/registrar', (req, res) => {
  console.log(req.body); // Mostramos en consola los datos recibidos
  const {usuario, password} = req.body; // Extraemos usuario y contraseña del body
  const user = new User({usuario, password}); // Creamos un nuevo usuario con los datos
  
  user.save()
  .then(() => {
    res.send('Usuario guardado'); // Respuesta si el usuario se guarda correctamente
  })
  .catch((err) => {
    res.send("Error al registrar"); // Respuesta en caso de error
  });
});

// Ruta para autenticar un usuario
app.post('/autenticar', async function (req, res) {
  const {usuario, password} = req.body; // Extraemos datos del body
  console.log(req.body); // Mostramos los datos en consola
  
  const passUser = await User.findOne({usuario}); // Buscamos el usuario en la base de datos
  if (passUser) {
    const match = await bcrypt.compare(password, passUser.password); // Comparamos la contraseña ingresada con la almacenada
    if (match) {
      res.send('El password es correcto'); // Respuesta si la contraseña es correcta
    } else {
      res.send('Contraseña incorrecta'); // Respuesta si la contraseña es incorrecta
    }
  } else {
    res.send('El usuario no se encuentra registrado'); // Respuesta si el usuario no existe
  }
});

// Ruta para listar todos los usuarios
app.get('/usuarios', async (req, res) => {
  const usuarios = await User.find();
  res.json(usuarios);
});

// Ruta para buscar un usuario por ID
app.get('/usuarios/:id', async (req, res) => {
  const usuario = await User.findById(req.params.id);
  usuario ? res.json(usuario) : res.status(404).send('Usuario no encontrado');
});

// Ruta para modificar un usuario
app.put('/usuarios/:id', async (req, res) => {
  const { usuario, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const updatedUser = await User.findByIdAndUpdate(req.params.id, { usuario, password: hashedPassword }, { new: true });
  updatedUser ? res.json(updatedUser) : res.status(404).send('Usuario no encontrado');
});

// Ruta para eliminar un usuario
app.delete('/usuarios/:id', async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  deletedUser ? res.send('Usuario eliminado') : res.status(404).send('Usuario no encontrado');
});

// Ruta para buscar un usuario por su nombre
app.get('/usuarios/buscar/:usuario', async (req, res) => {
  try {
    const usuario = await User.findOne({ usuario: req.params.usuario });
    usuario ? res.json(usuario) : res.status(404).send('Usuario no encontrado');
  } catch (error) {
    res.status(500).send("Error al buscar el usuario");
  }
});

// Ruta para modificar un usuario por su nombre
app.put('/usuarios/modificar/:usuario', async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hashear la nueva contraseña antes de guardarla
    
    const updatedUser = await User.findOneAndUpdate(
      { usuario: req.params.usuario },
      { password: hashedPassword },
      { new: true }
    );

    updatedUser ? res.send('Usuario actualizado') : res.status(404).send('Usuario no encontrado');
  } catch (error) {
    res.status(500).send("Error al modificar el usuario");
  }
});

// Ruta para eliminar un usuario por su nombre
app.delete('/usuarios/eliminar/:usuario', async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ usuario: req.params.usuario });
    deletedUser ? res.send('Usuario eliminado') : res.status(404).send('Usuario no encontrado');
  } catch (error) {
    res.status(500).send("Error al eliminar el usuario");
  }
});

// Conexión a la base de datos MongoDB
mongoose.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log(`Conectado exitosamente a la DB ${mongo_uri}`))
.then(() => console.log(`Servidor corriendo en http://localhost:${PORT}${page}`))
.catch((err) => { console.error(err); }); // Captura de errores de conexión

// Iniciamos el servidor para que escuche peticiones en el puerto definido
app.listen(PORT, () => {
  console.log('La aplicación se encuentra en línea');
});

// Exportamos la instancia de la aplicación para ser usada en otros archivos
module.exports = app;


