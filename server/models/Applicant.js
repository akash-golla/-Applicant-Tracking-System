import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema(
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
    phone: { type: String, default: '' },
    skills: [{ type: String, trim: true }],
    resumeURL: { type: String, default: '' },
    role: { type: String, default: 'applicant' },
  },
  { timestamps: true }
);

const Applicant = mongoose.model('Applicant', applicantSchema);
export default Applicant;
