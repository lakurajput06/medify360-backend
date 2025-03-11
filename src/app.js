import dotenv from 'dotenv';
dotenv.config();
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import morgan from "morgan";
import patientRouter from './routes/patient.route.js';
import medHisrouter from './routes/medicalHistory.route.js';
import hospitalRouter from './routes/hospital.route.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors({
    origin: '*',
    credentials: true,
    methods: ["GET","POST","PUT","DELETE"],
}));

app.use(cookieParser());

app.use(morgan('dev'));


// routes of 6 module
app.use('/api/patient' , patientRouter);
app.use('/api/medical-history',medHisrouter);
// app.use('/api/doctor' , doctorRouter);
app.use('/api/hospital' , hospitalRouter);
// app.use('/api/booking' , bookingRouter);
// app.use('/api/payments' , paymentRouter);

app.all("*",(req,res)=>{
    res.status(404).send("404\nPage not found");
});

// app.use(errorMiddleware);

export default app;