const mongoose  = require("mongoose"); // Importamos mongoose para manejar la base de datos MongoDB
const bcrypt    = require('bcrypt'); // Importamos bcrypt para cifrar contraseñas

const saltRounds = 10; // Número de rondas para el cifrado de la contraseña

// Definimos el esquema de la colección "User"
const UserSchema = new mongoose.Schema({
    usuario:  { type: String, required: true }, // Campo obligatorio para el usuario
    password: { type: String, required: true, unique: true } // Campo obligatorio y único para la contraseña
});

// Middleware que se ejecuta antes de guardar un usuario en la base de datos
UserSchema.pre('save', function(next) {
    // Verificamos si es un usuario nuevo o si la contraseña ha sido modificada
    if (this.isNew || this.isModified('password')) {
        const document = this;

        // Ciframos la contraseña antes de guardarla en la base de datos
        bcrypt.hash(document.password, saltRounds, (err, hashedPassword) => {
            if (err) {
                next(err); // Si hay un error, pasamos el error y detenemos el proceso
            } else {
                document.password = hashedPassword; // Guardamos la contraseña cifrada
                next(); // Continuamos con el flujo de ejecución
            }
        });
    } else {
        next(); // Si no hay cambios en la contraseña, continuamos sin hacer nada
    }
});

// Método para comparar la contraseña ingresada con la almacenada en la base de datos
UserSchema.methods.isCorrectPassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, same) {
        if (err) {
            callback(err); // Si hay un error, lo enviamos en el callback
        } else {
            callback(err, same); // Devolvemos el resultado de la comparación (true o false)
        }
    });
};

// Exportamos el modelo "User" para poder utilizarlo en otras partes de la aplicación
module.exports = mongoose.model('User', UserSchema);
