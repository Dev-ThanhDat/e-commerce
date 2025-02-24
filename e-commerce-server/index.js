const express = require('express');
const { dbConnect } = require('./config/connect.config');
const initRoutes = require('./routes/index');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.CORS_ORIGIN_ADMIN, process.env.CORS_ORIGIN_USER],
    credentials: true
  })
);

app.use(cookieParser());

dbConnect();
initRoutes(app);

app.listen(port, () => {
  console.log(`Server đang chạy trên cổng ${port}`);
});
