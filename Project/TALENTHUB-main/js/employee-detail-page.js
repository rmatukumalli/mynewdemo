'use strict';

// InfoCard Component (Helper for Employee Detail View)
// Added id prop for scroll targeting if needed, though not used with section-by-section display
const InfoCard = ({ title, icon, children, id }) => (
  React.createElement('div', { id: id, className: "bg-white p-5 rounded-lg shadow-md h-full info-card animate-fadeIn" },
    React.createElement('div', { className: "flex items-center text-lg font-semibold text-gray-700 mb-3 info-card-title" },
      icon && React.cloneElement(icon, { size: 20, className: `mr-2 ${icon.props.className || ''}` }),
      title
    ),
    React.createElement('div', { className: "text-sm text-gray-600 space-y-1 info-card-content" }, children)
  )
);

const getReadinessColor = (readiness) => {
  if (readiness === 'Ready Now') return 'bg-green-100 text-green-700';
  if (readiness === '1-2 Years') return 'bg-yellow-100 text-yellow-700';
  if (readiness === '3-5 Years') return 'bg-orange-100 text-orange-700';
  return 'bg-red-100 text-red-700'; // for >5 Years
};

const getPerformanceIndicator = (performance) => {
  switch (performance) {
    case 'Exceptional': return React.createElement(Star, { className: "w-5 h-5 text-yellow-500 fill-current" });
    case 'Exceeds Expectations': return React.createElement(TrendingUp, { className: "w-5 h-5 text-green-500" });
    case 'Meets Expectations': return React.createElement(CheckCircle, { className: "w-5 h-5 text-blue-500" });
    case 'Needs Improvement': return React.createElement(XCircle, { className: "w-5 h-5 text-red-500" });
    default: return React.createElement('span', { className: "text-gray-500" }, '-');
  }
};

const { useState, useEffect } = React;

// EmployeeDetailPage Component
// This component will display employee details with a sidebar for section navigation.
const EmployeeDetailPage = ({ employee, onEditEmployee, allEmployees, talentPools }) => {
    const [activeSection, setActiveSection] = useState('contact'); // Default to the first section

    // Define sections for the detail page
    // Each section corresponds to one or more InfoCards
    const detailSections = [
        { id: 'contact', title: 'Contact & Role', icon: Briefcase },
        { id: 'review', title: 'Review & Calibration', icon: CalendarClock },
        { id: 'performance', title: 'Performance & Potential', icon: UserCog },
        { id: 'career', title: 'Career Aspirations & Mobility', icon: BriefcaseBusiness },
        { id: 'development', title: 'Skills & Development Plan', icon: ClipboardList },
        { id: 'successors', title: 'Potential Successors', icon: UserCheck },
        { id: 'pools', title: 'Talent Pool Memberships', icon: UsersRound },
        { id: 'notes', title: 'General Notes', icon: MessageSquare },
    ];

    if (!employee) {
        return React.createElement('div', { className: 'text-center p-8 text-gray-500' }, 'No employee selected.');
    }
    
    // Helper to find successor employee details (needed for successor card)
    const findEmployeeById = (id) => allEmployees.find(e => e.id === id);

    return (
        React.createElement('div', { className: 'flex flex-col md:flex-row bg-white shadow-xl rounded-lg max-w-6xl mx-auto my-4', style: { minHeight: 'calc(100vh - 12rem)' } }, // Adjusted for potential header/footer
            // Sidebar
            React.createElement('div', { className: 'w-full md:w-1/4 p-6 border-r border-gray-200 bg-gray-50 rounded-l-lg' },
                React.createElement('h2', { className: 'text-2xl font-bold text-gray-800 mb-1' }, employee.name),
                React.createElement('p', { className: 'text-md text-indigo-600 mb-1' }, employee.position),
                React.createElement('p', { className: 'text-sm text-gray-500 mb-4' }, employee.department, ' Department'),
                React.createElement('button', {
                    onClick: () => onEditEmployee(employee),
                    className: 'w-full flex items-center justify-center px-4 py-2 mb-6 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-150 btn-primary'
                }, React.createElement(Edit3, { size: 18, className: 'mr-2' }), 'Edit Employee'),
                React.createElement('h3', { className: 'text-lg font-semibold text-indigo-700 mb-3 border-t pt-3' }, 'Profile Sections'),
                React.createElement('nav', { className: 'space-y-1' },
                    detailSections.map(section =>
                        React.createElement('a', {
                            key: section.id,
                            href: '#', // Prevent page jump, click is handled
                            onClick: (e) => { e.preventDefault(); setActiveSection(section.id); },
                            className: `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === section.id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                        }, React.createElement(section.icon, {className: 'mr-2 w-5 h-5'}), section.title)
                    )
                )
            ),
            // Content Area
            React.createElement('div', { className: 'w-full md:w-3/4 p-6 md:p-8 overflow-y-auto', style: { maxHeight: 'calc(100vh - 12rem)' } }, // Scroll within content panel
                // Conditionally render InfoCards based on activeSection
                activeSection === 'contact' && React.createElement(InfoCard, { title: "Contact & Role", icon: React.createElement(Briefcase, {className: "text-indigo-500"}) },
                    React.createElement('p', null, React.createElement('strong', null, 'Email: '), employee.email),
                    React.createElement('p', null, React.createElement('strong', null, 'Phone: '), employee.phone),
                    React.createElement('p', null, React.createElement('strong', null, 'Manager: '), employee.manager || 'N/A'),
                    React.createElement('p', null, React.createElement('strong', null, 'Date Joined: '), new Date(employee.dateJoined).toLocaleDateString())
                ),
                activeSection === 'review' && React.createElement(InfoCard, { title: "Review & Calibration", icon: React.createElement(CalendarClock, {className: "text-indigo-500"}) },
                    React.createElement('p', null, React.createElement('strong', null, 'Review Cycle: '), employee.reviewCycle || 'N/A'),
                    React.createElement('p', null, React.createElement('strong', null, 'Last Reviewed: '), employee.lastReviewedDate ? new Date(employee.lastReviewedDate).toLocaleDateString() : 'N/A'),
                    React.createElement('p', {className: "mt-2"}, React.createElement('strong', null, 'Calibration Notes:')),
                    React.createElement('p', { className: 'text-xs whitespace-pre-wrap' }, employee.calibrationNotes || 'No calibration notes.')
                ),
                activeSection === 'performance' && React.createElement(InfoCard, { title: "Performance & Potential", icon: React.createElement(UserCog, {className: "text-indigo-500"}) },
                    React.createElement('p', null, React.createElement('strong', null, 'Performance: '), React.createElement('span', {className: "font-semibold"}, employee.performance), " ", getPerformanceIndicator(employee.performance)),
                    React.createElement('p', null, React.createElement('strong', null, 'Potential: '), React.createElement('span', { className: `font-semibold ${employee.potential === 'High' ? 'text-green-600' : employee.potential === 'Medium' ? 'text-yellow-600' : 'text-red-600'}` }, employee.potential)),
                    React.createElement('p', null, React.createElement('strong', null, 'Readiness: '), React.createElement('span', { className: `px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getReadinessColor(employee.readiness)}` }, employee.readiness)),
                    React.createElement('p', {className: "mt-2"}, React.createElement('strong', null, 'Risk of Loss: '), React.createElement('span', { className: `font-semibold ${employee.riskOfLoss === 'High' ? 'risk-high' : employee.riskOfLoss === 'Medium' ? 'risk-medium' : 'risk-low'}` }, employee.riskOfLoss)),
                    React.createElement('p', null, React.createElement('strong', null, 'Impact of Loss: '), React.createElement('span', { className: `font-semibold ${employee.impactOfLoss === 'High' ? 'impact-high' : employee.impactOfLoss === 'Medium' ? 'impact-medium' : 'impact-low'}` }, employee.impactOfLoss)),
                    React.createElement('p', null, React.createElement('strong', null, 'Bench Strength (Role): '), React.createElement('span', { className: `font-semibold ${employee.benchStrength === 'Weak' ? 'text-red-600' : employee.benchStrength === 'Moderate' ? 'text-yellow-600' : 'text-green-600'}` }, employee.benchStrength))
                ),
                activeSection === 'career' && React.createElement(InfoCard, { title: "Career Aspirations & Mobility", icon: React.createElement(BriefcaseBusiness, {className: "text-indigo-500"}) },
                    React.createElement('p', {className: "mt-0"}, React.createElement('strong', null, 'Aspirations:')),
                    React.createElement('p', { className: 'text-xs whitespace-pre-wrap' }, employee.careerAspirations || 'Not specified.'),
                    React.createElement('p', { className: "mt-2" }, React.createElement('strong', null, 'Mobility: '), React.createElement('span', { className: 'font-medium' }, employee.mobilityPreferences || 'Not specified.'))
                ),
                activeSection === 'development' && React.createElement(InfoCard, { title: "Skills & Development Plan", icon: React.createElement(ClipboardList, {className: "text-indigo-500"}) },
                    React.createElement('p', null, React.createElement('strong', null, 'Skills:')),
                    employee.skills && employee.skills.length > 0 ?
                        React.createElement('ul', { className: 'list-disc list-inside space-y-1 text-xs ml-4' }, employee.skills.map((skill, i) => React.createElement('li', { key: i }, skill))) :
                        React.createElement('p', { className: 'text-gray-500 text-xs' }, 'No skills listed.'),
                    React.createElement('p', { className: "mt-2" }, React.createElement('strong', null, 'Development Plan:')),
                    React.createElement('p', { className: `text-xs whitespace-pre-wrap ${employee.developmentPlan ? '' : 'text-gray-500'}` }, employee.developmentPlan || 'No development plan specified.')
                ),
                activeSection === 'successors' && React.createElement(InfoCard, { title: "Potential Successors", icon: React.createElement(UserCheck, {className: "text-indigo-500"}) },
                    employee.successors && employee.successors.length > 0 ?
                        React.createElement('ul', { className: 'space-y-3' }, employee.successors.map((succ, i) => {
                            const successorEmployee = findEmployeeById(succ.successorEmployeeId);
                            return React.createElement('li', { key: i, className: 'p-3 bg-gray-50 rounded-md border border-gray-200' },
                                React.createElement('p', { className: 'font-semibold text-gray-800' }, successorEmployee ? successorEmployee.name : 'Unknown Employee'),
                                successorEmployee && React.createElement('p', { className: 'text-xs text-gray-500' }, successorEmployee.position),
                                React.createElement('p', { className: `text-xs font-medium ${getReadinessColor(succ.readiness).split(' ')[1]} mt-1` }, `${succ.readiness} (${succ.type})`),
                                succ.notes && React.createElement('p', { className: 'text-xs text-gray-600 mt-1 italic' }, `Notes: ${succ.notes}`)
                            );
                        })) :
                        React.createElement('p', { className: 'text-gray-500' }, 'No successors identified yet.')
                ),
                activeSection === 'pools' && React.createElement(InfoCard, { title: "Talent Pool Memberships", icon: React.createElement(UsersRound, {className: "text-indigo-500"}) },
                    talentPools.filter(pool => pool.members.includes(employee.id)).length > 0 ?
                        React.createElement('ul', { className: 'space-y-1' }, talentPools.filter(pool => pool.members.includes(employee.id)).map(pool => React.createElement('li', { key: pool.id, className: 'text-sm text-gray-700' }, pool.name))) :
                        React.createElement('p', { className: 'text-gray-500' }, 'Not a member of any talent pools.')
                ),
                activeSection === 'notes' && React.createElement(InfoCard, { title: "General Notes", icon: React.createElement(MessageSquare, {className: "text-indigo-500"}) },
                    React.createElement('p', { className: `whitespace-pre-wrap ${employee.notes ? '' : 'text-gray-500'}` }, employee.notes || 'No additional notes.')
                )
            )
        )
    );
};
