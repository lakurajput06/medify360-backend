import { Schema, model } from "mongoose";

const medicalHistorySchema = new Schema(
  {
    patient: { 
        type: Schema.Types.ObjectId, 
        ref: "Patient", 
        required: true 
    },
    diagnosis: { 
        type: String, 
        required: true 
    },
    medications: [String], // List of medicines
    treatmentPlan: String,
    doctor: { 
        type: Schema.Types.ObjectId, 
        ref: "Doctor" 
    }, // Doctor reference
    date: { 
        type: Date, 
        default: Date.now 
    },
  },
  { timestamps: true }
);

const MedicalHistory = model("MedicalHistory", medicalHistorySchema);
export default MedicalHistory;
