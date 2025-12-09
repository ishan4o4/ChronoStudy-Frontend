# ChronoStudy

> A neo-neon study OS for students who live in tabs and playlists.

Study tracking, task management, and friendly competition all in one clean, aesthetic workspace. Built for Gen Z and Alpha students who actually want to *use* their study tools.

## What's This?

ChronoStudy is your personal study operating system. Plan your day with the calendar, throw tasks into your queue, watch your hours stack up, and compete with friends to stay motivated. No bloat. No corporate vibes. Just you, your focus time, and the grind.

**Features:**
- **Dashboard** — Daily snapshot of focus time, streaks, lifetime hours, and completed tasks
- **Tasks** — A clean to-do list that tracks what you need to hit today
- **Calendar** — Schedule study blocks and classes with repeat routines (daily, weekly, monthly, custom)
- **Stats** — Deep dive into your consistency: daily, weekly, monthly breakdowns + long-term streaks
- **Competition** — Challenge your friends. Compare today's focus, weekly totals, monthly totals
- **Notifications** — Smart reminders for high/medium/low priority tasks. Customizable snooze intervals
- **Settings** — Change password, pick your theme vibe (Neo-Neon, Pastel Dream, Terminal Core), tweak notification intervals

## Tech Stack

- **Frontend:** React 19 + Vite
- **Styling:** Tailwind CSS v4 + custom neon CSS
- **State Management:** React Context (Auth + Notifications)
- **Routing:** React Router v7 with future flags
- **HTTP:** Axios with token-based auth
- **Backend API:** Node/Express (assumed, not included in this repo)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repo:
```bash
git clone https://github.com/ishan4o4/ChronoStudy-Frontend.git
cd ChronoStudy-Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables. Rename `.env.example` to  `.env` file in the project root:
```env
VITE_GOOGLE_CLIENT_ID=<your_google_client_id_here>
VITE_API_BASE_URL=http://localhost:5000/api # Example API base URL Change if needed
VITE_TOKEN_KEY=chronostudy_token # Key for storing JWT token in local storage Change if needed
```

4. Start the dev server:
```bash
npm run dev
```

The app will open at `http://localhost:5173` (or whatever Vite assigns).

### Build for production:
```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── pages/              # Page components (Dashboard, Tasks, Calendar, Stats, etc.)
├── components/         # Reusable UI components
├── state/              # React Context providers (Auth, Notifications)
├── utils/              # Helpers (API calls, etc.)
├── index.css           # Global styles + Tailwind directives
├── App.jsx             # Main router setup
└── main.jsx            # Entry point
```

## Key Components

### Authentication
- **AuthContext** — Manages user login/logout, token storage, user state
- **useAuth()** — Hook to access auth context from any component

### Notifications
- **NotificationContext** — Handles notification settings, upcoming reminders, snooze/dismiss logic
- **useNotifications()** — Hook for notification state and actions
- Polls for due notifications every 1 second
- Browser notification support with permission handling

### Pages
- **DashboardPage** — Overview dashboard + today's queue + calendar preview
- **TasksPage** — Full task management (add, complete, filter)
- **CalendarPage** — Visual calendar with study block scheduling
- **StatsPage** — Charts, streaks, daily goal simulator
- **SettingsPage** — User account settings (password, theme, notifications)
- **LandingPage** — Public landing page (for non-authenticated users)
- **Login/Signup** — Auth pages with email/password and Google OAuth

### Components
- **TopBar** — Header with user menu, live indicator, page label
- **Dashboard** — Stats cards, competition bars, focus streak chart
- **CalendarView** — Interactive calendar UI
- **TodoView** — Task list with add/edit/complete actions
- **NotificationCenter** — Popup for active notifications with snooze/dismiss
- **OnboardingOverlay** — First-time user tutorial (spotlight + tooltip)

## API Endpoints (Expected)

The frontend expects a backend at `http://localhost:5000/api`. Key routes:

**Auth:**
- `POST /auth/login` — Email/password login
- `POST /auth/signup` — Create account
- `POST /auth/google` — Google OAuth token exchange
- `POST /auth/change-password` — Update password
- `POST /auth/update-theme` — Save theme preference
- `GET /auth/notification-settings` — Load user notification settings
- `POST /auth/notification-settings` — Save notification settings
- `GET /auth/competition-email` — Load saved competitor email
- `POST /auth/competition-email` — Save competitor email

**Stats:**
- `GET /stats/summary` — User's total hours, today's minutes, completed tasks
- `GET /stats/daily` — Daily stats for last 7 days (or custom range)

**Tasks:**
- `GET /tasks` — List user's tasks
- `POST /tasks` — Create a new task
- `PUT /tasks/:id` — Update task
- `DELETE /tasks/:id` — Delete task
- `POST /tasks/:id/complete` — Mark task complete

**Calendar:**
- `GET /calendar/events` — User's events
- `POST /calendar/events` — Create event
- `PUT /calendar/events/:id` — Update event
- `DELETE /calendar/events/:id` — Delete event

**Notifications:**
- `GET /notifications/upcoming` — List due notifications
- `POST /notifications/dismiss/:taskId` — Dismiss a notification
- `POST /notifications/snooze/:taskId` — Snooze a notification

**Competition:**
- `GET /competition/compare?email=...` — Compare stats with a friend

See your backend docs for exact request/response formats.

## Styling & Themes

The app uses Tailwind CSS with custom utilities:
- **Neo cards:** `.neo-card` — Rounded card with neon glow
- **Neo pills:** `.neo-pill` — Rounded badge/pill
- **Neo buttons:** `.neo-button` — Gradient button with glow
- **Neo inputs:** `.neo-input` — Styled form input

Colors are defined as Tailwind custom colors (`neon-blue`, `neon-pink`, `neon-lime`). Themes affect the overall background and glow (theme switching is UI-only currently; backend support pending).

## Authentication Flow

1. User lands on `/login` or `/signup` (LandingPage if already authenticated)
2. Can sign up with email/password or via Google OAuth
3. On success, token + user data stored in localStorage and AuthContext
4. `BrowserRouter` checks `useAuth()` to render protected routes
5. All API requests include `Authorization: Bearer {token}` header
6. On logout, token/user cleared from storage and context

## Notification Flow

1. User enables notifications in Settings
2. App requests browser notification permission
3. Every 1 second, `NotificationProvider` polls `/notifications/upcoming`
4. If a task is due (`minutesUntilNext <= 0` or `nextNotificationTime` is past), it shows as current
5. User can snooze (delays next notification) or dismiss (marks handled)
6. Browser notification also fires if permission granted

## Development Tips

- **Hot Reload:** Vite watches file changes; just save and refresh
- **DevTools:** React DevTools browser extension helps inspect components and hooks
- **Network Tab:** Check API requests in browser DevTools Network tab to debug backend issues
- **LocalStorage:** User data is persisted; clear it with `localStorage.clear()` to reset
- **Google OAuth:** Make sure your Google Client ID is in `.env` and your redirect URIs are configured in Google Console

## Common Issues

**"Could not log in"**
- Check email/password are correct
- Verify backend is running on `localhost:5000`
- Check browser console for API errors

**Google OAuth not working**
- Confirm `VITE_GOOGLE_CLIENT_ID` is set in `.env`
- Ensure Google sign-in script is loaded: `window.google` should exist
- Check redirect URI in Google Console matches your app URL

**Notifications not showing**
- Browser notifications require permission; check browser settings
- Verify backend `/notifications/upcoming` endpoint is working
- Check browser console for permission errors

**Stats/tasks not loading**
- Ensure backend is running and endpoints exist
- Check your auth token is valid (not expired)
- Clear localStorage and log in again if stuck

## Contributing

Feel free to fork, branch, and send PRs. 

## License

Apache License 2.0.

## Backend Repository

The backend code and API documentation is available here:
📦 **[ChronoStudy-Backend](https://github.com/ishan4o4/ChronoStudy-Backend)**

Clone the backend repo and follow its setup instructions to run the server locally at `localhost:5000`.

## Made by

Ishan — for students who live in tabs and playlists. ✨

---

**Questions?** Check the [backend repo](https://github.com/ishan4o4/ChronoStudy-Backend) or hit me up. Let's make studying less chaotic together.