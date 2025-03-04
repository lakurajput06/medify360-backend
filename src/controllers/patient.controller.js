import Patient from "../models/patient.model.js";
import { sendOTPEmail } from "../utils/sendOTP.utils.js";


const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

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
            age,
            otp,
            otpExpiration,
        });

        await patient.save();
        await sendOTPEmail(email, otp);

        res.status(200).json({ message: "OTP sent to your email", email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const login = async(req,res,next)=>{
    // code to be written here
}
const logout = async(req,res,next)=>{
    // code to be written here
}
const patientProfile = async(req,res,next)=>{
    // code to be written here
}

export{register,
    login,
    logout,
    patientProfile
};