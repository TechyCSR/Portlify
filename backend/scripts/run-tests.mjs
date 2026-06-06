import { readdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const testDir = join(root, 'test')
const files = readdirSync(testDir)
    .filter((name) => name.endsWith('.test.js'))
    .map((name) => join(testDir, name))
    .sort()

if (files.length === 0) {
    console.error('No test files found in backend/test/')
    process.exit(1)
}

const result = spawnSync(process.execPath, ['--test', ...files], { stdio: 'inherit' })
process.exit(result.status ?? 1)