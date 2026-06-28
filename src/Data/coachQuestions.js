export const coachQuestions = [
  // SECTION 1 - About you and your practice
  {
    id: 1,
    section: 'About You',
    question: 'Which best describes your role? (Select all that apply)',
    type: 'checkbox',
    options: ['ADHD coach', 'Neurodiversity coach', 'Workplace mental health coach', 'Occupational therapist', 'Access to Work assessor', 'Disability advisor', 'Occupational health nurse / doctor', 'Psychiatrist / psychologist', 'Workplace mediator', 'HR / D&I professional', 'Educator / trainer', 'Other']
  },
  {
    id: 2,
    section: 'About You',
    question: 'How long have you been in this role?',
    type: 'select',
    options: ['Less than 2 years', '2-5 years', '6-10 years', '11-20 years', '20+ years']
  },
  {
    id: 3,
    section: 'About You',
    question: 'Where do you mostly practise? (Select all that apply)',
    type: 'checkbox',
    options: ['Private practice', 'NHS', 'Charity / third sector', 'Academic institution', 'Local authority', 'Self-employed / freelance', 'Within an employer (in-house)', 'Other']
  },
  {
    id: 4,
    section: 'About You',
    question: 'Roughly how many neurodivergent clients do you support per month?',
    type: 'text',
    options: null
  },
  {
    id: 5,
    section: 'About You',
    question: 'What conditions do you mostly work with? (Select all that apply)',
    type: 'checkbox',
    options: ['ADHD', 'Autism', 'Dyslexia', 'Dyspraxia', 'Dyscalculia', 'Tourette\'s', 'Comorbid conditions', 'Mental health overlaps (anxiety, depression)', 'Other']
  },
  {
    id: 6,
    section: 'About You',
    question: 'Where are you based geographically?',
    type: 'text',
    options: null
  },
  {
    id: 7,
    section: 'About You',
    question: 'What languages do you offer support in?',
    type: 'text',
    options: null
  },

  // SECTION 2 - Your clients
  {
    id: 8,
    section: 'Your Clients',
    question: 'What are the most common workplace challenges your clients raise? (Select top 5)',
    type: 'checkbox',
    options: ['Email and message overload', 'Task initiation difficulty', 'Time management and deadlines', 'Sensory environment', 'Managing meetings', 'Hyperfocus to detriment', 'Communication misunderstandings', 'Manager relationship', 'Disclosure decisions', 'Confidence and imposter feelings', 'Burnout cycles', 'Rejection sensitivity (RSD)', 'Career direction', 'Workload boundary-setting', 'Other']
  },
  {
    id: 9,
    section: 'Your Clients',
    question: 'Roughly what proportion of your clients are in employment vs unemployed or seeking work?',
    type: 'textarea',
    options: null
  },
  {
    id: 10,
    section: 'Your Clients',
    question: 'What sectors do your clients tend to work in?',
    type: 'textarea',
    options: null
  },
  {
    id: 11,
    section: 'Your Clients',
    question: 'Roughly what % of your clients use Access to Work?',
    type: 'select',
    options: ['Less than 25%', '25-50%', '50-75%', 'More than 75%', 'Don\'t know']
  },
  {
    id: 12,
    section: 'Your Clients',
    question: 'What\'s the typical reason clients DROP OUT of coaching with you?',
    type: 'textarea',
    options: null
  },
  {
    id: 13,
    section: 'Your Clients',
    question: 'What outcome makes you most proud when you achieve it with a client?',
    type: 'textarea',
    options: null
  },

  // SECTION 3 - Your methods and tools
  {
    id: 14,
    section: 'Your Methods',
    question: 'What\'s your primary coaching methodology or approach?',
    type: 'select',
    options: ['Cognitive-Behavioural', 'Solution-focused', 'Strengths-based', 'Acceptance and Commitment Therapy (ACT)', 'Coaching framework specifically for ND', 'Eclectic / blended', 'Other']
  },
  {
    id: 15,
    section: 'Your Methods',
    question: 'What assessments or tools do you regularly use with clients?',
    type: 'textarea',
    options: null
  },
  {
    id: 16,
    section: 'Your Methods',
    question: 'What apps or tech do you currently recommend to clients?',
    type: 'textarea',
    options: null
  },
  {
    id: 17,
    section: 'Your Methods',
    question: 'What\'s the BIGGEST gap between the tools that exist and what your clients actually need?',
    type: 'textarea',
    options: null
  },
  {
    id: 18,
    section: 'Your Methods',
    question: 'What\'s a tool you USED to recommend but have stopped recommending? Why?',
    type: 'textarea',
    options: null
  },

  // SECTION 4 - Access to Work
  {
    id: 19,
    section: 'Access to Work',
    question: 'How well do you think AtW serves neurodivergent workers in 2026? (1 = poorly, 7 = very well)',
    type: 'scale',
    options: null
  },
  {
    id: 20,
    section: 'Access to Work',
    question: 'What are the biggest pain points your clients face in the AtW process?',
    type: 'textarea',
    options: null
  },
  {
    id: 21,
    section: 'Access to Work',
    question: 'How often do you contribute to AtW assessments or reports?',
    type: 'select',
    options: ['Regularly', 'Sometimes', 'Rarely', 'Never']
  },
  {
    id: 22,
    section: 'Access to Work',
    question: 'What outcomes is AtW most interested in seeing?',
    type: 'textarea',
    options: null
  },
  {
    id: 23,
    section: 'Access to Work',
    question: 'What would make your client\'s AtW journey easier?',
    type: 'textarea',
    options: null
  },

  // SECTION 5 - AI in your practice
  {
    id: 24,
    section: 'AI in Practice',
    question: 'Have you used AI tools (ChatGPT, Claude, etc.) for any of these? (Select all that apply)',
    type: 'checkbox',
    options: ['Preparing for sessions', 'Writing reports or summaries', 'Case notes', 'Personal admin', 'Generating coaching prompts', 'Recommended specific AI tools to clients', 'Never used AI for any work purpose', 'Other']
  },
  {
    id: 25,
    section: 'AI in Practice',
    question: 'How do you feel about your clients using AI as part of their workplace support?',
    type: 'select',
    options: ['Strongly positive', 'Cautiously positive', 'Neutral', 'Cautious / worried', 'Strongly opposed']
  },
  {
    id: 26,
    section: 'AI in Practice',
    question: 'What would make you confident enough to RECOMMEND an AI tool to a client?',
    type: 'textarea',
    options: null
  },
  {
    id: 27,
    section: 'AI in Practice',
    question: 'What concerns would you raise with a client BEFORE they used one?',
    type: 'textarea',
    options: null
  },
  {
    id: 28,
    section: 'AI in Practice',
    question: 'Have any clients told you they\'re using AI tools for work, on their own?',
    type: 'select',
    options: ['Yes - many', 'Yes - a few', 'Yes - one or two', 'No', 'I haven\'t asked']
  },

  // SECTION 6 - A tool like Zeen A
  {
    id: 29,
    section: 'A Tool Like Zeen A',
    question: 'If a privacy-first AI cognitive assistant existed for your clients, what role would you want? (Select all that apply)',
    type: 'checkbox',
    options: ['Recommend it as part of my client\'s toolkit', 'Co-deliver it alongside my sessions', 'See the patterns it captures (with client consent)', 'Stay out of it entirely', 'Be a clinical advisor to the company building it', 'Be a paid partner / refer clients commercially', 'Other']
  },
  {
    id: 30,
    section: 'A Tool Like Zeen A',
    question: 'What would Zeen A need to do well to earn your endorsement?',
    type: 'textarea',
    options: null
  },
  {
    id: 31,
    section: 'A Tool Like Zeen A',
    question: 'What features would you want to see?',
    type: 'textarea',
    options: null
  },
  {
    id: 32,
    section: 'A Tool Like Zeen A',
    question: 'What features should it NOT have, in your view?',
    type: 'textarea',
    options: null
  },
  {
    id: 33,
    section: 'A Tool Like Zeen A',
    question: 'What would WORRY you most about a tool like this?',
    type: 'textarea',
    options: null
  },
  {
    id: 34,
    section: 'A Tool Like Zeen A',
    question: 'What competitive or comparable tools should we be aware of?',
    type: 'textarea',
    options: null
  },

  // SECTION 7 - Outcomes
  {
    id: 35,
    section: 'Outcomes',
    question: 'How do you currently measure outcomes for your clients?',
    type: 'textarea',
    options: null
  },
  {
    id: 36,
    section: 'Outcomes',
    question: 'If Zeen A were widely used, what outcome would matter MOST to you to see?',
    type: 'textarea',
    options: null
  },
  {
    id: 37,
    section: 'Outcomes',
    question: 'What outcome would matter most to your CLIENTS?',
    type: 'textarea',
    options: null
  },
  {
    id: 38,
    section: 'Outcomes',
    question: 'What outcome would matter most to AtW or other funders?',
    type: 'textarea',
    options: null
  },

  // SECTION 8 - Partnership
  {
    id: 39,
    section: 'Partnership',
    question: 'Would you be open to partnership discussions with Kepraa Labs?',
    type: 'select',
    options: ['Yes - please get in touch', 'Maybe - depends on the model', 'No, not at this time']
  },
  {
    id: 40,
    section: 'Partnership',
    question: 'Which partnership models would interest you? (Select all that apply)',
    type: 'checkbox',
    options: ['Per-client referral fee', 'Revenue share on subscriptions', 'Co-branded delivery / white-label', 'Clinical advisory board seat', 'Speaking and event partnership', 'Research collaboration / data partnership', 'Beta testing with a small group of consenting clients', 'Other']
  },
  {
    id: 41,
    section: 'Partnership',
    question: 'Do you currently partner with any tech vendors or AI providers? Which?',
    type: 'textarea',
    options: null
  },

  // SECTION 9 - Final reflections
  {
    id: 42,
    section: 'Final Reflections',
    question: 'What\'s the biggest OPPORTUNITY you see for AI to help neurodivergent talent at work?',
    type: 'textarea',
    options: null
  },
  {
    id: 43,
    section: 'Final Reflections',
    question: 'What\'s the biggest RISK?',
    type: 'textarea',
    options: null
  },
  {
    id: 44,
    section: 'Final Reflections',
    question: 'What would YOU build if you were us?',
    type: 'textarea',
    options: null
  },
  {
    id: 45,
    section: 'Final Reflections',
    question: 'Anything else you\'d like us to know?',
    type: 'textarea',
    options: null
  },
  {
    id: 46,
    section: 'Final Reflections',
    question: 'May we contact you for follow-up research? (Optional)',
    type: 'text',
    options: null
  }
];