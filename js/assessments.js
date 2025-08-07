console.log('[assessments.js] SCRIPT LOADED - TOP OF FILE. If you see this, the JS file itself is being fetched and parsed at a basic level.');
// This script will be loaded by index.html.
// We will define a function to initialize the platform.

window.initializeAssessmentsPlatform = function() {
  console.log('[assessments.js] initializeAssessmentsPlatform called.');
  const assessmentRoot = document.getElementById('assessments-root');
  if (!assessmentRoot) {
    console.error('[assessments.js] CRITICAL: Assessments root element #assessments-root not found. Cannot render React app.');
    return;
  }

  if (assessmentRoot.dataset.initialized === 'true') {
    console.log('[assessments.js] Assessments platform already marked as initialized. Exiting.');
    return;
  }
  console.log('[assessments.js] assessmentRoot found:', assessmentRoot);

  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
    console.error('[assessments.js] CRITICAL: React or ReactDOM is not loaded. Cannot render assessments platform.');
    assessmentRoot.innerHTML = '<p style="color:red; text-align:center; padding:20px;">Error: React libraries not loaded. Check script tags in HTML.</p>';
    return;
  }
  console.log('[assessments.js] React and ReactDOM are loaded.');
  
  const { useState, useEffect } = React;
  console.log('[assessments.js] React hooks (useState, useEffect) destructured.');

  // Font Awesome icons will be used directly in JSX as <i className="fas fa-icon-name"></i>

  const TechnicalInterviewPlatform = () => {
    const [userRole, setUserRole] = useState(null);
    const [currentView, setCurrentView] = useState('role-selection');
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [candidateAnswers, setCandidateAnswers] = useState({});
    const [testResults, setTestResults] = useState([]);
    const [timeRemaining, setTimeRemaining] = useState(5400); 
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    const [interviews, setInterviews] = useState([
      {
        id: 1,
        title: 'Senior Frontend Developer Assessment',
        company: 'TechCorp Inc.',
        duration: 90,
        maxScore: 100,
        difficulty: 'Hard',
        createdDate: '2024-03-15',
        status: 'active',
        invitesSent: 25,
        submissions: [
          {
            id: 1,
            candidateName: 'Jane Smith',
            candidateEmail: 'jane.smith@email.com',
            submittedAt: '2024-03-20T14:30:00Z',
            duration: 85,
            score: 87,
            status: 'completed',
            answers: [
              { questionId: 1, type: 'coding', score: 90, timeSpent: 45, attempts: 3, code: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}', testsPassed: 8, totalTests: 10 },
              { questionId: 2, type: 'multiple', score: 80, timeSpent: 2, selectedOption: 2, correct: true }
            ]
          },
          {
            id: 2,
            candidateName: 'John Allen',
            candidateEmail: 'john.allen@email.com',
            submittedAt: '2024-03-19T10:15:00Z',
            duration: 90,
            score: 95,
            status: 'completed',
            answers: [
              { questionId: 1, type: 'coding', score: 100, timeSpent: 38, attempts: 2, code: 'function twoSum(nums, target) {\n  const numMap = {};\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (complement in numMap) {\n      return [numMap[complement], i];\n    }\n    numMap[nums[i]] = i;\n  }\n}', testsPassed: 10, totalTests: 10 },
              { questionId: 2, type: 'multiple', score: 80, timeSpent: 1, selectedOption: 2, correct: true }
            ]
          }
        ],
        questions: [
          { id: 1, type: 'coding', title: 'Two Sum Problem', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target...', starterCode: 'function twoSum(nums, target) {\n    // Write your solution here\n    \n}', difficulty: 'Easy', maxScore: 60, timeLimit: 30, testCases: [ { input: '[2,7,11,15], 9', expected: '[0,1]', hidden: false }, { input: '[3,2,4], 6', expected: '[1,2]', hidden: false }, { input: '[3,3], 6', expected: '[0,1]', hidden: true } ] },
          { id: 2, type: 'multiple', question: 'Which of the following best describes the time complexity of the optimal solution for the Two Sum problem using a hash map?', options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'], correct: 2, explanation: 'Using a hash map, we can solve this in O(n) time with a single pass through the array.', maxScore: 40, timeLimit: 5 }
        ]
      },
      {
        id: 2,
        title: 'Junior Backend Developer Challenge',
        company: 'DevSolutions LLC',
        duration: 60,
        maxScore: 100,
        difficulty: 'Medium',
        createdDate: '2024-04-01',
        status: 'active',
        invitesSent: 40,
        submissions: [
            { id: 1, candidateName: 'Sarah Miller', candidateEmail: 'sarah.miller@email.com', submittedAt: '2024-04-05T11:00:00Z', duration: 55, score: 78, status: 'completed', answers: [ { questionId: 1, type: 'coding', score: 80, timeSpent: 25, attempts: 2, code: 'function isPalindrome(str) {\n const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, "");\n return cleanStr === cleanStr.split("").reverse().join("");\n}', testsPassed: 4, totalTests: 5 }, { questionId: 2, type: 'multiple', score: 100, timeSpent: 3, selectedOption: 1, correct: true }, { questionId: 3, type: 'text', score: 70, timeSpent: 15, response: 'REST APIs are stateless, use standard HTTP methods, and can return data in various formats like JSON or XML. They are highly scalable and flexible.' } ] },
            { id: 2, candidateName: 'Mike Brown', candidateEmail: 'mike.brown@email.com', submittedAt: '2024-04-06T15:20:00Z', duration: 60, score: 92, status: 'completed', answers: [ { questionId: 1, type: 'coding', score: 90, timeSpent: 20, attempts: 1, code: 'function isPalindrome(s) {\n s = s.toLowerCase().replace(/\\W_ /g, "");\n let left = 0, right = s.length - 1;\n while (left < right) {\n if (s[left] !== s[right]) return false;\n left++;\n right--;\n }\n return true;\n}', testsPassed: 5, totalTests: 5 }, { questionId: 2, type: 'multiple', score: 100, timeSpent: 2, selectedOption: 1, correct: true }, { questionId: 3, type: 'text', score: 90, timeSpent: 10, response: 'Key principles include: Client-Server architecture, Statelessness, Cacheability, Layered system, Uniform interface, and Code on demand (optional).' } ] }
        ],
        questions: [
            { id: 1, type: 'coding', title: 'Palindrome Checker', description: 'Write a function that takes a string and returns true if it is a palindrome...', starterCode: 'function isPalindrome(str) {\n  // Your code here\n}', difficulty: 'Easy', maxScore: 40, timeLimit: 20, testCases: [ { input: '"A man, a plan, a canal: Panama"', expected: 'true', hidden: false }, { input: '"race a car"', expected: 'false', hidden: false } ] },
            { id: 2, type: 'multiple', question: 'Which HTTP method is idempotent and used to fully replace a resource if it exists, or create it if it does not?', options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], correct: 2, maxScore: 30, timeLimit: 5 },
            { id: 3, type: 'text', title: 'Explain REST API Principles', description: 'Briefly explain the key principles of RESTful APIs. (Max 100 words)', maxScore: 30, timeLimit: 15 }
        ]
      },
      {
        id: 3,
        title: 'Sales Manager Role Play & Aptitude',
        company: 'Global Solutions Ltd.',
        duration: 45,
        maxScore: 100,
        difficulty: 'Medium',
        createdDate: '2024-04-10',
        status: 'draft',
        invitesSent: 15,
        submissions: [
          { id: 1, candidateName: 'David Lee', candidateEmail: 'david.lee@email.com', submittedAt: '2024-04-15T09:30:00Z', duration: 40, score: 85, status: 'completed', answers: [ { questionId: 1, type: 'text', score: 80, timeSpent: 15, response: 'Faced with a 20% shortfall...'}, { questionId: 2, type: 'multiple', score: 100, timeSpent: 3, selectedOption: 2, correct: true}, { questionId: 3, type: 'multiple', score: 100, timeSpent: 2, selectedOption: 0, correct: true} ] },
          { id: 2, candidateName: 'John Doe', candidateEmail: 'john.doe@example.net', submittedAt: '2024-04-16T12:00:00Z', duration: 42, score: 72, status: 'completed', answers: [ { questionId: 1, type: 'text', score: 70, timeSpent: 20, response: 'When I had a challenging sales target...'}, { questionId: 2, type: 'multiple', score: 50, timeSpent: 5, selectedOption: 0, correct: false}, { questionId: 3, type: 'multiple', score: 100, timeSpent: 1, selectedOption: 0, correct: true} ] }
        ],
        questions: [
          { id: 1, type: 'text', title: 'Challenging Sales Target', description: 'Describe a time you faced a challenging sales target...', difficulty: 'Medium', maxScore: 40, timeLimit: 20 },
          { id: 2, type: 'multiple', question: 'A key client is unhappy... What is your MOST appropriate first step?', options: [ 'Immediately offer a significant discount...', 'Promise a fix...', 'Schedule a call to listen actively...', 'Escalate the issue...' ], correct: 2, maxScore: 30, timeLimit: 10 },
          { id: 3, type: 'multiple', question: 'What does CRM stand for in a sales context?', options: [ 'Customer Relationship Management', 'Company Resource Manager', 'Client Response Mechanism', 'Customer Retention Model' ], correct: 0, maxScore: 30, timeLimit: 5 }
        ]
      },
      {
        id: 4,
        title: 'Proctored Skill Assessment (External)',
        company: 'CareerConnect Proctoring',
        duration: 60, // Matches the timer in proctored_assessment.html
        maxScore: 100, // Placeholder
        difficulty: 'Medium',
        createdDate: '2025-06-03', // Current date
        status: 'active',
        invitesSent: 0,
        submissions: [],
        questions: [{ id: 1, type: 'external', title: 'Proctored Assessment', description: 'This assessment will be taken in a separate, proctored environment.' }],
        externalUrl: 'proctored_assessment.html?jobId=proctored-skill-generic' // Link to the new file
      }
    ]);

    useEffect(() => {
      if (selectedInterview && userRole === 'candidate') {
          setTimeRemaining(selectedInterview.duration * 60);
          const initialAnswers = {};
          selectedInterview.questions.forEach(q => {
              if (q.type === 'coding') initialAnswers[q.id] = { code: q.starterCode || '', type: 'coding' };
              else if (q.type === 'multiple') initialAnswers[q.id] = { selectedOption: null, type: 'multiple' };
              else if (q.type === 'text') initialAnswers[q.id] = { response: '', type: 'text' };
          });
          setCandidateAnswers(initialAnswers);
          setCurrentQuestion(0);
          setIsSubmitted(false);
      }
    }, [selectedInterview, userRole]);

    useEffect(() => {
      let timer;
      if (userRole === 'candidate' && selectedInterview && timeRemaining > 0 && !isSubmitted) {
        timer = setInterval(() => setTimeRemaining(prev => prev - 1), 1000);
      }
      if (timeRemaining === 0 && !isSubmitted && selectedInterview) {
          setIsSubmitted(true);
          alert("Time's up! Your assessment has been submitted.");
          setCurrentView('thank-you');
      }
      return () => clearInterval(timer);
    }, [userRole, selectedInterview, timeRemaining, isSubmitted]);

    const formatTime = (seconds) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';
    const getScoreColor = (score, maxScore = 100) => { const p = (score / maxScore) * 100; return p >= 80 ? 'text-green-600 bg-green-100' : p >= 60 ? 'text-yellow-600 bg-yellow-100' : 'text-red-600 bg-red-100'; };
    const handleAnswerChange = (questionId, value) => setCandidateAnswers(prev => ({ ...prev, [questionId]: { ...prev[questionId], ...value } }));

    const runCode = () => {
      const currentQ = selectedInterview.questions[currentQuestion];
      if (currentQ.type !== 'coding' || !currentQ.testCases) { setTestResults([]); return; }
      const results = currentQ.testCases.map((tc, i) => { const codeNotEmpty = candidateAnswers[currentQ.id]?.code?.trim().length > 0; const passed = codeNotEmpty && Math.random() > (tc.hidden ? 0.5 : 0.2); return { id: i, input: tc.input, expected: tc.expected, actual: passed ? tc.expected : (codeNotEmpty ? 'Error/Wrong Output' : 'No Output'), passed, hidden: tc.hidden }; });
      setTestResults(results);
    };
    const handleSubmitAssessment = () => { setIsSubmitted(true); console.log("Assessment Submitted:", candidateAnswers); alert("Assessment submitted successfully!"); setCurrentView('thank-you'); };

    const RoleSelectionView = () => (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-md w-full">
          <i className="fas fa-book-open fa-3x mx-auto text-blue-600 mb-6"></i> {/* BookOpen */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Interview Platform</h1>
          <p className="text-gray-600 mb-8">Please select your role to continue.</p>
          <div className="space-y-4">
            <button onClick={() => { setUserRole('manager'); setCurrentView('dashboard'); }} className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2">
              <i className="fas fa-user mr-2"></i> Manager {/* User */}
            </button>
            <button onClick={() => { setUserRole('candidate'); setCurrentView('candidate-landing');}} className="w-full bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2">
              <i className="fas fa-code mr-2"></i> Candidate {/* Code */}
            </button>
          </div>
        </div>
      </div>
    );

    const CandidateLandingView = () => (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-lg w-full">
          <i className="fas fa-trophy fa-3x mx-auto text-yellow-500 mb-6"></i> {/* Trophy */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome, Candidate!</h2>
          <p className="text-gray-600 mb-8">Select an assessment to begin.</p>
          {interviews.filter(i => i.status === 'active').length > 0 ? (
            <div className="space-y-4">
              {interviews.filter(i => i.status === 'active').map(interview => (
                <button 
                  key={interview.id} 
                  onClick={() => { 
                    if (interview.externalUrl) {
                      window.location.href = interview.externalUrl;
                    } else {
                      setSelectedInterview(interview); 
                      setCurrentView('interview'); 
                    }
                  }} 
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex justify-between items-center"
                >
                  <span>{interview.title} <span className="text-sm opacity-80">({interview.company})</span></span>
                  {interview.externalUrl ? <i className="fas fa-external-link-alt"></i> : <i className="fas fa-play"></i>} {/* ExternalLink or Play */}
                </button>
              ))}
            </div>
          ) : <p className="text-gray-500">No active assessments available.</p>}
          <button onClick={() => setCurrentView('role-selection')} className="mt-8 text-sm text-blue-600 hover:underline">← Back to Role Selection</button>
        </div>
      </div>
    );

    const ManagerDashboard = () => (
      <div className="space-y-8 p-6 sm:p-8 bg-gray-50 min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div><h2 className="text-3xl font-bold text-gray-900">Assessment Dashboard</h2><p className="text-gray-600 mt-1">Manage and track your technical assessments.</p></div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <button onClick={() => setCurrentView('create')} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors text-sm font-medium">
              <i className="fas fa-plus mr-1"></i> Create Assessment {/* Plus */}
            </button>
            <a href="ats_dashboard.html#assessments" className="bg-sky-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-sky-700 transition-colors text-sm font-medium no-underline" style={{ textDecoration: 'none' }}>
              <i className="fas fa-list-check mr-1"></i> Check Status
            </a>
            <button onClick={() => setCurrentView('role-selection')} className="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">Switch Role</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map(interview => (
            <div key={interview.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3"><h3 className="text-xl font-semibold text-gray-800">{interview.title}</h3><span className={`px-3 py-1 rounded-full text-xs font-medium ${interview.status === 'active' ? 'bg-green-100 text-green-800' : interview.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{interview.status}</span></div>
                <p className="text-gray-500 text-sm mb-1">{interview.company}</p><p className="text-xs text-gray-400 mb-4">Created: {formatDate(interview.createdDate)}</p>
                <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                  <div className="flex items-center gap-2 text-gray-600"><i className="fas fa-clock text-blue-500"></i><span>{interview.duration} min</span></div> {/* Clock */}
                  <div className="flex items-center gap-2 text-gray-600"><i className="fas fa-crosshairs text-red-500"></i><span>{interview.difficulty}</span></div> {/* Target */}
                  <div className="flex items-center gap-2 text-gray-600"><i className="fas fa-envelope text-green-500"></i><span>{interview.invitesSent} invited</span></div> {/* Mail */}
                  <div className="flex items-center gap-2 text-gray-600"><i className="fas fa-user text-purple-500"></i><span>{interview.submissions.length} submitted</span></div> {/* User */}
                </div>
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200 text-center">
                  <div><div className="text-2xl font-bold text-gray-700">{interview.submissions.length > 0 ? Math.round(interview.submissions.reduce((acc, sub) => acc + sub.score, 0) / interview.submissions.length) : 'N/A'}</div><div className="text-xs text-gray-500">Avg Score</div></div>
                  <div><div className="text-2xl font-bold text-gray-700">{interview.submissions.filter(sub => sub.score >= 80).length}</div><div className="text-xs text-gray-500">Top Scores</div></div>
                  <div><div className="text-2xl font-bold text-gray-700">{interview.submissions.length > 0 ? Math.round(interview.submissions.reduce((acc, sub) => acc + sub.duration, 0) / interview.submissions.length) : 'N/A'}</div><div className="text-xs text-gray-500">Avg Time (min)</div></div>
                </div>
              </div>
              <div className="flex gap-2 mt-6 border-t border-gray-200 pt-4">
                <button onClick={() => { setSelectedInterview(interview); setCurrentView('analytics'); }} className="flex-1 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors" title="View Analytics"><i className="fas fa-chart-bar mr-1"></i>Analytics</button> {/* BarChart3 */}
                <button onClick={() => { setSelectedInterview(interview); setCurrentView('submissions'); }} className="flex-1 text-sm bg-green-50 text-green-700 hover:bg-green-100 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors" title="View Submissions"><i className="fas fa-eye mr-1"></i>Submissions</button> {/* Eye */}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    const SubmissionsView = () => (
      <div className="space-y-6 p-6 sm:p-8 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-4 mb-6"><button onClick={() => setCurrentView('dashboard')} className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"><i className="fas fa-chevron-left mr-1"></i>Back to Dashboard</button></div> {/* ChevronLeft */}
        <div><h2 className="text-3xl font-bold text-gray-900">{selectedInterview.title}</h2><p className="text-gray-600 mt-1">Review candidate submissions for this assessment.</p></div>
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50"><div className="flex flex-col sm:flex-row justify-between items-start sm:items-center"><h3 className="text-lg font-semibold text-gray-800">All Submissions ({selectedInterview.submissions.length})</h3><div className="flex gap-2 mt-3 sm:mt-0"><button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors text-sm"><i className="fas fa-download mr-1"></i>Export CSV</button></div></div></div> {/* Download */}
          <div className="overflow-x-auto"><table className="w-full min-w-[700px]"><thead className="bg-gray-100"><tr><th className="text-left py-3 px-6 font-semibold text-gray-700 text-sm">Candidate</th><th className="text-left py-3 px-6 font-semibold text-gray-700 text-sm">Score</th><th className="text-left py-3 px-6 font-semibold text-gray-700 text-sm">Duration</th><th className="text-left py-3 px-6 font-semibold text-gray-700 text-sm">Submitted At</th><th className="text-left py-3 px-6 font-semibold text-gray-700 text-sm">Status</th><th className="text-left py-3 px-6 font-semibold text-gray-700 text-sm">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {selectedInterview.submissions.length > 0 ? selectedInterview.submissions.map(s => (<tr key={s.id} className="hover:bg-gray-50 transition-colors"><td className="py-4 px-6"><div><div className="font-medium text-gray-900">{s.candidateName}</div><div className="text-xs text-gray-500">{s.candidateEmail}</div></div></td><td className="py-4 px-6"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getScoreColor(s.score)}`}>{s.score} / {selectedInterview.maxScore}</span></td><td className="py-4 px-6 text-sm text-gray-700">{s.duration} min</td><td className="py-4 px-6 text-sm text-gray-700">{formatDate(s.submittedAt)}</td><td className="py-4 px-6"><span className={`px-3 py-1 rounded-full text-xs font-medium ${s.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{s.status}</span></td><td className="py-4 px-6"><button onClick={() => { setSelectedSubmission(s); setCurrentView('submission-detail');}} className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline">View Details</button></td></tr>)) : (<tr><td colSpan="6" className="text-center py-10 px-6 text-gray-500">No submissions yet.</td></tr>)}</tbody>
          </table></div>
        </div>
      </div>
    );

    const SubmissionDetailView = () => {
      if (!selectedSubmission) return <div className="p-6">No submission selected.</div>;
      const interview = interviews.find(i => i.id === selectedInterview.id);
      return (
        <div className="space-y-6 p-6 sm:p-8 bg-gray-50 min-h-screen">
          <div className="flex items-center gap-4 mb-6"><button onClick={() => setCurrentView('submissions')} className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"><i className="fas fa-chevron-left mr-1"></i>Back to Submissions</button></div> {/* ChevronLeft */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6"><div><h2 className="text-2xl font-bold text-gray-900">{selectedSubmission.candidateName}</h2><p className="text-gray-600">{selectedSubmission.candidateEmail}</p><p className="text-sm text-gray-500 mt-1">Submitted for: {interview?.title}</p></div><div className="mt-3 sm:mt-0"><span className={`px-4 py-2 rounded-lg text-lg font-semibold ${getScoreColor(selectedSubmission.score, interview?.maxScore)}`}>Score: {selectedSubmission.score} / {interview?.maxScore || 100}</span></div></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-6 border-b border-gray-200">{[{ label: 'Overall Score', value: selectedSubmission.score }, { label: 'Duration (min)', value: selectedSubmission.duration }, { label: 'Tests Passed (Coding)', value: selectedSubmission.answers.filter(a=>a.type==='coding').reduce((acc, a) => acc + (a.testsPassed || 0),0) }, { label: 'Correct Answers (MCQ)', value: selectedSubmission.answers.filter(a=>a.type==='multiple' && a.correct).length }].map(m => (<div key={m.label} className="bg-gray-50 p-4 rounded-lg text-center"><div className="text-3xl font-bold text-gray-800">{m.value}</div><div className="text-sm text-gray-600 mt-1">{m.label}</div></div>))}</div>
            <div><h3 className="text-xl font-semibold text-gray-800 mb-4">Question-wise Performance</h3>
              {selectedSubmission.answers.map((ans, idx) => {
                const q = interview?.questions.find(q => q.id === ans.questionId); if(!q) return null;
                return (<div key={ans.questionId} className="bg-white border border-gray-200 rounded-xl p-6 mb-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3"><div><h4 className="text-lg font-semibold text-gray-800">Q{idx+1}: {q.title||q.question}</h4><div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500"><span>Type: <span className="font-medium text-gray-700">{ans.type}</span></span><span>Time: <span className="font-medium text-gray-700">{ans.timeSpent} min</span></span>{ans.attempts && <span>Attempts: <span className="font-medium text-gray-700">{ans.attempts}</span></span>}</div></div><span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(ans.score, q.maxScore)}`}>{ans.score} / {q.maxScore}</span></div>
                  {ans.type === 'coding' && (<div className="space-y-3">{ans.testsPassed !== undefined && (<div className="flex items-center gap-2 text-sm">{ans.testsPassed === ans.totalTests ? <i className="fas fa-check-circle text-green-600"></i> : <i className="fas fa-exclamation-circle text-yellow-600"></i>}<span>{ans.testsPassed} / {ans.totalTests} tests passed</span></div>)}<div><h5 className="font-medium text-gray-700 mb-1 text-sm">Code:</h5><pre className="bg-gray-800 text-white border border-gray-600 rounded-lg p-4 text-xs overflow-x-auto max-h-60"><code>{ans.code || "// No code"}</code></pre></div></div>)} {/* CheckCircle, AlertCircle */}
                  {ans.type === 'multiple' && (<div className="space-y-2 text-sm"><div className="flex items-center gap-2">{ans.correct ? <i className="fas fa-check-circle text-green-600"></i> : <i className="fas fa-times-circle text-red-600"></i>}<span>Selected: <span className="font-medium">{q.options[ans.selectedOption]}</span></span></div>{!ans.correct && (<p className="text-xs text-gray-600">Correct: {q.options[q.correct]}</p>)}{q.explanation && <p className="text-xs text-gray-500 mt-1"><i>Explanation: {q.explanation}</i></p>}</div>)} {/* CheckCircle, XCircle */}
                  {ans.type === 'text' && (<div><h5 className="font-medium text-gray-700 mb-1 text-sm">Response:</h5><div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap">{ans.response || "- No response -"}</div></div>)}
                </div>);
              })}
            </div>
          </div>
        </div>
      );
    };

    const AnalyticsView = () => { /* ... Font Awesome icons ... */
        if (!selectedInterview) return <div className="p-6">No interview selected.</div>;
        const submissions = selectedInterview.submissions;
        const avgScore = submissions.length > 0 ? Math.round(submissions.reduce((acc, sub) => acc + sub.score, 0) / submissions.length) : 0;
        const completionRate = selectedInterview.invitesSent > 0 ? Math.round((submissions.length / selectedInterview.invitesSent) * 100) : 0;
        return (
          <div className="space-y-6 p-6 sm:p-8 bg-gray-50 min-h-screen">
            <div className="flex items-center gap-4 mb-6"><button onClick={() => setCurrentView('dashboard')} className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"><i className="fas fa-chevron-left mr-1"></i>Back to Dashboard</button></div> {/* ChevronLeft */}
            <div><h2 className="text-3xl font-bold text-gray-900">Assessment Analytics</h2><p className="text-gray-600 mt-1">{selectedInterview.title}</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{[{ label: 'Total Submissions', value: submissions.length, color: 'text-blue-600' }, { label: 'Average Score', value: `${avgScore}%`, color: 'text-green-600' }, { label: 'High Performers (≥80%)', value: submissions.filter(s => (s.score / selectedInterview.maxScore) * 100 >= 80).length, color: 'text-yellow-600' }, { label: 'Completion Rate', value: `${completionRate}%`, color: 'text-purple-600' }].map(m => (<div key={m.label} className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-lg"><div className={`text-4xl font-bold ${m.color}`}>{m.value}</div><div className="text-sm text-gray-600 mt-2">{m.label}</div></div>))}</div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg"><h3 className="text-xl font-semibold text-gray-800 mb-6">Score Distribution</h3><div className="space-y-4">{['90-100', '80-89', '70-79', '60-69', '50-59', '0-49'].map(range => { const [min, max] = range.split('-').map(Number); const count = submissions.filter(s => { const p = (s.score / selectedInterview.maxScore) * 100; return p >= min && p <= max; }).length; const pct = submissions.length > 0 ? (count / submissions.length) * 100 : 0; return (<div key={range} className="flex items-center gap-3"><div className="w-20 text-sm text-gray-600 font-medium">{range}%</div><div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden"><div className="bg-blue-600 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500" style={{ width: `${Math.max(pct,0)}%` }}>{count > 0 && <span className="text-white text-xs font-bold">{count}</span>}</div></div><div className="w-12 text-sm text-gray-600 text-right">{Math.round(pct)}%</div></div>); })}</div></div>
          </div>
        );
    };

    const CandidateInterview = () => { /* ... Font Awesome icons ... */
        if (!selectedInterview) return <div className="p-6">No interview selected.</div>;
        const question = selectedInterview.questions[currentQuestion];
        const currentAnswer = candidateAnswers[question.id];
        if (isSubmitted) return (<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-center"><i className="fas fa-check-circle fa-4x text-green-500 mb-6"></i><h1 className="text-3xl font-bold text-gray-800 mb-3">Assessment Submitted!</h1><p className="text-gray-600 mb-8">Thank you for completing the {selectedInterview.title}.<br/>We will be in touch.</p><button onClick={() => {setUserRole(null); setSelectedInterview(null); setCandidateAnswers({}); setCurrentQuestion(0); setCurrentView('role-selection');}} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Back to Home</button></div>); {/* CheckCircle */}
        return (
          <div className="h-screen flex flex-col bg-gray-100">
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm sticky top-0 z-10"><div><h1 className="text-lg sm:text-xl font-bold text-gray-800">{selectedInterview.title}</h1><p className="text-xs sm:text-sm text-gray-500">{selectedInterview.company}</p></div><div className="flex items-center gap-3 sm:gap-6"><div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${timeRemaining < 300 ? 'text-red-600 bg-red-50':'text-orange-600 bg-orange-50'}`}><i className="fas fa-clock mr-1"></i><span className="font-mono text-base sm:text-lg font-semibold">{formatTime(timeRemaining)}</span></div><button onClick={handleSubmitAssessment} disabled={isSubmitted} className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-700 text-sm sm:text-base disabled:bg-gray-400"><i className="fas fa-paper-plane mr-1 sm:mr-2"></i>Submit</button></div></div> {/* Clock, Send/PaperPlane */}
            <div className="bg-white px-6 py-3 border-b border-gray-200 sticky top-[68px] z-10"><div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2"><span>Question {currentQuestion + 1} of {selectedInterview.questions.length}</span><span>{Math.round(((currentQuestion + 1)/selectedInterview.questions.length)*100)}% Complete</span></div><div className="w-full bg-gray-200 rounded-full h-2.5 mb-3"><div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" style={{width: `${((currentQuestion+1)/selectedInterview.questions.length)*100}%`}}></div></div><div className="flex justify-between items-center"><button onClick={()=>setCurrentQuestion(p=>Math.max(0,p-1))} disabled={currentQuestion===0} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50 flex items-center gap-1 text-sm"><i className="fas fa-chevron-left mr-1"></i>Prev</button><button onClick={()=>setCurrentQuestion(p=>Math.min(selectedInterview.questions.length-1,p+1))} disabled={currentQuestion===selectedInterview.questions.length-1} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-1 text-sm">Next<i className="fas fa-chevron-right ml-1"></i></button></div></div> {/* ChevronLeft, ChevronRight */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              <div className="w-full md:w-1/2 bg-white border-r border-gray-200 overflow-y-auto p-6"><div className="flex items-center gap-3 mb-4"><h2 className="text-xl font-bold text-gray-900">{question.title||`Question ${currentQuestion+1}`}</h2>{question.difficulty && (<span className={`px-2.5 py-1 rounded-md text-xs font-medium ${question.difficulty==='Easy'?'bg-green-100 text-green-800':question.difficulty==='Medium'?'bg-yellow-100 text-yellow-800':'bg-red-100 text-red-800'}`}>{question.difficulty}</span>)}</div><div className="prose prose-sm max-w-none mb-6 text-gray-700 leading-relaxed"><p>{question.description||question.question}</p></div>{question.type==='coding'&&question.testCases?.filter(tc=>!tc.hidden).length>0&&(<div className="space-y-4"><h3 className="font-semibold text-gray-800 mb-2">Examples:</h3>{question.testCases.filter(tc=>!tc.hidden).map((tc,i)=>(<div key={i}className="bg-gray-50 border border-gray-200 rounded-lg p-4"><div className="space-y-1 font-mono text-xs sm:text-sm"><div><span className="font-semibold text-gray-600">Input:</span><span className="ml-2 text-gray-800">{tc.input}</span></div><div><span className="font-semibold text-gray-600">Output:</span><span className="ml-2 text-gray-800">{tc.expected}</span></div></div></div>))}</div>)}</div>
              <div className="w-full md:w-1/2 flex flex-col bg-gray-50">{question.type==='coding'&&(<> <div className="flex-1 p-2 sm:p-4"><textarea value={currentAnswer?.code||''} onChange={e=>handleAnswerChange(question.id,{code:e.target.value})} placeholder={question.starterCode||"Write your code here..."} className="w-full h-full p-4 border border-gray-300 rounded-lg resize-none font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-900 text-gray-100" spellCheck="false"/></div> <div className="p-4 border-t border-gray-200 bg-white"><button onClick={runCode} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm"><i className="fas fa-play mr-1"></i>Run Code</button>{testResults.length>0&&(<div className="mt-4 space-y-2 max-h-48 overflow-y-auto"><h4 className="font-semibold text-gray-800 text-sm">Test Results:</h4>{testResults.map(r=>(<div key={r.id}className={`flex items-center justify-between p-2.5 rounded-md text-xs ${r.passed?'bg-green-50 border border-green-200 text-green-700':'bg-red-50 border border-red-200 text-red-700'}`}><div className="flex items-center gap-2">{r.passed?<i className="fas fa-check-circle"></i>:<i className="fas fa-times-circle"></i>}<span className="font-medium">Test Case {r.id+1}{r.hidden?' (Hidden)':''}</span></div><span className={`font-semibold ${r.passed?'text-green-600':'text-red-600'}`}>{r.passed?'Passed':'Failed'}</span></div>))}</div>)}</div> </>)} {/* Play, CheckCircle, XCircle */}
                {question.type==='multiple'&&( <div className="p-6 space-y-4 overflow-y-auto"><h3 className="font-semibold text-gray-800">Select an option:</h3>{question.options.map((opt,i)=>(<label key={i}className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${currentAnswer?.selectedOption===i?'bg-blue-100 border-blue-500 ring-2 ring-blue-500':'bg-white hover:bg-gray-50 border-gray-300'}`}><input type="radio"name={`question-${question.id}`}value={i}checked={currentAnswer?.selectedOption===i}onChange={()=>handleAnswerChange(question.id,{selectedOption:i})}className="form-radio h-5 w-5 text-blue-600 mr-3 focus:ring-blue-500"/><span className="text-sm text-gray-700">{opt}</span></label>))}</div> )}
                {question.type==='text'&&( <div className="p-6 flex-1"><textarea value={currentAnswer?.response||''}onChange={e=>handleAnswerChange(question.id,{response:e.target.value})}placeholder="Type your answer here..."className="w-full h-full p-4 border border-gray-300 rounded-lg resize-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/></div> )}
            </div>
          </div>
        </div>
      );
    };

    const CreateAssessmentView = () => ( /* ... Font Awesome icons ... */
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-4 mb-6"><button onClick={() => setCurrentView('dashboard')} className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"><i className="fas fa-chevron-left mr-1"></i>Back to Dashboard</button></div> {/* ChevronLeft */}
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-3xl mx-auto"><h2 className="text-3xl font-bold text-gray-800 mb-2">Create New Assessment</h2><p className="text-gray-600 mb-8">Define the details and questions for your new assessment.</p><div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center"><i className="fas fa-edit fa-3x mx-auto text-gray-400 mb-4"></i><h3 className="text-xl font-semibold text-gray-700 mb-2">Assessment Creation Wizard</h3><p className="text-gray-500">This feature is under development.</p><button onClick={()=>alert("Not implemented.")}className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Start Building (Soon)</button></div></div> {/* Edit3 */}
      </div>
    );

    const ThankYouView = () => ( /* ... Font Awesome icons ... */
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
        <i className="fas fa-check-circle fa-4x text-green-500 mb-6"></i> {/* CheckCircle */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Assessment Submitted!</h1>
        <p className="text-gray-600 mb-8">Thank you for completing the assessment.<br/>The hiring team will review your submission.</p>
        <button onClick={() => {setUserRole(null);setSelectedInterview(null);setCandidateAnswers({});setCurrentQuestion(0);setCurrentView('role-selection');}} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Return to Home</button>
      </div>
    );

    const renderView = () => {
      if (isSubmitted && userRole === 'candidate' && currentView !== 'thank-you') return <ThankYouView />;
      switch (currentView) {
        case 'dashboard': return userRole === 'manager' ? <ManagerDashboard /> : <CandidateLandingView />;
        case 'create': return <CreateAssessmentView />;
        case 'submissions': return <SubmissionsView />;
        case 'submission-detail': return <SubmissionDetailView />;
        case 'analytics': return <AnalyticsView />;
        case 'interview': return <CandidateInterview />;
        case 'candidate-landing': return <CandidateLandingView />;
        case 'thank-you': return <ThankYouView />;
        default: return <RoleSelectionView />;
      }
    };
    return <div className="antialiased">{renderView()}</div>;
  };

  console.log('[assessments.js] TechnicalInterviewPlatform component defined. Attempting to render...');
  try {
    ReactDOM.render(React.createElement(TechnicalInterviewPlatform), assessmentRoot);
    assessmentRoot.dataset.initialized = 'true';
    console.log('[assessments.js] Assessments platform rendered and initialized successfully.');
  } catch (error) {
    console.error('[assessments.js] CRITICAL: Error rendering assessments platform:', error);
    assessmentRoot.innerHTML = `<p style="color:red; text-align:center; padding:20px;">Error rendering assessments platform. Check console. Details: ${error.message}</p>`;
  }
};

document.dispatchEvent(new CustomEvent('assessments-ready'));
