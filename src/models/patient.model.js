import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    name :{
        type : String,
        required: true,
        trim: true,
    },
    email: {
        type : String,
        required: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ["patient", "admin"], 
        default: "patient" 
    },
    address: { 
        type: String 
    },
    age: { 
        type: Number 
    },
    gender: { 
        type: String, 
        enum: ["Male", "Female", "Other"] 
    }
},{timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;