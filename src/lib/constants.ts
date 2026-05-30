export const PLATFORMS = [
  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2', bg: 'bg-blue-700' },
  { id: 'indeed', label: 'Indeed', color: '#003A9B', bg: 'bg-blue-900' },
  { id: 'glassdoor', label: 'Glassdoor', color: '#0CAA41', bg: 'bg-green-600' },
  { id: 'naukri', label: 'Naukri', color: '#FF6600', bg: 'bg-orange-500' },
  { id: 'ziprecruiter', label: 'ZipRecruiter', color: '#7B2D8B', bg: 'bg-purple-700' },
  { id: 'google', label: 'Google Jobs', color: '#EA4335', bg: 'bg-red-500' },
] as const

export const INDIA_CITIES = [
  'India', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Ahmedabad', 'Noida', 'Gurgaon', 'Jaipur',
  'Remote', 'Chandigarh', 'Kochi', 'Indore',
]

export const POPULAR_KEYWORDS = [
  'Python Developer', 'React Developer', 'Data Scientist', 'DevOps Engineer',
  'Full Stack Developer', 'Machine Learning', 'Product Manager', 'Cloud Engineer',
  'Java Developer', 'UI/UX Designer', 'Node.js Developer', 'Business Analyst',
]

export const SKILL_ROADMAPS: Record<string, { beginner: string[]; mid: string[]; senior: string[] }> = {
  'Software Engineer': {
    beginner: ['DSA', 'Python/Java', 'Git', 'SQL basics', 'REST APIs'],
    mid: ['System Design', 'Docker', 'CI/CD', 'Microservices', 'Cloud basics'],
    senior: ['Architecture patterns', 'Kubernetes', 'Performance tuning', 'Team leadership', 'AWS/GCP'],
  },
  'Data Scientist': {
    beginner: ['Python', 'Statistics', 'Pandas/NumPy', 'SQL', 'Data Visualization'],
    mid: ['ML algorithms', 'Feature engineering', 'Scikit-learn', 'Model evaluation', 'A/B Testing'],
    senior: ['Deep Learning', 'NLP/CV', 'MLOps', 'Model deployment', 'Research'],
  },
  'Frontend Developer': {
    beginner: ['HTML/CSS', 'JavaScript', 'React basics', 'Responsive design', 'Git'],
    mid: ['TypeScript', 'Next.js', 'State management', 'Testing', 'Performance'],
    senior: ['Architecture', 'Design systems', 'Web vitals', 'Micro-frontends', 'Mentoring'],
  },
  'DevOps Engineer': {
    beginner: ['Linux', 'Bash scripting', 'Docker', 'Git', 'Networking basics'],
    mid: ['Kubernetes', 'CI/CD pipelines', 'Terraform', 'Monitoring (Grafana)', 'AWS'],
    senior: ['Platform engineering', 'Multi-cloud', 'Cost optimization', 'SRE practices', 'FinOps'],
  },
  'Product Manager': {
    beginner: ['Product thinking', 'User research', 'Wireframing', 'Agile/Scrum', 'Analytics'],
    mid: ['Roadmapping', 'Stakeholder management', 'A/B testing', 'SQL for PMs', 'OKRs'],
    senior: ['Strategy', 'GTM', 'P&L ownership', 'Cross-functional leadership', 'Vision'],
  },
}

export const PLATFORM_COMPARISON = [
  { feature: 'Job Volume (India)', linkedin: '200K+', indeed: '500K+', glassdoor: '100K+', naukri: '1M+', ziprecruiter: '50K+', google: '2M+' },
  { feature: 'Salary Data', linkedin: '✓', indeed: '✓', glassdoor: '✓✓', naukri: '✓', ziprecruiter: '~', google: '~' },
  { feature: 'Company Reviews', linkedin: '~', indeed: '✓', glassdoor: '✓✓', naukri: '✓', ziprecruiter: '~', google: '~' },
  { feature: 'Easy Apply', linkedin: '✓✓', indeed: '✓', glassdoor: '~', naukri: '✓', ziprecruiter: '✓✓', google: '~' },
  { feature: 'Fresher Friendly', linkedin: '~', indeed: '✓', glassdoor: '~', naukri: '✓✓', ziprecruiter: '~', google: '✓' },
  { feature: 'Remote Jobs', linkedin: '✓✓', indeed: '✓', glassdoor: '✓', naukri: '~', ziprecruiter: '✓', google: '✓✓' },
]

export const RESUME_TIPS = [
  {
    title: 'ATS-Proof Keywords',
    desc: 'Mirror exact terms from the job description. Applicant Tracking Systems filter 75% of resumes before human review.',
    icon: 'target',
  },
  {
    title: 'Quantify Impact',
    desc: 'Replace "improved performance" with "reduced API latency by 40% serving 2M daily requests." Numbers get interviews.',
    icon: 'trending-up',
  },
  {
    title: 'Clean Format',
    desc: 'Single column, 10–12pt font, 1-inch margins. Recruiters spend 7 seconds on a first pass — clarity wins.',
    icon: 'layout',
  },
  {
    title: 'Tailor Per Role',
    desc: 'Customize your top 3 bullet points for each application. A targeted resume has 3× higher callback rate.',
    icon: 'edit-3',
  },
]
