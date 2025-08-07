const siteStructure = {
  "1. Talent Marketplace": [
    {
      name: "Pathfinder",
      url: "pathfinder.html",
      id: "link-pathfinder",
      visible: true,
      disabled: false
    },
    {
      name: "Skills Passport",
      url: "skills-passport.html",
      id: "link-skills-passport",
      visible: true,
      disabled: false,
      children: [
        { name: "Skills Overview", url: "skills-overview.html", id: "link-skills-overview", visible: true, disabled: false },
        { name: "Resume Skills", url: "resume-skills.html", id: "link-resume-skills", visible: true, disabled: false },
        { name: "Certifications", url: "certifications.html", id: "link-certifications", visible: true, disabled: false },
        { name: "Development Plans", url: "development-plans.html", id: "link-development-plans", visible: true, disabled: false },
        { name: "Skill History", url: "skill-history.html", id: "link-skill-history", visible: true, disabled: false },
        { name: "Skill Gap Analysis", url: "skill-gap-analysis.html", id: "link-skill-gap-analysis", visible: true, disabled: false }
      ]
    },
    {
      name: "Career Pathing and Personalized Learning",
      id: "group-career-pathing-personalized-learning", // Grouping ID
      visible: true,
      disabled: false,
      isGroup: true, // Indicates this is a sub-header for links
      children: [
        { name: "Career Pathing", url: "career-pathing.html", id: "link-career-pathing", visible: true, disabled: false },
        { name: "Personalized Learning Path", url: "personalized-learning-path/index.html", id: "link-personalized-learning", visible: true, disabled: false }
      ]
    },
    {
      name: "Job Architecture Guide",
      id: "group-job-architecture",
      visible: true,
      disabled: false,
      isGroup: true,
      children: [
        { name: "Job Architecture Guide", url: "job-architecture.html", id: "link-job-architecture", visible: true, disabled: false },
        { name: "Role Architecture", url: "role-architecture.html", id: "link-role-architecture", visible: true, disabled: false }
      ]
    },
    {
      name: "Talent Intelligence & Strategy",
      id: "group-talent-intelligence-strategy",
      visible: true,
      disabled: false,
      isGroup: true,
      children: [
        { name: "Talent Intelligence", url: "talent-intelligence.html", id: "link-talent-intelligence", visible: true, disabled: false },
        { name: "Skills Intelligence", url: "skills-intelligence.html", id: "link-skills-intelligence-main", visible: true, disabled: false }, // Matched old ID for consistency
        { name: "Skills Intelligence Analyst", url: "skills_intelligence_analyst.html", id: "link-skills-intelligence-analyst-main", visible: true, disabled: false } // Matched old ID
      ]
    },
    {
      name: "AI Features & Recommendations",
      id: "group-ai-features",
      visible: true,
      disabled: false,
      isGroup: true,
      children: [
        { name: "Career Catalyst", url: "career_catalyst.html", id: "link-career-catalyst", visible: true, disabled: false }
      ]
    },
    {
      name: "User Profile & General",
      id: "group-user-profile",
      visible: true,
      disabled: false,
      isGroup: true,
      children: [
        { name: "Profile", url: "profile.html", id: "link-profile", visible: true, disabled: false },
        { name: "Talent Profile", url: "talent-profile.html", id: "link-talent-profile", visible: true, disabled: false }
      ]
    }
  ],
  "2. Careers and Job Opportunities": [
    { name: "Akara Careers", url: "akara-careers.html", id: "link-akara-careers", visible: true, disabled: false },
    { name: "Akara Job Detail", url: "akara-job-detail.html", id: "link-akara-job-detail", visible: true, disabled: false },
    { name: "Internal Opportunities", url: "internal-opportunities.html", id: "link-internal-opportunities", visible: true, disabled: false }
  ],
  "3. Talent Acquisition & Screening": [
    { name: "LMS-ATS Integration", url: "lms-ats-integration.html", id: "link-lms-ats-integration", visible: true, disabled: false },
    { name: "Assessments App", url: "assessments_app.html", id: "link-assessments-app", visible: true, disabled: false },
    { name: "Proctored Assessment", url: "proctored_assessment.html", id: "link-proctored-assessment", visible: true, disabled: false },
    { name: "Create with AI", url: "create_with_ai.html", id: "link-create-with-ai", visible: true, disabled: false },
    { name: "Requisitions", url: "requisitions.html", id: "link-requisitions", visible: true, disabled: false },
    { name: "Screen Candidates", url: "screen-candidates.html", id: "link-screen-candidates", visible: true, disabled: false }
  ],
  "4. Performance & Succession": [
    { name: "Performance Reviews", url: "performance-reviews.html", id: "link-performance-reviews", visible: true, disabled: false },
    { name: "Succession Planning", url: "succession-planning.html", id: "link-succession-planning", visible: true, disabled: false },
    { name: "Goals", url: "goals.html", id: "link-goals", visible: true, disabled: false }
  ],
  "5. Dashboards & Integration": [
    { name: "ATS Dashboard", url: "ats_dashboard.html", id: "link-ats-dashboard", visible: true, disabled: false },
    { name: "Home (Talent Marketplace Index)", url: "index.html", id: "link-homepage", visible: true, disabled: false }
  ],
  "6. Admin & Backend Tools": [
    { name: "Job Scraper", url: "job_scraper.html", id: "link-job-scraper", visible: true, disabled: false }
  ],
  "7. Older Designs": [
    { name: "Skills Intelligence (Old)", url: "skills-intelligence.html", id: "link-skills-intelligence-old", visible: true, disabled: false },
    { name: "Skills Intelligence Analyst (Old)", url: "skills_intelligence_analyst.html", id: "link-skills-intelligence-analyst-old", visible: true, disabled: false },
    { name: "Skills (Old)", url: "skills.html", id: "link-skills-old", visible: true, disabled: false },
    { name: "Skills Graph Details (Old)", url: "skills-graph-details.html", id: "link-skills-graph-details", visible: true, disabled: false },
    { name: "Recommendations (Old)", url: "recommendations/recommendations.html", id: "link-recommendations-old", visible: true, disabled: false },
    { name: "Employee Skills Proficiency Dashboard", url: "employee-skills-dashboard.html", id: "link-employee-skills-dashboard", visible: true, disabled: false }
  ],
  "8. Explainers and Project Planning": [
    { name: "Feature AI Summary", url: "feature_ai_summary.html", id: "link-ai-summary", visible: true, disabled: false },
    {
      name: "Evolution",
      id: "group-evolution",
      visible: true,
      disabled: false,
      isGroup: true,
      children: [
        { name: "Current Capability", url: "evolution/current_capability.html", id: "link-current-capability", visible: true, disabled: false },
        { name: "Future Roadmap", url: "evolution/future_roadmap.html", id: "link-future-roadmap", visible: true, disabled: false },
        { name: "Architecture Image View", url: "evolution/architecture_image_view.html", id: "link-architecture-view", visible: true, disabled: false }
      ]
    },
    { name: "Project Timeline", url: "project_timeline.html", id: "link-project-timeline", visible: true, disabled: false }
  ],
  "9. My Percipio": [
    { name: "Learning Platform (My Percipio)", url: "learning-platform.html", id: "link-learning-platform", visible: true, disabled: false }
  ]
};

export { siteStructure };
