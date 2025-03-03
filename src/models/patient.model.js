import { Schema, model } from "mongoose";
const patientSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    idProof: {
      type: String,
      default: null,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiration: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    moodLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mood" }],
  },
  {
    timestamps: true,
  }
);

const Patient = model("Patient", patientSchema);

export default Patient;
