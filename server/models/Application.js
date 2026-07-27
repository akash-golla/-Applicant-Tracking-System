import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Applicant',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    resumeURL: { type: String, default: '' },
    aiScore: { type: Number, default: 0 },
    aiSummary: { type: String, default: '' },
    status: {
      type: String,
      enum: ['applied', 'reviewed', 'shortlisted', 'interviewed', 'rejected', 'hired'],
      default: 'applied',
    },
  },
  { timestamps: true }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;
