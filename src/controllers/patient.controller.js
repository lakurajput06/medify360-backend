import Patient from "../models/patient.model.js";
import { sendOTPEmail } from "../utils/sendOTP.utils.js";
import jwt from "jsonwebtoken";
import cloudinary from 'cloudinary';
import fs from 'fs/promises';



const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const cookieOptions = {
    maxAge: 7*24*60*60*1000 , // 7 days
    httpOnly: true,
    secure: true
};

const register = async(req,res,next)=>{
    const { fullName, email, gender, age } = req.body;
    if (!fullName || !email || !gender || !age)
    return res.status(400).json({ error: "All fields are required" });

    try {
        
        const existingPatient = await Patient.findOne({ email });
        if (existingPatient){
            return res.status(400).json({ error: "Email already registered" });
        }

        const otp = generateOTP();
        const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
        const patient = await Patient.create({
            fullName,
            email,
            gender,
            idProof:{
                public_id: "",
                secure_url: ''
            },
            age,
            otp,
            otpExpiration,
        });

        // Upload ID proof to Cloudinary
        if (req.file) {
            const uploadedFile = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: "patients_id_proof",
            });
            if(uploadedFile){
                patient.idProof.public_id = uploadedFile.public_id;
                patient.idProof.secure_url = uploadedFile.secure_url;

                fs.rm(`patient_id_proof/${req.file.filename}`);
            }
        } else {
            return res.status(400).json({ error: "ID proof is required" });
        }

        await patient.save();
        await sendOTPEmail(email, otp);

        res.status(200).json({ message: "Patient registered successfully. Please verify OTP", email });
    } catch (error) {
        res.status(500).json({ error });
    }
}

const verifyOTP = async(req,res,next)=>{
    const { email, otp } = req.body;
    if (!email || !otp){
        return res.status(400).json({ error: "Email and OTP are required" });
    }

    try {
        const patient = await Patient.findOne({ email });
        if (!patient) return res.status(404).json({ error: "Patient not found" });

        if (patient.otp !== otp || patient.otpExpiration < Date.now()) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        patient.isVerified = true;
        patient.otp = null;
        patient.otpExpiration = null;
        await patient.save();

        const token = jwt.sign({ userId: patient._id }, 
            process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.cookie('token' , token, cookieOptions);

        res.json({ message: "Login successful", patient });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const login = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
  
    try {
      const patient = await Patient.findOne({ email });
      if (!patient) return res.status(404).json({ error: "Patient not found" });
  
      const otp = generateOTP();
      patient.otp = otp;
      patient.otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
  
      await patient.save();
      await sendOTPEmail(email, otp);
  
      res.json({ message: "OTP sent to your email for login" });
    } catch (error) {
      res.status(500).json({ error: "Error generating OTP" });
    }
  };
  
const logout = async(req,res,next)=>{
    res.cookie('token',null,{
        httpOnly: true,
        secure: true,
        maxAge: 0
    });

    return res.status(200).json({message: "Logged out successfully"});
}

const patientProfile = async(req,res,next)=>{
    try {
        const { patientId } = req.params; // Extract patient ID from request params
        // console.log("patientId", patientId);
        // Fetch patient details and populate moodLogs & medicalHistory
        const patient = await Patient.findById(patientId)
          .select("-otp -otpExpiration"); // Exclude OTP fields
    
        if (!patient) {
          return res.status(404).json({ error: "Patient not found" });
        }
    
        res.json({
          success: true,
          patient,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export{register,
    verifyOTP,
    login,
    logout,
    patientProfile
};