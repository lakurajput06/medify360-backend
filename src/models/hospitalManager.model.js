import { Schema, model } from 'mongoose';

const hospitalManagerSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, 'Please enter a valid phone number'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
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
  hospitalName: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  totalBeds: {
    type: Number,
    required: true,
    min: [1, 'Hospital must have at least one bed'],
  },
  availableBeds: {
    type: Number,
    required: true,
    min: [0, 'Available beds cannot be negative'],
    default: 0,
  },
  ambulanceCount: {
    type: Number,
    required: true,
    min: [0, 'Ambulance count cannot be negative'],
    default: 0, // Initial number of ambulances
  },
  doctors: [{
    type: Schema.Types.ObjectId,
    ref: 'Doctor', // Referencing the Doctor model
  }],
  departments: [{
    type: String,
    enum: ['Emergency', 'Pediatrics', 'Cardiology', 'Neurology', 'Orthopedics', 'Other'],
  }],
  shiftSchedule: [{
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor', // Referencing the Doctor model
    },
    shiftTime: {
      type: String,
      required: true, // Example: "9 AM - 5 PM"
    },
    date: {
      type: Date,
      required: true,
    },
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  rooms: {
    type: Map,
    of: {
      type: Number,
      min: [0, 'Room count cannot be negative'],
      default: 0, // Initial available room count
    },
    default: {
      'General Ward': 0,
      'Emergency Rooms': 0,
      'ICU': 0,
      'Pediatric Ward': 0,
      'Maternity Ward': 0,
      'Neonatal ICU': 0,
      'Surgical Ward': 0,
      'Orthopedic Ward': 0,
      'Oncology Ward': 0,
      'Cardiology Ward': 0,
      'Geriatric Ward': 0,
      'Isolation Ward': 0,
      'Psychiatric Ward': 0,
      'Dialysis Ward': 0,
      'Respiratory Ward': 0,
      'Burn Ward': 0,
      'Rehabilitation Ward': 0,
      'Day Care Unit': 0,
      'Outpatient Ward': 0,
    },
  },
  subscription: {
    type: Schema.Types.ObjectId,
    ref: 'Subscription', // Reference to the Subscription model
    required: true,
  },
}, {
  timestamps: true, // Automatically handles createdAt and updatedAt
});

const HospitalManager = model('HospitalManager', hospitalManagerSchema);

export default HospitalManager;
