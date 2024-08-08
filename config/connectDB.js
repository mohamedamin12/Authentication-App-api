const mongoose = require('mongoose');
const url = process.env.MONGO_URI
const connectToDB = async() => {
  try {
    await mongoose.connect(url);
    console.log('connected to db');
  } catch (error) {
    console.log(error)
  }
} 

module.exports = connectToDB;