export interface ProcessStep {
  number: string;
  title: string;
  summary: string;
  description: string;
  clientRole: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Start with a conversation',
    summary: 'Talk through the business, the website you need, and what is not working today.',
    description:
      'The first step is a practical discussion about your business, customers, services, and goals. You do not need to arrive with a technical specification or have every detail figured out.',
    clientRole: 'Bring your questions, examples of what you like, and any existing website or brand materials.',
  },
  {
    number: '02',
    title: 'Define the scope',
    summary: 'Turn the conversation into a clear proposal with agreed deliverables and responsibilities.',
    description:
      'The project scope sets out the pages, features, content needs, and technical work involved. It also identifies anything outside the project so expectations are clear before design and development begin.',
    clientRole: 'Review the proposal, ask questions, and approve the scope before work starts.',
  },
  {
    number: '03',
    title: 'Design and build',
    summary: 'Shape the content and visual direction, then implement the website with care.',
    description:
      'The studio develops the page structure, design, and working website around the agreed scope. Decisions about layout, mobile behavior, accessibility, and performance are handled as part of the build—not deferred to the end.',
    clientRole: 'Provide the agreed business information, copy input, images, and timely feedback needed for the project.',
  },
  {
    number: '04',
    title: 'Review and refine',
    summary: 'Check the real website, gather feedback, and resolve the agreed revisions.',
    description:
      'You review the working site rather than trying to imagine the result from a static picture. The studio checks content, links, responsive layouts, forms, and technical details while incorporating the revisions defined in the project scope.',
    clientRole: 'Review the agreed pages and features, then provide clear, consolidated feedback.',
  },
  {
    number: '05',
    title: 'Launch and look after it',
    summary: 'Complete launch checks, connect the production setup, and decide what support you need next.',
    description:
      'After approval, the website is deployed and the domain, HTTPS, metadata, and key user paths are checked. If ongoing maintenance is part of your engagement, its scope is already clear; if not, you receive the agreed handoff.',
    clientRole: 'Approve the finished website and coordinate any account or domain access needed for launch.',
  },
];
