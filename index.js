const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// GraphQL Schema
const schema = buildSchema(`
  type Query {
    hello: String
    add(a: Int, b: Int): Int
  }
`);

// GraphQL Resolvers
const root = {
  hello: () => "Hello, GraphQL!",
  add: ({ a, b }) => a + b,
};

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GraphQL + Swagger API",
      version: "1.0.0",
      description: "A simple GraphQL API documented with Swagger",
    },
    servers: [{ url: "http://localhost:4000" }],
  },
  apis: ["./index.js"],
};

// Initialize Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Initialize Express
const app = express();

// Root route
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the GraphQL + Swagger API</h1>
    <p>Use the following links to explore the API:</p>
    <ul>
      <li><a href="/graphql">GraphQL Playground</a></li>
      <li><a href="/api-docs">Swagger Documentation</a></li>
    </ul>
  `);
});

// GraphQL Route
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Graphical interface for testing GraphQL
  })
);

// Swagger Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start Server
const PORT = 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Accessible from other devices at http://<YOUR_LOCAL_IP>:${PORT}`);
  console.log(`Test GraphQL at http://localhost:${PORT}/graphql`);
  console.log(`Swagger documentation at http://localhost:${PORT}/api-docs`);
});