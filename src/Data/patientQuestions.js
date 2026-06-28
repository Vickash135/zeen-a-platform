export const patientQuestions = [
  // SECTION 1 - About you
  {
    id: 1,
    section: 'About You',
    question: 'Which best describes you?',
    type: 'select',
    options: ['ADHD', 'Autism / Autistic', 'Dyslexia', 'Dyspraxia', 'Dyscalculia', 'Tourette\'s', 'Multiple of the above', 'Self-identifying / not yet diagnosed', 'Other', 'Prefer not to say']
  },
  {
    id: 2,
    section: 'About You',
    question: 'What is your age band?',
    type: 'select',
    options: ['18-25', '26-35', '36-45', '46-55', '56+', 'Prefer not to say']
  },
  {
    id: 3,
    section: 'About You',
    question: 'When were you diagnosed (or did you start to identify)?',
    type: 'select',
    options: ['Childhood', 'Adolescence', 'Young adulthood (20s)', 'Mid-life (30s/40s)', 'Later (50+)', 'Still seeking diagnosis', 'Self-identify only']
  },
  {
    id: 4,
    section: 'About You',
    question: 'Which best describes your current work situation?',
    type: 'select',
    options: ['Full-time employee', 'Part-time employee', 'Self-employed / freelance', 'Looking for work', 'On leave', 'Studying', 'Not currently seeking work', 'Other']
  },
  {
    id: 5,
    section: 'About You',
    question: 'What sector or industry do you work (or want to work) in?',
    type: 'textarea',
    options: null
  },
  {
    id: 6,
    section: 'About You',
    question: 'Roughly how many years of work experience do you have?',
    type: 'text',
    options: null
  },
  {
    id: 7,
    section: 'About You',
    question: 'Where do you mostly work?',
    type: 'select',
    options: ['Office full-time', 'Hybrid (mix of office and home)', 'Fully remote', 'On-site (warehouse, hospital, shop floor, etc.)', 'Mobile / multiple sites', 'Other']
  },

  // SECTION 2 - Work experience
  {
    id: 8,
    section: 'Work Experience',
    question: 'On a scale of 1-7, how supported do you feel by your current employer? (1 = not at all, 7 = completely)',
    type: 'scale',
    options: null
  },
  {
    id: 9,
    section: 'Work Experience',
    question: 'Have you told your employer about your neurodivergence?',
    type: 'select',
    options: ['Yes, openly', 'Yes, only my direct manager', 'Yes, only HR', 'Partially / hinted at it', 'No - I haven\'t disclosed', 'Not applicable']
  },
  {
    id: 10,
    section: 'Work Experience',
    question: 'If you have disclosed - how did the conversation go?',
    type: 'textarea',
    options: null
  },
  {
    id: 11,
    section: 'Work Experience',
    question: 'Have you ever left a job (or chose not to apply) because the environment felt wrong for you?',
    type: 'select',
    options: ['Yes, multiple times', 'Yes, once', 'No', 'Prefer not to say']
  },
  {
    id: 12,
    section: 'Work Experience',
    question: 'How many jobs have you held in the past 5 years?',
    type: 'select',
    options: ['1', '2', '3', '4', '5 or more', 'Prefer not to say']
  },
  {
    id: 13,
    section: 'Work Experience',
    question: 'On a scale of 1-7, how happy are you in your current work? (1 = very unhappy, 7 = very happy)',
    type: 'scale',
    options: null
  },
  {
    id: 14,
    section: 'Work Experience',
    question: 'What part of your work do you find most ENERGISING?',
    type: 'textarea',
    options: null
  },
  {
    id: 15,
    section: 'Work Experience',
    question: 'What part do you find most DRAINING?',
    type: 'textarea',
    options: null
  },

  // SECTION 3 - Daily challenges
  {
    id: 16,
    section: 'Daily Challenges',
    question: 'Which of these do you experience regularly at work? (Select all that apply)',
    type: 'checkbox',
    options: ['Email overwhelm', 'Task switching is exhausting', 'Meeting fatigue', 'Sensory overload (noise, light, smells)', 'Forgetting deadlines or commitments', 'Time blindness - losing track of time', 'Hyperfocus to the point of forgetting other tasks', 'Difficulty STARTING tasks', 'Difficulty FINISHING tasks', 'Decoding ambiguous emails / messages', 'Imposter syndrome', 'Burnout cycles', 'Rejection sensitivity (RSD)', 'Communication misunderstandings', 'Feeling under-stimulated by routine work', 'Difficulty with small talk and unstructured social time', 'Other']
  },
  {
    id: 17,
    section: 'Daily Challenges',
    question: 'Of those, which is HARDEST for you?',
    type: 'text',
    options: null
  },
  {
    id: 18,
    section: 'Daily Challenges',
    question: 'On a typical BAD day at work, what does it look like for you? Walk us through it.',
    type: 'textarea',
    options: null
  },
  {
    id: 19,
    section: 'Daily Challenges',
    question: 'On a typical GOOD day at work, what does it look like for you?',
    type: 'textarea',
    options: null
  },
  {
    id: 20,
    section: 'Daily Challenges',
    question: 'Are there specific times of day, days of the week, or seasons when work feels harder?',
    type: 'textarea',
    options: null
  },

  // SECTION 4 - Strategies and tools
  {
    id: 21,
    section: 'Strategies and Tools',
    question: 'What do you currently use to manage your work? (Select all that apply)',
    type: 'checkbox',
    options: ['To-do list app', 'Calendar / scheduling app', 'Note-taking app', 'Pomodoro / focus timers', 'White noise or focus music', 'Email rules and filters', 'ChatGPT / Claude / other AI tools', 'Coaching support', 'Therapy', 'Medication', 'Browser extensions', 'Body doubling', 'Voice notes / dictation', 'Nothing in particular', 'Other']
  },
  {
    id: 22,
    section: 'Strategies and Tools',
    question: 'Have you ever worked with an ADHD coach, neurodiversity coach, or workplace coach?',
    type: 'select',
    options: ['Yes, currently', 'Yes, in the past', 'Considering it', 'No', 'I didn\'t know that was a thing']
  },
  {
    id: 23,
    section: 'Strategies and Tools',
    question: 'If yes - what worked, and what didn\'t?',
    type: 'textarea',
    options: null
  },
  {
    id: 24,
    section: 'Strategies and Tools',
    question: 'Have you used Access to Work (AtW)?',
    type: 'select',
    options: ['Yes, currently funded', 'Yes, in the past', 'Applied - awaiting decision', 'Considered but didn\'t apply', 'Didn\'t know about AtW', 'Not eligible / not applicable']
  },
  {
    id: 25,
    section: 'Strategies and Tools',
    question: 'If yes - what support did AtW fund?',
    type: 'textarea',
    options: null
  },
  {
    id: 26,
    section: 'Strategies and Tools',
    question: 'How would you rate your AtW experience overall? (1 = frustrating, 7 = excellent)',
    type: 'scale',
    options: null
  },

  // SECTION 5 - Support and communication
  {
    id: 27,
    section: 'Support and Communication',
    question: 'Who supports you day-to-day at work? (Select all that apply)',
    type: 'checkbox',
    options: ['My manager', 'An understanding colleague', 'HR', 'Workplace mentor', 'Employee Resource Group', 'External coach', 'Family / partner', 'Nobody specifically', 'Other']
  },
  {
    id: 28,
    section: 'Support and Communication',
    question: 'How do you handle a manager who doesn\'t "get" you?',
    type: 'textarea',
    options: null
  },
  {
    id: 29,
    section: 'Support and Communication',
    question: 'Do you have neurodivergent colleagues you connect with?',
    type: 'select',
    options: ['Yes, several', 'Yes, one or two', 'No', 'Don\'t know who is and isn\'t ND']
  },
  {
    id: 30,
    section: 'Support and Communication',
    question: 'When you\'re struggling at work, what would you most want someone to do?',
    type: 'textarea',
    options: null
  },
  {
    id: 31,
    section: 'Support and Communication',
    question: 'What\'s one thing managers should STOP doing?',
    type: 'text',
    options: null
  },
  {
    id: 32,
    section: 'Support and Communication',
    question: 'What\'s one thing managers should START doing?',
    type: 'text',
    options: null
  },

  // SECTION 6 - Technology and AI
  {
    id: 33,
    section: 'Technology and AI',
    question: 'How comfortable are you with technology in general? (1 = uncomfortable, 7 = very comfortable)',
    type: 'scale',
    options: null
  },
  {
    id: 34,
    section: 'Technology and AI',
    question: 'How comfortable are you with AI tools (e.g. ChatGPT)? (1 = uncomfortable, 7 = very comfortable)',
    type: 'scale',
    options: null
  },
  {
    id: 35,
    section: 'Technology and AI',
    question: 'Have you used AI tools (ChatGPT, Claude, Copilot etc.) at work?',
    type: 'select',
    options: ['Yes - regularly', 'Yes - occasionally', 'Tried it once or twice', 'No']
  },
  {
    id: 36,
    section: 'Technology and AI',
    question: 'If yes - for what? (Select all that apply)',
    type: 'checkbox',
    options: ['Writing emails', 'Summarising documents', 'Drafting reports', 'Brainstorming', 'Decoding confusing messages', 'Generating ideas', 'Breaking down complex tasks', 'Coding / technical work', 'Personal organisation', 'Therapy-like conversation', 'Other']
  },
  {
    id: 37,
    section: 'Technology and AI',
    question: 'If you haven\'t used AI tools - what\'s stopped you?',
    type: 'textarea',
    options: null
  },
  {
    id: 38,
    section: 'Technology and AI',
    question: 'What would make you TRUST an AI tool at work? (Select all that apply)',
    type: 'checkbox',
    options: ['Strong privacy guarantees', 'Independent privacy certification', 'Designed specifically for neurodivergent users', 'Recommended by my coach / therapist / doctor', 'Recommended by Access to Work', 'Free to me', 'I\'ve tried it and it works', 'Other']
  },

  // SECTION 7 - Privacy
  {
    id: 39,
    section: 'Privacy',
    question: 'On a scale of 1-7, how important is data privacy to you at work? (1 = not important, 7 = very important)',
    type: 'scale',
    options: null
  },
  {
    id: 40,
    section: 'Privacy',
    question: 'Would you be comfortable with an AI tool that can read what\'s on your screen, if it runs entirely on your device and nothing leaves your laptop?',
    type: 'select',
    options: ['Yes - that sounds fine', 'Yes - with the right protections', 'Maybe - I\'d want to know more', 'No', 'Hard no']
  },
  {
    id: 41,
    section: 'Privacy',
    question: 'Which protections matter most? (Select all that apply)',
    type: 'checkbox',
    options: ['All processing on my device - no cloud', 'I can pause it at any time', 'I can see what it has stored', 'I can delete what it has stored', 'Employer cannot see my data', 'Independent audit of the software', 'Source code openly available', 'Other']
  },
  {
    id: 42,
    section: 'Privacy',
    question: 'What would worry you about your employer seeing AI-generated data about your work?',
    type: 'textarea',
    options: null
  },

  // SECTION 8 - If we could build the right thing
  {
    id: 43,
    section: 'Your Needs',
    question: 'If an AI cognitive assistant could quietly help you with ONE thing at work, what would it be?',
    type: 'textarea',
    options: null
  },
  {
    id: 44,
    section: 'Your Needs',
    question: 'Which of these would you want most? (Select your top 3)',
    type: 'checkbox',
    options: ['Help prioritising my inbox', 'Breaking complex tasks into manageable steps', 'Decoding ambiguous emails or messages', 'Protecting my focus during deep work', 'Gentle nudges when I\'m distracted', 'Re-entry support after breaks', 'End-of-day wrap-up of what I did', 'Drafting responses to communications', 'Translating my own messages before I send them', 'Reminders that adapt to MY rhythm, not the clock', 'Energy / mood awareness', 'Sensory environment management', 'Meeting prep and follow-up notes', 'Other']
  },
  {
    id: 45,
    section: 'Your Needs',
    question: 'If this tool were free to you (funded through Access to Work), would you try it?',
    type: 'select',
    options: ['Yes, definitely', 'Probably yes', 'Maybe', 'Probably not', 'No']
  },
  {
    id: 46,
    section: 'Your Needs',
    question: 'If it WASN\'T free, what would you be willing to pay?',
    type: 'select',
    options: ['Only if free', '£5 / month', '£10 / month', '£20 / month', '£30+ / month if it really helped', 'Employer would pay, not me', 'I\'d want to try before committing']
  },
  {
    id: 47,
    section: 'Your Needs',
    question: 'Is there anything you wish someone had built for you years ago?',
    type: 'textarea',
    options: null
  },
  {
    id: 48,
    section: 'Your Needs',
    question: 'Would you be willing to test an early version of Zeen A in the next 6 months?',
    type: 'select',
    options: ['Yes - please contact me', 'Maybe - depends on what\'s involved', 'No, thanks']
  },

  // SECTION 9 - Anything else
  {
    id: 49,
    section: 'Final Thoughts',
    question: 'Anything we didn\'t ask that you wish we had?',
    type: 'textarea',
    options: null
  },
  {
    id: 50,
    section: 'Final Thoughts',
    question: 'May we contact you for follow-up research? (Optional)',
    type: 'text',
    options: null
  }
];