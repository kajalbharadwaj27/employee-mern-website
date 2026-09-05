import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name:{type:String,required:true,trim:true},
  email:{type:String,required:true,trim:true,lowercase:true},
  department:{type:String,required:true,trim:true},
  position:{type:String,required:true,trim:true}
},{timestamps:true});

export default mongoose.model("Employee",employeeSchema);
