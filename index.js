import express from "express";
import httpProxy from "http-proxy";

const app = express();

//USE PROXY SERVER TO REDIRECT THE INCOMMING REQUEST
const proxy = httpProxy.createProxyServer();

//REDIRECT TO THE STUDENT MICROSERVICE
app.use("/student", (req, res) => {
  console.log("INSIDE API GATEWAY STUDENT ROUTE");
  proxy.web(req, res, { target: "http://13.220.210.1:5001" });
});

//REDIRECT TO THE TEACHER MICROSERVICE
app.use("/teacher", (req, res) => {
  console.log("INSIDE API GATEWAY TEACHER ROUTE");
  proxy.web(req, res, { target: "http://3.86.100.196:5002" });
});

app.listen(4000, () => {
  console.log("API Gateway Service is running on PORT NO : ", 4000);
});
