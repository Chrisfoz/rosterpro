# Church Service Scheduling Rules

This document outlines the core rules and considerations for creating service rosters. These rules should be implemented in the scheduling algorithm and respected during manual adjustments.

## 1. Serving Frequency 🗓️

### Core Rules
- Maximum serving frequency: **2 times per month** (out of 4 weeks)
- This rule should be strictly enforced unless explicitly overridden
- System should track and warn when approaching or exceeding limits

### Implementation Considerations
- Track serving frequency on a rolling 4-week basis
- Consider both Italian and English services in frequency calculations
- Provide override capability for special circumstances with documentation

## 2. Family Grouping 👨‍👩‍👧‍👦

### Core Rules
- Young members (12-16) should serve alongside family when possible
- Honor parent requests to serve with children
- Accommodate couple requests to serve together

### Implementation Considerations
- Maintain family relationship data in the system
- Flag young members (12-16) for special handling
- Track serving preferences for families
- Allow for family grouping exceptions when necessary

## 3. Role Conflict Management ⚠️

### Core Rules
- No simultaneous role assignments
- Respect individual preferences regarding multiple roles
- Example: Some members prefer not to handle announcements and video on the same day

### Implementation Considerations
- Maintain a role conflict matrix
- Track individual role combination preferences
- Implement hard constraints for simultaneous roles
- Allow for soft constraints based on preferences

## 4. Skill Matching 🎯

### Core Rules
- Match complementary skills for:
  - Guitar positions
  - Vocal roles
  - Leadership positions
- Balance technical teams with mixed experience levels

### Implementation Considerations
- Maintain skill level ratings for each role
- Track experience levels
- Implement team composition rules
- Ensure knowledge transfer opportunities

## 5. Capacity Management 📊

### Core Rules
- Maximum stage capacity: 10 people (in-ear monitor system limit)
- Balance requirements:
  - Instrument allocation
  - Vocal positions
  - Technical equipment limitations

### Implementation Considerations
- Track equipment inventory and limitations
- Implement hard capacity constraints
- Monitor equipment usage and availability
- Provide warnings when approaching capacity limits

## 6. Language Requirements 🌐

### Core Rules
- Match language skills to service requirements:
  - Italian service capabilities
  - English service capabilities
- Consider bilingual requirements for certain roles

### Implementation Considerations
- Track language proficiency levels
- Maintain language requirements for each role
- Ensure appropriate language coverage for each service

## 7. Multi-Service Scheduling 🔄

### Core Rules
- Some members must serve in both Italian and English services
- Consider travel/transition time between services
- Maintain service quality across different language services

### Implementation Considerations
- Track multi-service availability
- Consider physical location and transition times
- Implement rest periods between services
- Monitor workload for multi-service participants

## 8. Planning Timeline 📅

### Core Rules
- Create rosters 6-8 weeks in advance
- Plan for complete month, two months ahead
- Allow for adjustments and updates as needed

### Implementation Considerations
- Implement planning horizon constraints
- Provide draft and final roster states
- Allow for version control of rosters
- Include change tracking and notification system

## Special Considerations

### Holiday Periods
- Plan for reduced availability during common holiday periods
- Implement backup plans for key roles
- Consider seasonal variations in attendance and requirements

### Emergency Changes
- Maintain list of backup volunteers
- Define emergency substitution procedures
- Track last-minute changes and patterns

### Skill Development
- Create opportunities for training and mentoring
- Track progression of skills and capabilities
- Plan for gradual role transitions

## System Implementation Guidelines

### Priority Levels
1. **Hard Constraints** (Must be met)
   - Maximum serving frequency
   - Role conflicts
   - Capacity limits
   - Language requirements

2. **Soft Constraints** (Should be met when possible)
   - Family grouping preferences
   - Skill matching optimization
   - Individual role preferences

3. **Optimization Goals**
   - Even distribution of serving load
   - Skill development opportunities
   - Team cohesion and effectiveness

### Change Management
- Document all rule exceptions
- Track pattern of changes and adjustments
- Regular review of rule effectiveness
- Process for updating rules based on feedback

---

*Note: These rules should be regularly reviewed and updated based on practical experience and feedback from the team. The implementation should be flexible enough to accommodate future rule changes and additions.*