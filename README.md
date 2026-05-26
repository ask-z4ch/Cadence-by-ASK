# cadence

a coordination platform for universities. replaces fragmented tools — whatsapp groups, scattered emails, static spreadsheets — with a single real-time system for students, faculty, and administration.

---

## features

**role-based access** — each user sees what they need. students track deadlines and submissions. faculty manage assessments and schedules. administrators have full oversight.

**priority feed** — academic items are ranked by urgency and importance using a weighted formula based on days remaining, event type, and marks weightage.

**clash detection** — when two events overlap for the same batch, the system flags the conflict, notifies involved users, and logs it for admin resolution.

**assignment workflow** — students upload submissions, faculty grade them, status propagates in real time.

**broadcast system** — administrators send targeted announcements to all users, filtered by role.

**notifications** — in-app alerts for deadlines, clashes, broadcasts, and schedule changes.

---

## stack

| layer | choice |
|---|---|
| frontend | react native, expo |
| backend | convex (real-time sync, embedded database, server functions) |
| auth | convex auth |
| storage | convex storage |
| platforms | ios, android, web |

---

## getting started

requires node 20+ and a [convex](https://convex.dev) account (free tier works).

```sh
git clone <repo-url>
cd cadence

npm install
npx convex dev     # start local backend, generate types
npx expo start     # start the dev server
```

visit `http://localhost:8081` for web, or scan the QR code with expo go for mobile.

---

## project structure

```
convex/              backend — schema, server functions, auth
  schema.ts          7 tables: users, departments, batches, events,
                    submissions, clashes, notifications
  auth.ts            register / login
  events.ts          create, list, clash detection
  submissions.ts     submit, grade, list
  clashes.ts         detect, resolve
  notifications.ts   send, broadcast, mark read
  priority.ts        weighted priority algorithm

src/
  app/               expo router screens
    (auth)/          login, register
    (student)/       dashboard, calendar, assignments, alerts
    (faculty)/       dashboard, assessments, schedule, submissions
    (admin)/         command centre, events, broadcasts
  components/        shared ui
  lib/               theme, auth context, convex client, helpers
```

---

## database

seven tables in convex's embedded database:

- **users** — name, email, role, department, batch
- **departments** — name, code, faculty associations
- **batches** — year, section, linked to department
- **events** — exams, assignments, classes, university events
- **submissions** — student uploads, grading status, marks
- **clashes** — detected conflicts, severity, resolution
- **notifications** — alerts, broadcasts, delivery status

---

## priority algorithm

items are scored as:

```
priority = (1 / daysRemaining) × typeWeight × marksWeight
```

type weights: exam = 10, assignment = 7, university event = 5, class = 3, extracurricular = 1

higher scores appear first in the feed.

---

## license

mit
