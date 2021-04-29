const {  gql } = require('apollo-server');



//--- type definition ---//
const typeDefs = gql`

    # lo que retorna

    type Token {
        token: String
    }


    type Proyecto {
        nombre: String
        id: ID
    }

    type Tarea {
        nombre: String
        id: ID
        proyecto: String
        estado: Boolean
    }




    type Query{
        obtenerProyectos : [Proyecto]

        obtenerTareas(input: ProyectoIDInput) : [Tarea]
    }



    # los input(entradas)

    input ProyectoIDInput {
        proyecto: String!
    }

    input UsuarioInput {
        nombre: String!
        email: String!
        password: String!
    }
    
    input AutenticarInput {
        email: String!
        password: String!
    }

    input ProyectoInput {
        nombre: String!
    }

    input TareaInput {
        nombre: String!
        proyecto: String!
    }

   



   
    type Mutation {

        # Proyectos
        crearUsuario(input: UsuarioInput) : String
        autenticarUsuario(input: AutenticarInput) : Token
        nuevoProyecto(input: ProyectoInput) : Proyecto
        actualizarProyecto(id : ID!, input: ProyectoInput) : Proyecto
        eliminarProyecto(id: ID!) : String



        # Tareas
        nuevaTarea(input: TareaInput) : Tarea
        actualizarTarea(id: ID!, input: TareaInput, estado: Boolean) : Tarea
        eliminarTarea(id: ID!) : String
    }

`;


module.exports = typeDefs