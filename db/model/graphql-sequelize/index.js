import { resolver, JSONType } from "graphql-sequelize";
//import { /*GraphQLSurgeon, GraphQLTreatment,*/ test_GraphQLUsers, nodeField } from '../graphql/index';
import createGraphQlFields from '../graphql/index';

import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt,
  GraphQLString
} from 'graphql';


export default (model) => {
  const { /*GraphQLSurgeon, GraphQLTreatment,*/ test_GraphQLUsers, nodeField } = createGraphQlFields(model);

  
}
