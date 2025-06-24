// 🧪 Скрипт для швидкого тестування системи збереження результатів
// Виконайте цей код в консолі браузера на сторінці додатку

(async function validateTestResultsSystem() {
  console.log('🚀 Starting Test Results System Validation...\n');
  
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
  
  // Test 1: Check if Firebase is available
  test('Firebase availability', typeof window.firebase !== 'undefined' || typeof window.getFirestore !== 'undefined');
  
  // Test 2: Check localStorage functionality
  const testKey = 'test_results_validation';
  const testValue = { timestamp: Date.now(), test: true };
  
  try {
    localStorage.setItem(testKey, JSON.stringify(testValue));
    const retrieved = JSON.parse(localStorage.getItem(testKey) || '{}');
    test('localStorage functionality', retrieved.test === true);
    localStorage.removeItem(testKey);
  } catch (error) {
    test('localStorage functionality', false, `Error: ${error.message}`);
  }
  
  // Test 3: Check if required functions exist
  test('survey.utils availability', typeof window.surveyUtils !== 'undefined' || typeof surveyUtils !== 'undefined');
  
  // Test 4: Check current page structure
  const isMagicalQuestPage = window.location.pathname.includes('magical-quest');
  const isAdminPage = window.location.pathname.includes('admin');
  test('On supported page', isMagicalQuestPage || isAdminPage, window.location.pathname);
  
  // Test 5: Check for Debug Logger component
  const debugLoggerExists = document.querySelector('[data-testid="debug-logger"]') !== null;
  test('Debug Logger component', debugLoggerExists);
  
  // Test 6: Check console for test results logs
  const originalLog = console.log;
  let logCount = 0;
  console.log = function(...args) {
    if (args.some(arg => typeof arg === 'string' && (
      arg.includes('TestResultsService') || 
      arg.includes('useSaveTestResult') ||
      arg.includes('Firebase connection')
    ))) {
      logCount++;
    }
    originalLog.apply(console, args);
  };
  
  // Restore original console.log after a short delay
  setTimeout(() => {
    console.log = originalLog;
    test('Test results logging active', logCount > 0, `Found ${logCount} relevant log entries`);
    
    console.log(`\n📊 Validation Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All tests passed! System is ready for testing.');
    } else {
      console.log('⚠️ Some tests failed. Check the details above.');
    }
    
    console.log('\n🧪 To test the full system:');
    console.log('1. Go to /magical-quest and complete the test');
    console.log('2. Check console logs during the process');
    console.log('3. Verify results in /admin/test-results');
    console.log('4. Use the Debug Logger for detailed monitoring');
  }, 1000);
  
  // Test 7: Check if we can access Firebase config
  try {
    const firebaseConfig = localStorage.getItem('firebase:config') || 'Firebase config not in localStorage';
    test('Firebase config accessible', firebaseConfig !== 'Firebase config not in localStorage');
  } catch (error) {
    test('Firebase config accessible', false, `Error: ${error.message}`);
  }
  
  // Test 8: Test metadata functions if available
  if (typeof surveyUtils !== 'undefined') {
    try {
      surveyUtils.saveUserMetadata('test-user', { age: 16, grade: '10-А' });
      const metadata = surveyUtils.getUserMetadata('test-user');
      test('Metadata functions', metadata && metadata.age === 16);
      surveyUtils.clearUserMetadata('test-user');
    } catch (error) {
      test('Metadata functions', false, `Error: ${error.message}`);
    }
  }
  
  console.log('\n🔍 Current page analysis:');
  console.log(`📍 URL: ${window.location.href}`);
  console.log(`📱 User Agent: ${navigator.userAgent.substring(0, 50)}...`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  
})();

// 🎯 Quick access functions for manual testing
window.testResultsQuickTest = {
  // Generate test data
  generateTestData() {
    return {
      userId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userType: 'student',
      questionnaireId: 'test-questionnaire',
      questionnaireName: 'Test Questionnaire',
      responses: [
        { questionId: 'q1', answerId: 'answer1' },
        { questionId: 'q2', answerId: 'answer2' }
      ],
      matches: [
        {
          title: 'Test Career',
          matchPercentage: 85,
          description: 'Test career description',
          fitReasons: ['Reason 1', 'Reason 2'],
          strongSkills: ['Skill 1', 'Skill 2']
        }
      ],
      metadata: {
        completionTime: 300,
        userAge: 16,
        additionalData: {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }
      }
    };
  },
  
  // Test localStorage operations
  testLocalStorage() {
    console.log('🧪 Testing localStorage operations...');
    const testData = this.generateTestData();
    
    // Test saving
    localStorage.setItem('test_survey_responses', JSON.stringify(testData.responses));
    localStorage.setItem('test_survey_matches', JSON.stringify(testData.matches));
    localStorage.setItem('test_survey_metadata', JSON.stringify(testData.metadata));
    
    console.log('✅ Data saved to localStorage');
    console.log('📊 Saved data:', {
      responses: testData.responses,
      matches: testData.matches,
      metadata: testData.metadata
    });
    
    // Test loading
    const loadedResponses = JSON.parse(localStorage.getItem('test_survey_responses') || '[]');
    const loadedMatches = JSON.parse(localStorage.getItem('test_survey_matches') || '[]');
    const loadedMetadata = JSON.parse(localStorage.getItem('test_survey_metadata') || '{}');
    
    console.log('📂 Loaded data:', {
      responses: loadedResponses,
      matches: loadedMatches,
      metadata: loadedMetadata
    });
    
    // Cleanup
    localStorage.removeItem('test_survey_responses');
    localStorage.removeItem('test_survey_matches');
    localStorage.removeItem('test_survey_metadata');
    
    console.log('🧹 Test data cleaned up');
  },
  
  // Check current survey state
  checkSurveyState() {
    console.log('🔍 Checking current survey state...');
    const responses = localStorage.getItem('surveyResponses');
    const matches = localStorage.getItem('surveyMatches');
    const metadata = localStorage.getItem('userMetadata');
    
    console.log('📊 Current survey data in localStorage:');
    console.log('- Responses:', responses ? JSON.parse(responses) : 'No data');
    console.log('- Matches:', matches ? JSON.parse(matches) : 'No data');
    console.log('- Metadata:', metadata ? JSON.parse(metadata) : 'No data');
  }
};

console.log('🎯 Quick test functions available:');
console.log('- testResultsQuickTest.generateTestData() - Generate test data');
console.log('- testResultsQuickTest.testLocalStorage() - Test localStorage operations');
console.log('- testResultsQuickTest.checkSurveyState() - Check current survey state');
