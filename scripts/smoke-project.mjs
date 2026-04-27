import { execSync } from 'node:child_process';

execSync('npm run test', { stdio: 'inherit' });
execSync('npm run e2e -- e2e/workbench-smoke.spec.ts', { stdio: 'inherit' });
