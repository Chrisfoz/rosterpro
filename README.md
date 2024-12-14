# RosterPro - Church Service Management System

## Project Overview
A roster management system designed to handle complex church service scheduling requirements, with AI-assisted roster generation and rule validation.

## Core Features

### Phase 1: Rules & Initial Setup
- [ ] Define and implement roster rules engine
- [ ] AI-assisted rule suggestions based on existing roster patterns
- [ ] Upload and analysis of existing rosters for pattern learning
- [ ] Rule validation and confirmation system

### Phase 2: Roster Generation & Management
- [ ] Generate rosters for 1-16 week periods
- [ ] Real-time rule validation during roster editing
- [ ] Rule violation flagging and suggestions
- [ ] Roster finalization workflow

### Phase 3: Communication & Notifications
- [ ] Automated PDF roster distribution via email
- [ ] Weekly roster reminders
- [ ] SMS shift reminders to individuals
- [ ] Issue reporting system for roster concerns

### Phase 4: User Management & Monetization
- [ ] User authentication system
- [ ] Role-based access control
- [ ] Guidance and documentation pages
- [ ] Subscription management
- [ ] Free trial system (one-time use before payment)

## Technical Features

### AI Integration
- Intelligent roster pattern recognition
- Rule suggestion based on historical data
- Conflict detection and resolution

### File Management
- Support for existing roster uploads
- PDF generation and distribution
- Historical roster analysis

### Communication
- Email integration for roster distribution
- SMS integration for reminders
- Issue reporting and tracking

### Security & Access
- Secure authentication
- Role-based permissions
- Data encryption

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Chrisfoz/rosterpro.git

# Install dependencies
cd rosterpro
npm install

# Set up environment variables
cp .env.example .env

# Run development server
npm run dev
```

## Documentation

- [Roster Rules](./docs/ROSTER_RULES.md)
- [API Documentation](./docs/API.md)
- [User Guide](./docs/USER_GUIDE.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.