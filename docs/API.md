# RosterPro API Documentation

## Authentication

### Login
`POST /api/auth/login`
```json
{
  "email": "string",
  "password": "string"
}
```

### Get Profile
`GET /api/auth/profile`

### Update Profile
`PUT /api/auth/profile`
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "languageSkills": {
    "english": "none" | "basic" | "fluent",
    "italian": "none" | "basic" | "fluent"
  }
}
```

## Roster Management

### Get Current Roster
`GET /api/roster/current`

### Get Monthly Roster
`GET /api/roster/month/:yearMonth`

### Create Roster Assignment
`POST /api/roster/assign`
```json
{
  "memberId": "number",
  "roleId": "number",
  "date": "string (YYYY-MM-DD)",
  "serviceType": "english" | "italian"
}
```

### Remove Roster Assignment
`DELETE /api/roster/assignment/:id`

### Validate Roster
`POST /api/roster/validate`
```json
{
  "assignments": [{
    "memberId": "number",
    "roleId": "number",
    "date": "string",
    "serviceType": "string"
  }]
}
```

## Availability Management

### Get Monthly Availability
`GET /api/availability/month/:yearMonth`

### Update Availability
`POST /api/availability`
```json
{
  "date": "string (YYYY-MM-DD)",
  "isAvailable": "boolean",
  "reason": "string?"
}
```

## Team Management

### Get Team Members
`GET /api/members`

### Get Available Members
`GET /api/members/available`
Query Parameters:
- date: YYYY-MM-DD
- roleId: number

### Update Member Roles
`PUT /api/members/:id/roles`
```json
{
  "roles": [{
    "roleId": "number",
    "skillLevel": "number"
  }]
}
```

## Role Management

### Get Roles
`GET /api/roles`

### Create Role
`POST /api/roles`
```json
{
  "name": "string",
  "category": "string",
  "maxCapacity": "number?",
  "requiresTraining": "boolean"
}
```

### Update Role
`PUT /api/roles/:id`

### Delete Role
`DELETE /api/roles/:id`

## Preferences

### Get Preferences
`GET /api/preferences`

### Update Preferences
`PUT /api/preferences`
```json
{
  "maxServingFrequency": "number",
  "preferredRoles": "string[]",
  "familyServePreference": "together" | "separate" | "no-preference",
  "languageSkills": {
    "english": "none" | "basic" | "fluent",
    "italian": "none" | "basic" | "fluent"
  }
}
```

## Error Responses

```json
{
  "error": "string",
  "message": "string",
  "details": "object?"
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Internal Server Error

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Pagination

Endpoints that return lists support pagination using query parameters:
- page: number (default: 1)
- limit: number (default: 20, max: 100)

Response includes pagination metadata:
```json
{
  "data": [],
  "pagination": {
    "total": "number",
    "page": "number",
    "limit": "number",
    "pages": "number"
  }
}
```