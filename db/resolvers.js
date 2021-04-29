      //* MODELOS */
const Usuario = require('../models/Usuario');
const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');




/** DEPENDENCIAS */
const bcryptjs = require ('bcryptjs');
const jwt  = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});




//--- Crea y firma de un JWT ---//
const crearToken = (usuario, secreta, expiresIn) => {

  const { id, email } = usuario;

  return jwt.sign( { id, email }, secreta, { expiresIn } );//expiresIn => busca esta propiedad
}



//* Tiene que estar en ambos lados (resolver => son funciones)
const resolvers = {

    Query: {

        obtenerProyectos: async (_, {}, ctx) => {

          //--- consulto y traigo los proyectos de la persona que esta autenticada ---//
          const proyectos = await Proyecto.find({ creador: ctx.usuario.id });
          return proyectos;

        },
        obtenerTareas: async(_, {input}, ctx) =>{
          const tareas = await Tarea.find({creador: ctx.usuario.id}).where('proyecto').equals(input.proyecto);

          return tareas;
        }

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
          
        },

        autenticarUsuario: async (_, {input}) => {

          const { email, password } = input;

          //--- si el usuario existe ---//
          const existeUsuario = await Usuario.findOne({ email });


          //--- si el usuario existe ---//
          if (!existeUsuario) {
              throw new Error('El usuario No existe');
          }


          //--- si el password es correcto ---//
          const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);

          if (!passwordCorrecto) {
            throw new Error('Password Incorrecto');
          }

          //--- Dar acceso a la app ---//
          return {
            token: crearToken(existeUsuario, process.env.SECRETA, '2hr')
          }
        },

        nuevoProyecto: async(_, {input}, ctx) => {

          try {

            const proyecto = await Proyecto.create({
              nombre: input.nombre,
              creador: ctx.usuario.id,
            })

            //proyecto.creador = ctx.usuario.id;
            //const proyecto = new Proyecto(input)

            //--- almacenar en la base de datos ---//
            //const resultado = await proyecto.save();

            return proyecto;
          } catch (error) {
            console.log(error);
          }

        },

        actualizarProyecto: async(_, {id, input}, ctx) =>{

          // Revisar si el proyecto existe ---//
          let proyecto = await Proyecto.findById(id);

          if (!proyecto) {
            throw new Error('Proyecto no encontrado');
          }

          // revisar que si la persona trata de editarlo, es el creador ---//
          if (proyecto.creador.toString() !== ctx.usuario.id) {
              throw new Error('No tienes las crendenciales para editar');
          }

          //--- guardar el proyecto ---//
          proyecto = await  Proyecto.findOneAndUpdate({_id:id}, input,{new: true} );
          return proyecto;

        },

        eliminarProyecto: async(_, {id}, ctx) =>{

          // Revisar si el proyecto existe ---//
          let proyecto = await Proyecto.findById(id);

          if (!proyecto) {
            throw new Error('Proyecto no encontrado');
          }

          // revisar que si la persona trata de editarlo, es el creador ---//
          if (proyecto.creador.toString() !== ctx.usuario.id ) {
              throw new Error('No tienes las crendenciales para borrarlo');
          }


          //--- Borrar el proyecto ---//
          await Proyecto.findOneAndDelete({_id : id});

          return 'Proyecto Eliminado';

        },

        nuevaTarea: async(_, {input}, ctx) => {

          try {
            
            const tarea = await Tarea.create({
              nombre: input.nombre,
              proyecto: input.proyecto,
              creador: ctx.usuario.id
            });

            return tarea;
          
          } catch (error) {
            console.log(error);
          }
        },

        actualizarTarea: async(_, {id,input, estado}, ctx) => {

          //--- si la tarea existe o no ---//
          let tarea = await Tarea.findById(id);

          if (!tarea) {
            throw new Error('Tarea no encontrada');
          }

          //--- si la persona que edita es el propetario ---//
          if(tarea.creador.toString() !== ctx.usuario.id){
              throw new Error('No tiene las crendenciales para actualizar')
          }

          //--- asinacion del estado --//
          input.estado = estado;

          //--- guardar la tarea ---//
          tarea = await Tarea.findOneAndUpdate({_id: id}, input, {new: true});

          return tarea;

        },

        eliminarTarea: async(_, {id}, ctx) =>{

          //--- si la tarea existe o no ---//
          let tarea = await Tarea.findById(id);

          if (!tarea) {
            throw new Error('Tarea no encontrada');
          }

          //--- si la persona que edita es el propetario ---//
          if(tarea.creador.toString() !== ctx.usuario.id){
            throw new Error('No tiene las crendenciales para actualizar');
          }
            
          //--- Eliminar ---//
          await Tarea.findOneAndDelete({_id: id});
          
          return 'Tarea Eliminada';

        }

    }
}




module.exports = resolvers;