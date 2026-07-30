import test from 'node:test';
import assert from 'node:assert/strict';

test('resume analysis controller imports successfully', async () => {
  const mod = await import('../controllers/aiController.js');
  assert.equal(typeof mod.analyzeResume, 'function');
});
