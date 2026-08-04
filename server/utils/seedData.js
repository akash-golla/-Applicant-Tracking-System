import bcrypt from 'bcryptjs';
import Recruiter from '../models/Recruiter.js';
import Job from '../models/Job.js';

const DEMO_RECRUITER_EMAIL = 'recruiter@example.com';
const DEMO_RECRUITER_PASSWORD = 'Demo123!';

export const buildDemoJobs = (recruiterId) => [
  {
    title: 'Senior Frontend Engineer',
    description: 'Build polished product experiences and ship UI improvements for our AI recruiting platform.',
    company: 'Acme Labs',
    location: 'Remote • US',
    salary: '$140k-$180k',
    experience: '5+ years',
    requiredSkills: ['React', 'TypeScript', 'UI Design'],
    recruiterId,
    status: 'active',
  },
  {
    title: 'Product Designer',
    description: 'Design intuitive workflows for applicants, recruiters, and hiring teams.',
    company: 'Northstar AI',
    location: 'New York, NY',
    salary: '$110k-$140k',
    experience: '3+ years',
    requiredSkills: ['Figma', 'Design Systems', 'UX Research'],
    recruiterId,
    status: 'active',
  },
  {
    title: 'Machine Learning Engineer',
    description: 'Improve resume understanding, ranking models, and AI-driven hiring insights.',
    company: 'Spark Hire',
    location: 'Austin, TX',
    salary: '$150k-$190k',
    experience: '4+ years',
    requiredSkills: ['Python', 'ML', 'LLMs'],
    recruiterId,
    status: 'active',
  },
];

export const ensureDemoSeedData = async () => {
  try {
    let recruiter = await Recruiter.findOne({ email: DEMO_RECRUITER_EMAIL });

    if (!recruiter) {
      const hashedPassword = await bcrypt.hash(DEMO_RECRUITER_PASSWORD, 10);
      recruiter = await Recruiter.create({
        name: 'Demo Recruiter',
        email: DEMO_RECRUITER_EMAIL,
        password: hashedPassword,
        company: 'Acme Labs',
        role: 'recruiter',
      });
    }

    const existingJobs = await Job.countDocuments({ recruiterId: recruiter._id });
    if (existingJobs > 0) {
      return { created: 0, recruiterId: recruiter._id };
    }

    await Job.insertMany(buildDemoJobs(recruiter._id));
    return { created: 3, recruiterId: recruiter._id };
  } catch (error) {
    console.error('Demo seed failed:', error.message);
    return { created: 0, recruiterId: null };
  }
};
