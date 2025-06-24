#!/usr/bin/env node

/**
 * 🚀 Quick validation script for Test Results System
 * Run this to check basic functionality and file structure
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Test Results System Validation\n');

const projectRoot = process.cwd();
let passed = 0;
let total = 0;

function test(name, condition, details = '') {
  total++;
  if (condition) {
    console.log(`✅ ${name}${details ? ` - ${details}` : ''}`);
    passed++;
  } else {
    console.log(`❌ ${name}${details ? ` - ${details}` : ''}`);
  }
}

function fileExists(filePath) {
  return fs.existsSync(path.join(projectRoot, filePath));
}

function checkFileContent(filePath, searchString) {
  try {
    const content = fs.readFileSync(path.join(projectRoot, filePath), 'utf8');
    return content.includes(searchString);
  } catch {
    return false;
  }
}

console.log('📁 Checking file structure...\n');

// Check main service files
test('test-results.service.ts exists', fileExists('src/services/test-results.service.ts'));
test('survey.utils.ts exists', fileExists('src/utils/survey.utils.ts'));
test('firebase-test.utils.ts exists', fileExists('src/utils/firebase-test.utils.ts'));

// Check components
test('TestCompletion.tsx exists', fileExists('src/components/TestCompletion.tsx'));
test('TestResultsAdmin.tsx exists', fileExists('src/components/TestResultsAdmin.tsx'));
test('UserTypeSelection.tsx exists', fileExists('src/components/UserTypeSelection.tsx'));
test('DebugLogger.tsx exists', fileExists('src/components/DebugLogger.tsx'));

// Check hooks
test('useQuestions.ts exists', fileExists('src/hooks/useQuestions.ts'));

// Check types
test('survey.ts types exist', fileExists('src/types/survey.ts'));

// Check pages
test('magical-quest results page exists', fileExists('src/app/magical-quest/results/page.tsx'));
test('admin test-results page exists', fileExists('src/app/admin/test-results/page.tsx'));

// Check documentation
test('README_TEST_RESULTS.md exists', fileExists('README_TEST_RESULTS.md'));
test('TESTING_GUIDE.md exists', fileExists('TESTING_GUIDE.md'));
test('INTEGRATION_EXAMPLE.md exists', fileExists('INTEGRATION_EXAMPLE.md'));
test('FINAL_IMPLEMENTATION_STATUS.md exists', fileExists('FINAL_IMPLEMENTATION_STATUS.md'));

console.log('\n🔍 Checking file content...\n');

// Check key functionality in files
test('test-results service has saveTestResult', checkFileContent('src/services/test-results.service.ts', 'saveTestResult'));
test('test-results service has getTestResults', checkFileContent('src/services/test-results.service.ts', 'getTestResults'));
test('test-results service has getTestResultsSummary', checkFileContent('src/services/test-results.service.ts', 'getTestResultsSummary'));

test('survey utils has saveUserMetadata', checkFileContent('src/utils/survey.utils.ts', 'saveUserMetadata'));
test('survey utils has startSurvey', checkFileContent('src/utils/survey.utils.ts', 'startSurvey'));

test('useQuestions has useSaveTestResult', checkFileContent('src/hooks/useQuestions.ts', 'useSaveTestResult'));
test('useQuestions has useTestResults', checkFileContent('src/hooks/useQuestions.ts', 'useTestResults'));

test('magical-quest results has useSaveTestResult hook', checkFileContent('src/app/magical-quest/results/page.tsx', 'useSaveTestResult'));
test('magical-quest results has logging', checkFileContent('src/app/magical-quest/results/page.tsx', 'console.log'));

console.log('\n🔍 Checking package.json dependencies...\n');

try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
  
  test('Firebase dependency exists', packageJson.dependencies?.firebase || packageJson.dependencies?.['@firebase/app']);
  test('React dependency exists', packageJson.dependencies?.react);
  test('Next.js dependency exists', packageJson.dependencies?.next);
  test('TypeScript config exists', fileExists('tsconfig.json'));
  
} catch (error) {
  test('package.json readable', false, error.message);
}

console.log('\n📊 Checking Firebase configuration...\n');

test('Firebase config file exists', fileExists('src/config/firebase.ts'));
test('Firebase lib file exists', fileExists('src/lib/firebase.ts'));

if (fileExists('src/config/firebase.ts')) {
  test('Firebase config has app initialization', checkFileContent('src/config/firebase.ts', 'initializeApp'));
  test('Firebase config has Firestore', checkFileContent('src/config/firebase.ts', 'getFirestore'));
}

console.log('\n🎯 Integration checks...\n');

// Check if admin page links to test results
test('Admin page links to test-results', checkFileContent('src/app/admin/page.tsx', 'test-results'));

// Check if magical quest results page has all necessary imports
test('Magical quest has useSaveTestResult import', checkFileContent('src/app/magical-quest/results/page.tsx', 'useSaveTestResult'));
test('Magical quest has DebugLogger import', checkFileContent('src/app/magical-quest/results/page.tsx', 'DebugLogger'));

console.log(`\n📈 Validation Results: ${passed}/${total} checks passed\n`);

if (passed === total) {
  console.log('🎉 All checks passed! System appears to be properly implemented.\n');
  console.log('🚀 Next steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Open: http://localhost:3000/magical-quest');
  console.log('3. Complete a test and check console logs');
  console.log('4. Check admin panel: http://localhost:3000/admin/test-results');
  console.log('5. Use browser validation script for runtime checks');
} else {
  console.log('⚠️ Some checks failed. Please review the missing files or functionality.\n');
  console.log('🔧 Common issues:');
  console.log('- Missing files: Create the missing files listed above');
  console.log('- Content issues: Check file content matches expected functionality');
  console.log('- Dependencies: Ensure all required packages are installed');
}

console.log('\n📋 Quick commands:');
console.log('- npm install                    # Install dependencies');
console.log('- npm run dev                    # Start development server');
console.log('- npm run build                  # Build for production');
console.log('- node validate-system.js        # Run this validation again');

console.log('\n📖 Documentation:');
console.log('- README_TEST_RESULTS.md         # System overview');
console.log('- TESTING_GUIDE.md               # Testing instructions');
console.log('- INTEGRATION_EXAMPLE.md         # Integration examples');
console.log('- FINAL_IMPLEMENTATION_STATUS.md # Complete status report');
