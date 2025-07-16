const mongoose = require('mongoose');

const {
  MONGO_URI,
  MONGODB_USERNAME,
  MONGODB_PASSWORD,
  MONGODB_INITDB_DATABASE,
} = process.env;

console.log(`config/database:  MONGO_URI:  [${MONGO_URI}]`);
console.log(`config/database:  MONGODB_USERNAME:  [${MONGODB_USERNAME}]`);
console.log(
  `config/database:  MONGODB_INITDB_DATABASE:  [${MONGODB_INITDB_DATABASE}]`
);

exports.connect = () => {
  // Connect to MongoDB
  mongoose
    .connect(MONGO_URI, {
      user: MONGODB_USERNAME,
      pass: MONGODB_PASSWORD,
      dbName: MONGODB_INITDB_DATABASE,
    })
    .then(() => {
      console.log('MongoDB connected successfully');
    })
    .catch((err) => {
      console.log(`MongoDB connection error:  [${err}]`);
      process.exit(1);
    });
};
