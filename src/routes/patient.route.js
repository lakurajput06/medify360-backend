import {Router} from 'express';
import { login, logout, patientProfile, register } from '../controllers/patient.controller.js';

const patientRouter = Router()

patientRouter.post('/register',register);
patientRouter.post('/login',login);
patientRouter.get('/logout',logout);
patientRouter.get('/patient-profile', patientProfile);
// userRouter.put("/update/:id",updateProfile);

export default patientRouter;