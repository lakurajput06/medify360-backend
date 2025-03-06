import {Router} from 'express';
import { login, logout, patientProfile, register, verifyOTP } from '../controllers/patient.controller.js';
import upload from '../middlewares/multer.middleware.js';

const patientRouter = Router()

patientRouter.post('/register',upload.single("idProof"), register);
patientRouter.post("/verify-otp", verifyOTP);
patientRouter.post('/login',login);
patientRouter.get('/logout',logout);
patientRouter.get('/patient-profile', patientProfile);
// userRouter.put("/update/:id",updateProfile);

export default patientRouter;