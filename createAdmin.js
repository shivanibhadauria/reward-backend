const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const Admin = require("./models/admin"); // make sure path is correct

// Connect to your MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// Function to create an admin
async function createAdmin() {
    const username = "shivani";
  const email = "shivani@gmail.com"; // use any email
  const password = "shivani";       // use a password you remember

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new Admin({
    username,
    email,
    password: hashedPassword,
  });

  await admin.save();
  console.log("✅ Admin created successfully!");
  process.exit(); // Exit the script
}

createAdmin();
