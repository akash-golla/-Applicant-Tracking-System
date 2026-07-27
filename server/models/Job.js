import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    salary: { type: String, default: 'Not disclosed' },
    experience: { type: String, required: true },
    requiredSkills: [{ type: String, trim: true }],
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recruiter',
      required: true,
    },
    status: { type: String, enum: ['active', 'archived', 'closed'], default: 'active' },
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
