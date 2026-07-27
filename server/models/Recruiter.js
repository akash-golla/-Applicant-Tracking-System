import mongoose from 'mongoose';

const recruiterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    company: { type: String, required: true, trim: true },
    role: { type: String, default: 'recruiter' },
  },
  { timestamps: true }
);

const Recruiter = mongoose.model('Recruiter', recruiterSchema);
export default Recruiter;
