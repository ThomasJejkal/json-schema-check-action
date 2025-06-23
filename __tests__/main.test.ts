/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */

import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
//import { InputOptions } from "@actions/core";

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)

// The module being tested should be imported dynamically. This ensures that the
//mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    core.getBooleanInput.mockImplementation((name: string) => {
      if (name === 'validate') return true
      else return name === 'createDiff'
    })

    core.getInput.mockImplementation((name: string) => {
      if (name === 'schemaPath') return 'schema.json'
      return ''
    })

    // Mock the wait function so that it does not actually wait.
    //wait.mockImplementation(() => Promise.resolve('done!'))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })
  it('Sets the schema path', async () => {
    await run()

    // Verify the time output was set.
    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      'message',
      // Simple regex to match a time string in the format HH:MM:SS.
      expect.stringMatching(/^# JSON Schema Check Results/)
    )
  })
})
