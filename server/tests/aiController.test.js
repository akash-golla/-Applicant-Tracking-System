import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeApplicationStatus } from '../controllers/applicationController.js';

test('resume analysis controller imports successfully', async () => {
  const mod = await import('../controllers/aiController.js');
  assert.equal(typeof mod.analyzeResume, 'function');
});

test('legacy application statuses normalize to the ATS pipeline', () => {
  assert.equal(normalizeApplicationStatus('reviewed'), 'screening');
  assert.equal(normalizeApplicationStatus('shortlisted'), 'screening');
  assert.equal(normalizeApplicationStatus('interviewed'), 'interview');
  assert.equal(normalizeApplicationStatus('hired'), 'offered');
  assert.equal(normalizeApplicationStatus('rejected'), 'rejected');
});
