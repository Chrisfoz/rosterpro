# RosterPro Technical Architecture

## System Overview

RosterPro is a full-stack web and mobile application for church roster management, built with modern technologies and following best practices for scalability and maintainability.

## Technology Stack

### Frontend
- **Web Application**
  - React.js with TypeScript
  - TailwindCSS for styling
  - Redux Toolkit for state management
  - React Query for API data fetching
  - React Router for navigation
  - Responsive design for mobile web access

- **Mobile Application**
  - React Native
  - Same state management and API integration as web
  - Native UI components
  - Offline capability

### Backend
- **API Server**
  - Node.js with Express
  - TypeScript for type safety
  - JWT authentication
  - RESTful API design

- **Database**
  - PostgreSQL for primary data storage
  - Redis for caching and real-time features

### Infrastructure
- Docker containerization
- CI/CD pipeline
- Cloud hosting (AWS/GCP)
- Automated testing

## Database Schema

### Core Tables

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    language_skills JSON,  -- {"english": "fluent", "italian": "basic"}
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Family relationships
CREATE TABLE family_relationships (
    id SERIAL PRIMARY KEY,
    user1_id INTEGER REFERENCES users(id),
    user2_id INTEGER REFERENCES users(id),
    relationship_type VARCHAR(50), -- parent-child, spouse, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50), -- technical, music, leadership, etc.
    max_capacity INTEGER,
    requires_training BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User roles and skills
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    role_id INTEGER REFERENCES roles(id),
    skill_level INTEGER CHECK (skill_level BETWEEN 1 AND 5),
    is_preferred BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    service_type VARCHAR(50) NOT NULL, -- english, italian
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rosters
CREATE TABLE rosters (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES services(id),
    user_id INTEGER REFERENCES users(id),
    role_id INTEGER REFERENCES roles(id),
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, confirmed, declined
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Availability
CREATE TABLE availability (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    date DATE NOT NULL,
    is_available BOOLEAN DEFAULT true,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role conflicts
CREATE TABLE role_conflicts (
    id SERIAL PRIMARY KEY,
    role1_id INTEGER REFERENCES roles(id),
    role2_id INTEGER REFERENCES roles(id),
    conflict_type VARCHAR(50), -- simultaneous, same-day, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Serving preferences
CREATE TABLE serving_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    preference_type VARCHAR(50), -- family_serve_together, max_frequency, etc.
    preference_value JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Structure

### Core Endpoints

```
/api/v1/
├── auth/
│   ├── login
│   ├── register
│   └── refresh-token
├── users/
│   ├── GET / - List users
│   ├── GET /:id - Get user details
│   ├── PUT /:id - Update user
│   ├── GET /:id/roles - Get user roles
│   └── GET /:id/availability - Get user availability
├── services/
│   ├── GET / - List services
│   ├── POST / - Create service
│   ├── GET /:id/roster - Get service roster
│   └── PUT /:id/roster - Update service roster
├── roles/
│   ├── GET / - List roles
│   ├── POST / - Create role
│   └── GET /:id/conflicts - Get role conflicts
└── rosters/
    ├── GET / - List rosters
    ├── POST / - Create roster
    ├── GET /validate - Validate roster rules
    └── GET /conflicts - Get roster conflicts
```

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Calendar.tsx
│   │   ├── TeamPanel.tsx
│   │   ├── NotificationPanel.tsx
│   │   └── RosterView.tsx
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   └── features/
│       ├── scheduling/
│       ├── notifications/
│       └── validation/
├── pages/
│   ├── Dashboard.tsx
│   ├── RosterPlanner.tsx
│   └── Settings.tsx
├── services/
│   ├── api.ts
│   └── validation.ts
└── state/
    ├── store.ts
    └── slices/
```

## Mobile Architecture

The mobile app will follow a similar structure to the web app, with platform-specific components:

```
src/
├── components/
│   ├── native/
│   │   ├── Calendar.tsx
│   │   └── ListView.tsx
│   └── shared/
├── navigation/
│   └── AppNavigator.tsx
└── screens/
    ├── Dashboard.tsx
    └── RosterView.tsx
```

## Deployment Architecture

```
Infrastructure/
├── Docker/
│   ├── frontend.Dockerfile
│   └── backend.Dockerfile
├── kubernetes/
│   ├── frontend-deployment.yaml
│   └── backend-deployment.yaml
└── scripts/
    └── deploy.sh
```
