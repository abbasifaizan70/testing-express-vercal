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

const mongoUri = "mongodb://deemaadle:flWrY9jrz7LkVFGN@ac-6pbvigq-shard-00-00.i87homf.mongodb.net:27017,ac-6pbvigq-shard-00-01.i87homf.mongodb.net:27017,ac-6pbvigq-shard-00-02.i87homf.mongodb.net:27017/Survey?ssl=true&replicaSet=atlas-wzoqyo-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

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

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Apply CORS middleware
  const corsMiddleware = cors({
    origin: '*',  // Replace '*' with your frontend URL in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  corsMiddleware(req, res, async () => {
    const { employeeName, newDepartment } = req.body;

    if (!employeeName || !newDepartment) {
      return res.status(400).send({ success: false, error: "Missing employeeName or newDepartment in request body" });
    }

    try {
      const employee = await Employee.findOne({ name: employeeName });
      if (!employee) {
        return res.status(400).json({ error: 'Employee not found.' });
      }

      employee.department = newDepartment;
      await employee.save();
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
