export const familyQuestions = [
  // SECTION 1 - About you and your loved one
  {
    id: 1,
    section: 'About You',
    question: 'What is your relationship to the neurodivergent person?',
    type: 'select',
    options: ['Parent', 'Partner / spouse', 'Sibling', 'Adult child', 'Close friend', 'Other family member', 'Carer (formal or informal)', 'Other']
  },
  {
    id: 2,
    section: 'About You',
    question: 'Approximately how old is your loved one?',
    type: 'select',
    options: ['18-25', '26-35', '36-45', '46-55', '56+', 'Prefer not to say']
  },
  {
    id: 3,
    section: 'About You',
    question: 'What is their neurodivergence (as far as you know)? (Select all that apply)',
    type: 'checkbox',
    options: ['ADHD', 'Autism / Autistic', 'Dyslexia', 'Dyspraxia', 'Dyscalculia', 'Tourette\'s', 'Multiple of the above', 'Self-identifying / undiagnosed', 'Mental health overlaps', 'Don\'t know precisely', 'Other']
  },
  {
    id: 4,
    section: 'About You',
    question: 'When were they diagnosed (or did they start to identify)?',
    type: 'select',
    options: ['Childhood', 'Adolescence', 'Young adulthood', 'Mid-life', 'Later', 'Still seeking diagnosis', 'Self-identify only', 'Don\'t know']
  },
  {
    id: 5,
    section: 'About You',
    question: 'Do YOU have lived experience of neurodivergence yourself?',
    type: 'select',
    options: ['Yes - diagnosed', 'Yes - self-identify', 'Suspected but not confirmed', 'No', 'Prefer not to say']
  },
  {
    id: 6,
    section: 'About You',
    question: 'How close are you to your loved one - in terms of involvement in their daily life?',
    type: 'select',
    options: ['Very close - daily contact', 'Close - weekly contact', 'Connected - monthly or so', 'Distant but supportive', 'Strained / difficult', 'Prefer not to say']
  },

  // SECTION 2 - Their work journey
  {
    id: 7,
    section: 'Their Work Journey',
    question: 'Are they currently working?',
    type: 'select',
    options: ['Yes - full-time', 'Yes - part-time', 'Self-employed', 'Looking for work', 'On leave', 'Studying', 'Not seeking work', 'Don\'t know currently']
  },
  {
    id: 8,
    section: 'Their Work Journey',
    question: 'What sector or kind of work?',
    type: 'text',
    options: null
  },
  {
    id: 9,
    section: 'Their Work Journey',
    question: 'Have they ever left a job because of neurodivergence-related challenges?',
    type: 'select',
    options: ['Yes - multiple times', 'Yes - once', 'Possibly', 'No', 'Don\'t know']
  },
  {
    id: 10,
    section: 'Their Work Journey',
    question: 'What KIND of work seems to suit them?',
    type: 'textarea',
    options: null
  },
  {
    id: 11,
    section: 'Their Work Journey',
    question: 'What kind of work seems to NOT suit them?',
    type: 'textarea',
    options: null
  },

  // SECTION 3 - What you see
  {
    id: 12,
    section: 'What You See',
    question: 'What work-related challenges have you observed them face?',
    type: 'textarea',
    options: null
  },
  {
    id: 13,
    section: 'What You See',
    question: 'What conversations do you and they have about their work?',
    type: 'textarea',
    options: null
  },
  {
    id: 14,
    section: 'What You See',
    question: 'What do they tend to AVOID talking about regarding work?',
    type: 'textarea',
    options: null
  },
  {
    id: 15,
    section: 'What You See',
    question: 'In your view, what\'s the hardest part for THEM?',
    type: 'textarea',
    options: null
  },
  {
    id: 16,
    section: 'What You See',
    question: 'What\'s the hardest part for YOU, as someone who loves them and watches them navigate this?',
    type: 'textarea',
    options: null
  },
  {
    id: 17,
    section: 'What You See',
    question: 'Are there warning signs you\'ve learned to recognise - moments when things are about to get harder?',
    type: 'textarea',
    options: null
  },

  // SECTION 4 - Support patterns
  {
    id: 18,
    section: 'Support Patterns',
    question: 'Do you actively support them with work-related challenges? How?',
    type: 'textarea',
    options: null
  },
  {
    id: 19,
    section: 'Support Patterns',
    question: 'What kinds of help do they ACCEPT from you?',
    type: 'textarea',
    options: null
  },
  {
    id: 20,
    section: 'Support Patterns',
    question: 'What kinds do they REJECT or push back on?',
    type: 'textarea',
    options: null
  },
  {
    id: 21,
    section: 'Support Patterns',
    question: 'Have you ever helped them with any of these? (Select all that apply)',
    type: 'checkbox',
    options: ['Job applications', 'Interview prep', 'Daily task management', 'Emotional regulation around work stress', 'Organising their schedule', 'Advocating with their employer or HR', 'Accessing Access to Work or other support', 'Communicating with managers or colleagues on their behalf', 'Sensory environment changes', 'Medication reminders / health management', 'Other']
  },
  {
    id: 22,
    section: 'Support Patterns',
    question: 'Do you ever feel exhausted by the support role?',
    type: 'select',
    options: ['Often', 'Sometimes', 'Rarely', 'Never', 'Prefer not to say']
  },
  {
    id: 23,
    section: 'Support Patterns',
    question: 'Do you have anyone supporting YOU through this?',
    type: 'textarea',
    options: null
  },

  // SECTION 5 - Current support landscape
  {
    id: 24,
    section: 'Current Support',
    question: 'Have they worked with a coach, therapist or specialist for work-related needs?',
    type: 'select',
    options: ['Yes, currently', 'Yes, in the past', 'Considered it', 'No', 'Don\'t know']
  },
  {
    id: 25,
    section: 'Current Support',
    question: 'Do YOU know about Access to Work (AtW)?',
    type: 'select',
    options: ['Yes - I know it well', 'Heard of it', 'No', 'Not sure']
  },
  {
    id: 26,
    section: 'Current Support',
    question: 'Have they used AtW?',
    type: 'select',
    options: ['Yes', 'Applied for it', 'No', 'Don\'t know']
  },
  {
    id: 27,
    section: 'Current Support',
    question: 'If they have used AtW - what did you make of the experience?',
    type: 'textarea',
    options: null
  },
  {
    id: 28,
    section: 'Current Support',
    question: 'What support has been most useful to them?',
    type: 'textarea',
    options: null
  },
  {
    id: 29,
    section: 'Current Support',
    question: 'What support has been UNHELPFUL (or worse)?',
    type: 'textarea',
    options: null
  },

  // SECTION 6 - Technology and AI
  {
    id: 30,
    section: 'Technology and AI',
    question: 'How tech-comfortable is your loved one? (1 = uncomfortable, 7 = very comfortable)',
    type: 'scale',
    options: null
  },
  {
    id: 31,
    section: 'Technology and AI',
    question: 'How tech-comfortable are YOU? (1 = uncomfortable, 7 = very comfortable)',
    type: 'scale',
    options: null
  },
  {
    id: 32,
    section: 'Technology and AI',
    question: 'Have either of you used AI tools like ChatGPT?',
    type: 'select',
    options: ['Yes - them only', 'Yes - me only', 'Yes - both', 'Neither', 'Don\'t know']
  },
  {
    id: 33,
    section: 'Technology and AI',
    question: 'What\'s your gut feeling about AI helping them at work?',
    type: 'select',
    options: ['Hopeful', 'Cautiously hopeful', 'Cautious / mixed', 'Worried', 'Strongly worried']
  },
  {
    id: 34,
    section: 'Technology and AI',
    question: 'What\'s behind that feeling?',
    type: 'textarea',
    options: null
  },

  // SECTION 7 - Concerns and hopes
  {
    id: 35,
    section: 'Concerns and Hopes',
    question: 'What worries you most about technology in their workplace?',
    type: 'textarea',
    options: null
  },
  {
    id: 36,
    section: 'Concerns and Hopes',
    question: 'What hopes do you have for them at work?',
    type: 'textarea',
    options: null
  },
  {
    id: 37,
    section: 'Concerns and Hopes',
    question: 'If a tool could quietly help them with one thing at work, what would matter most?',
    type: 'textarea',
    options: null
  },
  {
    id: 38,
    section: 'Concerns and Hopes',
    question: 'What do you think they would SAY if you suggested a tool like Zeen A?',
    type: 'textarea',
    options: null
  },
  {
    id: 39,
    section: 'Concerns and Hopes',
    question: 'Do you think they\'d accept help from an AI assistant?',
    type: 'select',
    options: ['Yes - definitely', 'Probably yes', 'Maybe', 'Probably not', 'Definitely not', 'Don\'t know']
  },
  {
    id: 40,
    section: 'Concerns and Hopes',
    question: 'Why or why not?',
    type: 'textarea',
    options: null
  },

  // SECTION 8 - Privacy
  {
    id: 41,
    section: 'Privacy',
    question: 'How much does your loved one trust technology in general? (1 = distrusts it, 7 = trusts it)',
    type: 'scale',
    options: null
  },
  {
    id: 42,
    section: 'Privacy',
    question: 'Do you ever discuss their data and privacy with them?',
    type: 'select',
    options: ['Often', 'Sometimes', 'Rarely', 'Never', 'Prefer not to say']
  },
  {
    id: 43,
    section: 'Privacy',
    question: 'Would it matter to them that this tool runs entirely on their laptop (no cloud, no employer visibility)?',
    type: 'select',
    options: ['Yes - that would matter a lot', 'Yes - somewhat', 'Probably wouldn\'t change their view', 'No', 'Don\'t know']
  },
  {
    id: 44,
    section: 'Privacy',
    question: 'Would it matter to YOU as a family member?',
    type: 'textarea',
    options: null
  },

  // SECTION 9 - What would help
  {
    id: 45,
    section: 'What Would Help',
    question: 'If Zeen A existed and was free via Access to Work, would you tell them about it?',
    type: 'select',
    options: ['Yes - confidently', 'Probably', 'Maybe', 'Probably not', 'No']
  },
  {
    id: 46,
    section: 'What Would Help',
    question: 'Would YOU want to know what the tool is doing?',
    type: 'select',
    options: ['Yes - full transparency to family', 'Some - at their discretion', 'No - that\'s between them and the tool']
  },
  {
    id: 47,
    section: 'What Would Help',
    question: 'What would help YOU as a family member supporting them?',
    type: 'textarea',
    options: null
  },
  {
    id: 48,
    section: 'What Would Help',
    question: 'What\'s missing from the support available to people like your loved one?',
    type: 'textarea',
    options: null
  },
  {
    id: 49,
    section: 'What Would Help',
    question: 'Anything we didn\'t ask that you wish we had?',
    type: 'textarea',
    options: null
  },
  {
    id: 50,
    section: 'What Would Help',
    question: 'May we contact you for follow-up research? (Optional)',
    type: 'text',
    options: null
  }
];