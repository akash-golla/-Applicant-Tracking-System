import mongoose from 'mongoose';

const aiAnalysisSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    skills: [{ type: String, trim: true }],
    experience: { type: String, default: '' },
    education: { type: String, default: '' },
    matchScore: { type: Number, default: 0 },
    missingSkills: [{ type: String, trim: true }],
    summary: { type: String, default: '' },
    semanticMatch: [{ type: String, trim: true }],
    source: { type: String, default: 'heuristic' },
    extractedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

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
    aiAnalysis: { type: aiAnalysisSchema, default: null },
    status: {
      type: String,
      enum: ['applied', 'screening', 'interview', 'offered', 'rejected'],
      default: 'applied',
    },
  },
  { timestamps: true }
);

applicationSchema.index({ applicantId: 1, jobId: 1 }, { unique: true });
applicationSchema.index({ jobId: 1, status: 1 });
applicationSchema.index({ aiScore: -1 });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
