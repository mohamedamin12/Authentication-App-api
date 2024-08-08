require("dotenv").config();
const express = require("express");
const connectToDB = require("./config/connectDB");
const app = express();
const port = process.env.PORT;
const cors = require("cors")
const cookieParser = require('cookie-parser');
const path = require('path');
const { notFound, errorHandler } = require("./middlewares/error.middleware");

// connect to database
connectToDB();

// adding cors middleware=
app.use(cors({
  origin: "https://localhost:3000",
  credentials: true,
}));

// static files
app.use("/",express.static(path.join(__dirname, "public")));

//  parsing
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/", require("./routes/root"));
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/users", require("./routes/users.route"));

// error handlers
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});