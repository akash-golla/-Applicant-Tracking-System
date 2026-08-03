import { body, validationResult } from 'express-validator';

export const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    success: false,
    message: errors.array()[0].msg,
  });
};

export const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['applicant', 'recruiter']).withMessage('Role must be applicant or recruiter'),
  body('company').custom((value, { req }) => {
    if (req.body.role === 'recruiter' && (!value || String(value).trim().length < 2)) {
      throw new Error('Company is required for recruiters');
    }
    return true;
  }),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  body('role').optional().isIn(['applicant', 'recruiter']).withMessage('Role must be applicant or recruiter'),
];

export const createJobValidation = [
  body('title').trim().isLength({ min: 2 }).withMessage('Title is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('company').trim().isLength({ min: 2 }).withMessage('Company is required'),
  body('location').trim().isLength({ min: 2 }).withMessage('Location is required'),
  body('experience').trim().isLength({ min: 2 }).withMessage('Experience is required'),
];

export const updateJobValidation = createJobValidation;

export const createApplicationValidation = [
  body('jobId').notEmpty().withMessage('Job ID is required'),
];

export const updateStatusValidation = [
  body('status').isIn(['applied', 'screening', 'interview', 'offered', 'rejected']).withMessage('Invalid application status'),
];

export const interviewEmailValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('message').trim().isLength({ min: 5 }).withMessage('Message must be at least 5 characters'),
];
