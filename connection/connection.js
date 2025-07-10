// const { error } = require("console");
const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGO_URI;

const connection = async () =>{
    try {
        await mongoose.connect(mongoURI).then(()=>{
            console.log("connected");
        }, (error) =>{
            console.log(error);
        })

    }catch(error){
        console.log(error)

    }
}

connection();
