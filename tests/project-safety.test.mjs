import assert from 'node:assert/strict'
import test from 'node:test'
import { isRestrictedGithubProject } from '../src/lib/projectSafety.ts'

const project = (overrides = {}) => ({
  fullName: 'example/safe-tool',
  description: 'A normal developer utility.',
  topics: ['developer-tools'],
  ...overrides,
})

test('blocks restricted signals from name, description, and topics', () => {
  assert.equal(isRestrictedGithubProject(project({ fullName: 'demo/game-aimbot' })), true)
  assert.equal(
    isRestrictedGithubProject(project({ description: 'Credential stealer builder' })),
    true,
  )
  assert.equal(isRestrictedGithubProject(project({ topics: ['roblox-executor'] })), true)
  assert.equal(
    isRestrictedGithubProject(project({ fullName: 'demo/Minecraft-Client-Cheat' })),
    true,
  )
  assert.equal(
    isRestrictedGithubProject(project({ description: 'Flash USDT fake balance sender' })),
    true,
  )
  assert.equal(isRestrictedGithubProject(project({ topics: ['mod-menu'] })), true)
})

test('allows ordinary projects and avoids partial-word false positives', () => {
  assert.equal(isRestrictedGithubProject(project()), false)
  assert.equal(
    isRestrictedGithubProject(project({ description: 'A crackle texture generator' })),
    false,
  )
  assert.equal(
    isRestrictedGithubProject(project({ description: 'A command-line cheat sheet' })),
    false,
  )
  assert.equal(isRestrictedGithubProject(project({ description: 'A hackathon toolkit' })), false)
})
