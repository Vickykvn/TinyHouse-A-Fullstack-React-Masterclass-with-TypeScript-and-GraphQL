require('dotenv').config();

import { ApolloServer } from 'apollo-server-express';
import express, { Application } from 'express';
import { connectDatabase } from './database';
import { resolvers, typeDefs } from './graphql';

const envChecks = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('Error: MONGO_URI must be defined');
  }
};

envChecks();

const mount = async (app: Application) => {
  const db = await connectDatabase();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ db }),
  });

  server.applyMiddleware({ app, path: '/api' });
  app.listen(process.env.PORT);

  console.log(`[app] : http://localhost:${process.env.PORT}`);
};

mount(express());

// Note: You will need to introduce a .env file at the root of the project
// that has the PORT, DB_USER, DB_USER_PASSWORD, and DB_CLUSTER environment variables defined.
// Otherwise, the server will not be able to start and/or connect to the database
