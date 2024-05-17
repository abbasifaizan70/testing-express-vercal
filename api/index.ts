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

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Apply CORS middleware
  const corsMiddleware = cors({
    origin: '*',  // Replace '*' with your frontend URL in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  corsMiddleware(req, res, async () => {
    const { employeeName, department } = req.query;

    if (!employeeName || !department) {
      return res.status(400).send({ success: false, error: "Missing employeeName or department query parameter" });
    }

    try {
      const employee = new Employee({ name: employeeName, department });
      await employee.save();
      res.send({ success: true });
    } catch (err: any) {
      res.status(500).send({ success: false, error: err.message });
    }
  });
}
