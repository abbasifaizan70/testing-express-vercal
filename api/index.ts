import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';
import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors({
  origin: '*',  // Replace '*' with your frontend URL in production, e.g., 'https://your-frontend-domain.com'
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

// Existing endpoint to save stage data
app.post('/api/saveStage', async (req, res) => {
  const { employeeName, stage, choice } = req.body;
  try {
    const employee = await Employee.findOne({ name: employeeName });
    if (!employee) {
      return res.status(400).json({ error: 'Employee not found.' });
    }
    employee[`stage${stage}`] = choice;
    await employee.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New endpoint to update the department of an employee
app.post('/api/updateDepartment', async (req, res) => {
  const { employeeName, newDepartment } = req.body;
  try {
    const employee = await Employee.findOne({ name: employeeName });
    if (!employee) {
      return res.status(400).json({ error: 'Employee not found.' });
    }
    employee.department = newDepartment;
    await employee.save();
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Apply CORS middleware
  const corsMiddleware = cors({
    origin: '*',  // Replace '*' with your frontend URL in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  corsMiddleware(req, res, () => {
    if (req.method === 'POST') {
      if (req.url === '/api/saveStage') {
        app(req, res);
      } else if (req.url === '/api/updateDepartment') {
        app(req, res);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  });
}
