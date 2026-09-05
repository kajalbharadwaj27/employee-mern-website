import React,{useEffect,useState} from "react";
const API="http://localhost:5000/api/employees";
const empty={name:"",email:"",department:"",position:""};

export default function App(){
 const [employees,setEmployees]=useState([]);
 const [form,setForm]=useState(empty);
 const [editing,setEditing]=useState(null);
 const [message,setMessage]=useState("");
 const [loading,setLoading]=useState(true);

 const load=async()=>{try{setLoading(true);const r=await fetch(API);setEmployees(await r.json())}catch{setMessage("Cannot connect to backend. Start the server.")}finally{setLoading(false)}};
 useEffect(()=>{load()},[]);

 const validate=()=>{
   if(!form.name.trim()||!form.email.trim()||!form.department.trim()||!form.position.trim()) return "Please fill all fields.";
   if(!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email.";
   return "";
 };

 const submit=async(e)=>{
   e.preventDefault(); const error=validate(); if(error){setMessage(error);return}
   const url=editing?`${API}/${editing}`:API;
   try{
    const r=await fetch(url,{method:editing?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    if(!r.ok) throw new Error();
    setMessage(editing?"Employee updated successfully!":"Employee added successfully!");
    setForm(empty);setEditing(null);load();
   }catch{setMessage("Operation failed. Check the backend and MongoDB.");}
 };

 const edit=(e)=>{setForm({name:e.name,email:e.email,department:e.department,position:e.position});setEditing(e._id);setMessage("Editing employee...");window.scrollTo({top:0,behavior:"smooth"})};
 const remove=async(id)=>{
   if(!confirm("Delete this employee?")) return;
   try{await fetch(`${API}/${id}`,{method:"DELETE"});setMessage("Employee deleted successfully!");load()}catch{setMessage("Delete failed.");}
 };

 return <div>
  <header><div><h1>Employee Management System</h1><p>Full Stack MERN CRUD Application</p></div></header>
  <main>
   <section className="panel">
    <h2>{editing?"Update Employee":"Add New Employee"}</h2>
    {message&&<div className="message">{message}</div>}
    <form onSubmit={submit}>
     <input placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
     <input placeholder="Email Address" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
     <input placeholder="Department" value={form.department} onChange={e=>setForm({...form,department:e.target.value})}/>
     <input placeholder="Position" value={form.position} onChange={e=>setForm({...form,position:e.target.value})}/>
     <div className="buttons"><button type="submit">{editing?"Update Employee":"Add Employee"}</button>{editing&&<button type="button" className="secondary" onClick={()=>{setEditing(null);setForm(empty);setMessage("")}}>Cancel</button>}</div>
    </form>
   </section>
   <section className="panel records">
    <div className="title"><h2>Employee Records</h2><button className="refresh" onClick={load}>Refresh</button></div>
    {loading?<p>Loading records...</p>:employees.length===0?<p className="empty">No employees found. Add your first employee above.</p>:
    <div className="tablewrap"><table><thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Position</th><th>Actions</th></tr></thead>
    <tbody>{employees.map(e=><tr key={e._id}><td>{e.name}</td><td>{e.email}</td><td>{e.department}</td><td>{e.position}</td><td><button className="edit" onClick={()=>edit(e)}>Edit</button><button className="delete" onClick={()=>remove(e._id)}>Delete</button></td></tr>)}</tbody></table></div>}
   </section>
  </main>
  <footer>© 2026 Employee Management System | React + Node.js + Express + MongoDB</footer>
 </div>
}
