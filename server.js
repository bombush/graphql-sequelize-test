require('babel-register')({
   presets: [ 'es2015' ]
});

const express = require('express');
const cors = require('cors');
const app = express();
const graphqlHTTP = require('express-graphql');

const index = require('./routes/index').default;
const model = require('./db/index').default;

const Schema = require('./db/model/graphql/index.js').default(model);

app.use(cors());

app.post('/',
  graphqlHTTP({
    schema: Schema
  })
 /*index(model)*/);

app.use('/schema', express.static('./db/model/graphql/schema.graphql'))


const PORT = 8080;
app.listen(PORT, () => console.log('App is istening on port ' + PORT));