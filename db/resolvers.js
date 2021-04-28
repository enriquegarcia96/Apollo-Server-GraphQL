const Usuario = require('../models/Usuario');
const bcryptjs = require ('bcryptjs');



//* Tiene que estar en ambos lados (resolver => son funciones)
const resolvers = {

    Query: {
      
    },
    Mutation: {
        crearUsuario: async (_, {input}) => {
          
          const { email, password }   = input;


          const existeUsuario = await Usuario.findOne({ email })

          // si el usuario existe
          if (existeUsuario) {
            throw new Error('El usuario ya esta registrado');
          }

          try {

            //--- Hashear Password ---//
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);


            //--- Registrar Nuevo Usuario ---//
            const nuevoUsuario = new Usuario(input);
            nuevoUsuario.save();// lo guarda en la base de datos de MONGODB
            return 'Usuario Creado con Correctamente';

          } catch (error) {
            console.log(error);
          }
          
        }
    }

}




module.exports = resolvers;