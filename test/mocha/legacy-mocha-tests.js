const legacyMochaTests = [
  'app/scripts/controllers/app-metadata.test.ts',
  'app/scripts/controllers/metametrics.test.js',
  'app/scripts/controllers/swaps.test.js',
  'app/scripts/detect-multiple-instances.test.js',
  'app/scripts/metamask-controller.actions.test.js',
]

const legacyMochaTestCoveredFiles = [
  'app/scripts/controllers/app-metadata.ts',
  'app/scripts/controllers/metametrics.js',
  'app/scripts/controllers/swaps.js',
  'app/scripts/detect-multiple-instances.js',
  // Intentionally omitted because it's partially covered by Jest tests as well
  // Lets consider the Jest coverage as the authority on what is covered here, since we'll be
  // migrating these tests to Jest eventually.
  // 'app/scripts/metamask-controller.js'
]

module.exports = {
  legacyMochaTests,
  legacyMochaTestCoveredFiles,
}
