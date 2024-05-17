const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoUri = "mongodb://abbasifaizan1997:Oj6JbCQ9dG5C95EG@ac-yiqvbec-shard-00-00.uis11st.mongodb.net:27017,ac-yiqvbec-shard-00-01.uis11st.mongodb.net:27017,ac-yiqvbec-shard-00-02.uis11st.mongodb.net:27017/newapp?ssl=true&replicaSet=atlas-10nig4-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,  // Increase timeout to 30 seconds
})
.then(() => {
  console.log("MongoDB connection successful");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});

const employeeSchema = new mongoose.Schema({
  name: String,
  department: String,
  stage1: String,
  stage2: String,
  stage3: String,
  stage4: String,
});

const Employee = mongoose.model('Employee', employeeSchema);

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
});

app.get('/about', (req, res) => {
  res.send('This is my about route..... ')
});

// Export the Express API
module.exports = app;
