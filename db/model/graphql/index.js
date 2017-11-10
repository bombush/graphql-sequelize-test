import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
  GraphQLBoolean
} from 'graphql';

import {
  relay,
  resolver,
  attributeFields,
} from 'graphql-sequelize'
const sequelizeNodeInterface = relay.sequelizeNodeInterface;
const sequelizeConnection = relay.sequelizeConnection;
//const a = relay.typeResolver

/*
import {
  Todo,
  User,


  addTodo,
  changeTodoStatus,
  getTodo,
  getTodos,
  getUser,
  getViewer,
  markAllTodos,
  removeCompletedTodos,
  removeTodo,
  renameTodo,
} from '../database';*/

//import { Users, sequelize } from '../sequelize/index';

const createGraphQlSchema = (model) => {
  const {
    nodeInterface,
    nodeField,
    nodeTypeMapper
  } = sequelizeNodeInterface(model.sequelize);

  const test_GraphQLUsers = new GraphQLObjectType({
    name: 'Users',
    fields: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        resolve: resolver(model.Users, 
          { 
            after: results => results.id_user
          }
        )
      },
      username: {
        type: GraphQLString
      }
    },
    interfaces: [ nodeInterface ]
  });

  const test_GraphQLTreatment = new GraphQLObjectType({
    name: 'Treatment',
    fields: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        /*resolve: (root, args) => {
          return model.Category.findOne({
            include: [{
                model: model.T_Categories,
                attributes: ['title'],
                where: {
                  lang_version: 'CS'
                }
              }]
          }
          )
            .then( result => console.log(result) || result.data);
        }*/
        interfaces: [ nodeInterface ]
      },
      name: {
        type: GraphQLString,
        resolve: (root, args) => {
          return root.t_categories[0].dataValues.title;
          /*var a = 'a';
          return model.Category.findOne({
            include: [{
                model: model.T_Categories,
                attributes: ['title'],
                where: {
                  lang_version: 'CS',
                  id_category: root.id_category
                }
              }]
          }
          )
            .then( result => result.t_categories[0].dataValues.title);*/
      }
      }
    },
    args: {
          id: {
            type: GraphQLString
          }
        },
    interfaces: [nodeInterface]
  });

  const test_TreatmentConnection = sequelizeConnection({
    name: 'viewerTreatments',
    nodeType: test_GraphQLTreatment,
    target: model.Category,
    before: (findOptions, args, context, info) => {
      findOptions.include =
         [{
                model: model.T_Categories,
                attributes: ['title'],
                where: {
                  lang_version: 'CS'
                }
              }]
      return findOptions;
    },
    after:
      result =>
        {
          result.edges.forEach(edge => console.log(edge.node.id));
          return result
        }
  });

  const test_GraphQLViewer = new GraphQLObjectType({
    name: 'Viewer',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLID),
        resolve: () => 1
      },
      rootHack: {
          type: new GraphQLNonNull(test_GraphQLViewer),
          resolve: () => ({})
      },
      treatments: {
        type: new GraphQLList(test_GraphQLTreatment),
        /*resolve: resolver(model.Category, {
          after: results => console.log(results) || results
        })*/
      }
    }),
    interfaces: [ nodeInterface ]
  });

  nodeTypeMapper.mapTypes({
    [model.Users.name]: test_GraphQLUsers,
    [model.Category.name]: test_GraphQLTreatment
  });

  const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
      /*viewer: {
        type: GraphQLUser,
        resolve: () => getViewer(),
      },*/
      /*surgeon: {
        type: GraphQLSurgeon,
        resolve: resolver(
          GraphQLSurgeon,
          {
            before: (findOptions, args) => findOptions
          }
        )
      },
      /*
      treatment: {
        type: GraphQLTreatment
      },*/
      surgeon: {
        type: test_GraphQLUsers,
        resolve: resolver(model.Users)
      },
      surgeons: {
        type: new GraphQLList(test_GraphQLUsers),
        resolve: resolver(model.Users)
      },
      treatment: {
        type: test_GraphQLTreatment,
        resolve: resolver(model.Category, {
           before: (findOptions, args, context, info) => {
            findOptions.include =
              [{
                      model: model.T_Categories,
                      attributes: ['title'],
                      where: {
                        lang_version: 'CS'
                      }
                    }]
            return findOptions;
          },
        }),
        interfaces: [ nodeInterface ],
        args: {
          id: {
            type: GraphQLID
          }
        },
      },
      treatments: {
        type: test_TreatmentConnection.connectionType,
        args: test_TreatmentConnection.connectionArgs,
        resolve: test_TreatmentConnection.resolve
      },
      viewer: {
        type: test_GraphQLViewer,
        resolve: () => { id: 1}
      },
      node: nodeField,
    },
  });

  return new GraphQLSchema({
    query: Query,
  // mutation: Mutation,
  });

/*
  return {
    //GraphQLTreatment,
    //GraphQLSurgeon,
    test_GraphQLUsers,
    nodeField,
  }*/
}

export default createGraphQlSchema;
