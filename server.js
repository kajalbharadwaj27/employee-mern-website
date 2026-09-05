import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Employee from "./models/Employee.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/employeeDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.get("/api/employees", async (req,res) => {
  try { res.json(await Employee.find().sort({createdAt:-1})); }
  catch { res.status(500).json({message:"Could not fetch employees"}); }
});

app.post("/api/employees", async (req,res) => {
  try { res.status(201).json(await Employee.create(req.body)); }
  catch (e) { res.status(400).json({message:e.message}); }
});

app.put("/api/employees/:id", async (req,res) => {
  try {
    const employee=await Employee.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    if(!employee) return res.status(404).json({message:"Employee not found"});
    res.json(employee);
  } catch(e) { res.status(400).json({message:e.message}); }
});

app.delete("/api/employees/:id", async (req,res) => {
  try {
    const employee=await Employee.findByIdAndDelete(req.params.id);
    if(!employee) return res.status(404).json({message:"Employee not found"});
    res.json({message:"Employee deleted"});
  } catch { res.status(400).json({message:"Could not delete employee"}); }
});

app.listen(process.env.PORT || 5000, () => console.log("Server running on port 5000"));
