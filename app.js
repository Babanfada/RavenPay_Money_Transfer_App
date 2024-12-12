require("dotenv").config();
require("express-async-errors");
// server
const express = require("express");
const app = express();
const port = process.env.PORT || 5004;
const knexConfig = require("./knexfile");
const Knex = require("knex");

//middleware
app.use(express.json());
const morgan = require("morgan");
app.use(morgan("dev"));

// Initialize knex with the development configuration
const knex = Knex(knexConfig[process.env.NODE_ENV || "development"]);
// Attach knex to the app for global use
app.set("knex", knex);

// Error Handling Middleware
const notFound = require("./middlewares/notFoundError");
const errorHandlerMiddleware = require("./middlewares/errorHandler");

//cookie
const cookieParser = require("cookie-parser");

// Router
const authRoutes = require("./routes/authflow");
const bank_accounts_Routes = require("./routes/bankAccounts");
const webhook = require("./routes/webhook");
const transact = require("./routes/transfer");
const transactions = require("./routes/transactions");

// use Cookie
app.use(cookieParser(process.env.JWT_SECRET));

// use Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/create_account", bank_accounts_Routes);
app.use("/api/v1/webhooks", webhook);
app.use("/api/v1/transfers", transact);
app.use("/api/v1/transactions", transactions);

//Error Handling Middleware for routes and interacting with the database
app.use(notFound);
app.use(errorHandlerMiddleware);

// Sequre Connection
knex
  .raw("SELECT 1")
  .then(() => {
    console.log("Connected to the database");
    // Start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process with failure
  });
