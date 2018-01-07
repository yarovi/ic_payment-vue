import { Role } from 'testcafe';

const adminRole = Role('http://localhost/icpayment/app/login', async t => {
  await t
  .typeText('#user-input', 'demo')
  .typeText('#password-input', 'demo')
  .click('#btn-send-credentials');
})

export const admin = adminRole