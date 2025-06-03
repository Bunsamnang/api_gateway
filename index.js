import express from "express";
import httpProxy from "http-proxy";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const app = express();

const PORT = 4000;

//USE PROXY SERVER TO REDIRECT THE INCOMMING REQUEST
const proxy = httpProxy.createProxyServer();

function authToken(req, res, next) {
  console.log(req.headers.authorization);
  const header = req?.headers.authorization;
  const token = header && header.split(" ")[1];

  if (token == null) return res.status(401).json("Please send token");

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json("Invalid token", err);
    req.user = user;
    next();
  });
}

function authRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json("Unauthorized");
    }
    next();
  };
}

//REDIRECT TO THE STUDENT MICROSERVICE
app.use("/student", authToken, authRole("student"), (req, res) => {
  console.log("INSIDE API GATEWAY STUDENT ROUTE");
  proxy.web(req, res, { target: "http://13.220.210.1:5001" });
});

//REDIRECT TO THE TEACHER MICROSERVICE
app.use("/teacher", authToken, authRole("teacher"), (req, res) => {
  console.log("INSIDE API GATEWAY TEACHER ROUTE");
  proxy.web(req, res, { target: "http://3.86.100.196:5002" });
});

//REDIRECT TO THE LOGIN(Authentication) MICROSERVICE
app.use("/auth", (req, res) => {
  proxy.web(req, res, { target: "http://localhost:5003" });
});

app.listen(PORT, () => {
  console.log(`API Gateway Service is running on PORT NO : ${PORT}`);
});
