// Writes dist/version.json ({ sha, tree, ts }) after the build so Falls City OS can tell which commit a host serves
// (the staging mirror on Dokploy and production on Workers Builds). `tree` is the git tree hash: it is identical for
// the staging commit and the merge commit on main, so production can be verified against what was tested on staging.
import { execFileSync } from 'node:child_process';
import { writeFileSync, existsSync } from 'node:fs';

const git = (...args) => { try { return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return ''; } };
const sha = git('rev-parse', 'HEAD') || process.env.WORKERS_CI_COMMIT_SHA || process.env.SOURCE_COMMIT || '';
const tree = sha ? git('rev-parse', `${sha}^{tree}`) : '';
if (!existsSync('dist')) process.exit(0);
writeFileSync('dist/version.json', JSON.stringify({ sha, tree, ts: new Date().toISOString() }) + '\n');
console.log(`version.json: ${sha.slice(0, 7) || 'unknown'}`);
