# Kasirize

**Kasirize** is a mobile-first Progressive Web App that helps young South Africans turn informal experience into credible skills, practical work experience, income opportunities, and career mobility.

Many young people have valuable experience from helping in family businesses, spaza shops, caregiving, selling products, tutoring, volunteering, or community work. However, employers often cannot see or verify this experience because it does not appear on a formal CV.

Kasirize solves this by helping young people:

- Describe their informal experience in their own words.
- Use AI to identify possible skills.
- Confirm, edit, or remove AI-extracted skills.
- Build a credible profile.
- Complete nearby micro-tasks or micro-internships.
- Receive ratings, reviews, evidence, badges, and confidence scores.
- Get matched to entry-level opportunities.
- Access mentorship and work-readiness support.
- Reduce transport and data barriers.

## Live Website

Kasirize is hosted on Vercel:

[https://kasirize.vercel.app/](https://kasirize.vercel.app/)

## How to Test Kasirize

1. Open the live website:  
   [https://kasirize.vercel.app/](https://kasirize.vercel.app/)

2. Click **Sign In**.

3. Choose a demo account from the available demo accounts.

4. Kasirize will authenticate the selected demo account and redirect you to the correct dashboard based on the account role.

### Demo Accounts

Kasirize includes demo accounts for testing each user role.

| Role           | What you can test                                                                                                                         |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Youth          | Build a profile, extract skills, browse tasks and opportunities, apply, complete tasks, view ratings, badges, confidence scores, and chat |
| Task Requester | Post a task, view applications, accept a Youth, confirm completion, rate and review a Youth, and release payment                          |
| Employer       | Post opportunities, view candidate profiles, view evidence and achievements, invite candidates to interviews, and fund transport support  |
| Skill Mentor   | Create mentorships, view mentees, track learning progress, confirm completion, and rate participation                                     |
| Admin          | Review reports, manage users, review tasks, resolve disputes, verify requesters and employers, and view platform health                   |

Select a demo account from the sign-in screen to automatically sign in and access the correct dashboard for that role.

## Kasirize User Roles

Kasirize has five user roles:

1. Youth
2. Task Requester
3. Employer
4. Skill Mentor
5. Admin

### Youth

The Youth is the main user of Kasirize.

A Youth can:

- Create a profile.
- Describe informal experience.
- Use AI to identify possible skills.
- Confirm, edit, or remove AI-extracted skills.
- Upload evidence.
- Browse Vula Tasks.
- Apply for tasks.
- Complete tasks.
- Submit completion evidence.
- Browse opportunities.
- Save opportunities.
- Apply for opportunities.
- Track applications.
- Chat with task requesters, employers, and skill mentors.
- Request transport support.
- View interview invitations.
- View achievements, badges, ratings, reviews, and confidence scores.

### Task Requester

A Task Requester is a household, small business, community organisation, or individual that needs short-term help.

A Task Requester can:

- Create a task requester profile.
- Post a task.
- Set task budget, duration, location, skills, deadline, and safety details.
- Review task applications.
- Accept a Youth.
- Chat with a Youth.
- Confirm task completion.
- Rate the Youth.
- Add a written review.
- Select skills demonstrated.
- Release payment.
- Report abuse or fraud.

### Employer

An Employer is a business or organisation offering longer-term opportunities.

An Employer can:

- Create an employer and organisation profile.
- Post jobs, internships, learnerships, training, and micro-internships.
- View candidate shortlists.
- View evidence-based Youth profiles.
- View completed tasks, badges, ratings, reviews, and confidence scores.
- Invite Youth to interviews.
- Fund interview transport credits.
- Track applications.
- Access basic hiring metrics.

### Skill Mentor

A Skill Mentor is a trainer, coach, community leader, or organisation that helps Youth build skills.

A Skill Mentor can:

- Create a skill mentor profile.
- Offer mentorship.
- Offer training.
- Offer workshops.
- Offer learning resources.
- Offer micro-courses.
- Confirm learning completion.
- Confirm skill development.
- Rate Youth participation.
- Add written feedback.
- Track mentees.
- Track learning progress.

### Admin

An Admin is a trusted Kasirize team member.

An Admin can:

- Review reports.
- Review fraud and scam reports.
- Resolve task disputes.
- Verify task requesters and employers.
- Remove abusive messages.
- Suspend or warn users.
- View platform health.
- Manage demo data.
- View audit logs.

## Kasirize Core Journey

Kasirize follows this core journey:

```text
Youth describes informal experience
→ AI identifies possible skills
→ Youth confirms or edits skills
→ Youth saves profile
→ Youth completes a nearby task or micro-internship
→ Task Requester confirms completion
→ Task Requester rates the Youth
→ Evidence, confidence score, and badge are created
→ Youth profile credibility improves
→ Kasirize matches Youth to opportunities
→ Youth applies, saves, or requests transport support
```

## Example

Thabiso helped at his uncle’s spaza shop. He counted stock, served customers, handled cash, and restocked shelves.

Kasirize identifies possible skills:

- Stock counting
- Customer service
- Cash handling
- Reliability
- Attention to detail

Thabiso confirms these skills. He then completes a nearby stock-counting task. The shop owner confirms completion, rates him 5/5, and confirms his skills.

Kasirize creates:

```text
Thabiso has Stock Counting experience earned from a Spaza Shop Stock Counting Task.
Confidence: 90%
Badge: Stock Counting Verified
```

The confidence score is transparent:

```text
Requester rating: 5/5
Task completed and confirmed
Evidence submitted
Similar task completed before
```

## Key Features

- AI skill extraction from informal experience.
- Skill confirmation and editing.
- Credible Youth profile.
- Evidence upload.
- Referee confirmation.
- Micro-tasks and micro-internships.
- Task applications and tracking.
- Task completion confirmation.
- Requester ratings and reviews.
- Verified badges and achievements.
- Transparent confidence scores.
- Entry-level opportunity matching.
- Job, internship, learnership, and training listings.
- Mentorship and work-readiness support.
- Safe chat between Youth, requesters, employers, and mentors.
- Interview invitations and tracking.
- Transport-cost estimates and transport-support requests.
- Mobile-first PWA designed for low-end Android phones and limited data.
- Role-based dashboards for Youth, Task Requesters, Employers, Skill Mentors, and Admins.

## Technology Stack

Kasirize is built using the following technologies:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI
- Zod
- React Hook Form
- TanStack Query
- Zustand
- Drizzle ORM
- PostgreSQL
- Neon PostgreSQL
- Better Auth
- Better Auth Magic Link
- Nodemailer
- Google Gemini API
- Cloudflare R2
- Supabase
- Supabase Realtime
- Supabase Row Level Security
- Inngest
- PostHog
- Vercel
- Vitest
- Playwright
- GitHub Actions
- Git
- GitHub

## Database Architecture

Kasirize uses PostgreSQL as the permanent source of truth for product data.

Neon PostgreSQL stores:

- Users
- Profiles
- Skills
- Profile skills
- Evidence
- Opportunities
- Applications
- Organisations
- Employers
- Tasks
- Task applications
- Task completions
- Task ratings
- Task reviews
- Achievements
- Confidence scores
- Interview invitations
- Transport support requests
- Wallet accounts
- Wallet transactions
- Notifications
- Audit logs

Supabase stores chat-specific data:

- Conversations
- Conversation participants
- Messages
- Message attachments
- Message reactions
- Reports
- Blocks
- Moderation actions

Kasirize uses the same Better Auth user UUID across both databases. Task and opportunity IDs are linked to Supabase conversations through application-level UUID references.

## Authentication and Authorisation

Kasirize uses Better Auth with PostgreSQL and Drizzle ORM.

The platform supports:

- Guest mode.
- Email magic-link authentication.
- Email verification.
- Secure HTTP-only session cookies.
- Role-based access control.
- Rate limiting.
- Session management.
- Demo accounts for testing.

Kasirize has the following roles:

```text
youth
task_requester
employer
skill_mentor
admin
```

After login, Kasirize redirects each user to the correct dashboard based on their role:

```text
Youth → /dashboard/user
Task Requester → /dashboard/requester
Employer → /dashboard/employer
Skill Mentor → /dashboard/mentor
Admin → /dashboard/admin
```

Role-based access control is enforced on the server. The platform never relies only on client-side role checks.

## AI Features

Kasirize uses the Google Gemini API through protected server-side Next.js API routes.

AI is used for:

- Skill extraction.
- Opportunity-match explanations.
- Interview preparation.
- Profile summaries.
- Confidence-score explanations.
- Mentor recommendations.

Gemini is never called directly from the browser. The Gemini API key is stored in environment variables and is never exposed to the client.

All AI input and output are validated using Zod. If no Gemini API key is configured, Kasirize returns deterministic mock results so the platform remains testable.

## Security

Kasirize follows a Secure System Development Cycle.

Security controls include:

- Role-based access control.
- Secure HTTP-only session cookies.
- Email magic-link authentication.
- Email verification.
- Rate limiting.
- Server-side Gemini API calls.
- Zod validation for user input and AI output.
- Parameterised database queries through Drizzle ORM.
- Secure file storage through Cloudflare R2.
- Supabase Row Level Security for chat data.
- Audit logs for sensitive actions.
- Report, block, and moderation features.
- Privacy-by-default profile visibility.
- No public exposure of phone numbers, email addresses, exact home addresses, or evidence files.
- GitHub Actions CI/CD pipeline.
- Automated testing and dependency scanning.

Kasirize does not collect South African ID numbers. The platform is designed with POPIA-aware data-handling principles.

## Environment Variables

Create a `.env` file based on `.env.example`.

Do not commit real environment variables or secrets to GitHub.

```env
APP_URL=
DATABASE_URL=
DIRECT_DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GEMINI_API_KEY=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_BASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

## Local Setup

To run Kasirize locally:

```bash
git clone <your-github-repository-link>
cd kasirize
npm install
cp .env.example .env
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
```

Runs the app in development mode.

```bash
npm run build
```

Builds the app for production.

```bash
npm run start
```

Starts the production server.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run test
```

Runs Vitest tests.

```bash
npm run test:e2e
```

Runs Playwright end-to-end tests.

## GitHub Actions Pipeline

Kasirize uses GitHub Actions for continuous integration and deployment security.

The pipeline automatically:

- Installs dependencies.
- Checks TypeScript types.
- Runs ESLint.
- Runs Vitest unit and integration tests.
- Runs Playwright end-to-end tests.
- Builds the Next.js application.
- Scans dependencies for vulnerabilities.
- Checks for exposed secrets.
- Blocks merges if critical checks fail.

Sensitive values such as database credentials, Gemini API keys, SMTP passwords, Cloudflare R2 secrets, and Supabase keys are stored as GitHub Actions secrets or Vercel environment variables. They are never stored in the repository or exposed to the browser.

## Deployment

Kasirize is deployed on Vercel.

Live website:

[https://kasirize.vercel.app/](https://kasirize.vercel.app/)

Vercel environment variables are configured separately for Production, Preview, and Development environments. Sensitive values are never committed to GitHub.

## Demo Data

Kasirize includes realistic South African demo data for testing.

Demo data includes:

- Youth profiles.
- Task requester profiles.
- Employer profiles.
- Skill mentor profiles.
- Skills.
- Opportunities.
- Micro-tasks.
- Evidence records.
- Completed tasks.
- Ratings.
- Reviews.
- Achievements.
- Confidence scores.
- Interview invitations.
- Transport-support requests.
- Chat conversations.
- Chat messages.

All demo data is clearly labelled as demo data and does not represent real private individuals.

## Privacy

Kasirize is designed with privacy in mind.

- Youth control their profile visibility.
- Profiles are private by default.
- AI-extracted skills must be confirmed by the Youth.
- Evidence files are not publicly accessible.
- Phone numbers, email addresses, and exact home addresses are not publicly exposed.
- Users can report abuse, block users, and delete local demo data.
- Kasirize does not collect South African ID numbers.

## License

This project was created for the FNB App of the Year Hackathon 2026.

© Kasirize Team.
