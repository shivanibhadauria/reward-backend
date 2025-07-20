const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const contact = require("./routes/contact");
const adminAuthRoutes = require('./routes/adminAuth');

dotenv.config();
require("./connection/connection");


app.use(cors(
  {
    origin: ["https://whatsappmsgsender-3lyq.vercel.app",
      "http://localhost:3000"
    ],
  credentials: true
  }
));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.use("/api/p1", contact);
app.use("/api/contacts", contact); //
app.use('/api/admin' , adminAuthRoutes)


app.listen(3001, () => {
  console.log("Server started on port 3001");
});
