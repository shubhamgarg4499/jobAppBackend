# Get Jobs

Retrieve jobs with various filters, sorting options, and pagination.

## Endpoint

>>>
GET /api/jobs
>>>

## Query Parameters

| Parameter     | Type     | Description                                      | Required | Default |
|---------------|----------|--------------------------------------------------|----------|---------|
| `jobId`       | string   | Filter by specific job ID                        | No       | -       |
| `title`       | string   | Search by job position                           | No       | -       |
| `position`    | string   | Search by job position (alias for title)        | No       | -       |
| `company`     | string   | Filter by company name                          | No       | -       |
| `Location`    | string   | Filter by job location                          | No       | -       |
| `status`      | string   | Filter by job status                             | No       | -       |
| `workplace`   | string   | Filter by workplace type                        | No       | -       |
| `category`    | string   | Filter by job category                          | No       | -       |
| `salaryFrom`  | number   | Filter by minimum salary                        | No       | -       |
| `page`        | number   | Page number for pagination                       | No       | 1       |
| `limit`       | number   | Number of results per page (max: 30)            | No       | 10      |
| `sortBy`      | string   | Field to sort by                                | No       | -       |
| `sortOrder`   | number   | Sort order (-1 for desc, 1 for asc)             | No       | -1      |

### Allowed Values

- **workplace**: "onsite", "remote", "hybrid"
- **jobType**: "part time", "full time"
- **category**: "private", "ngo", "freelance"
- **jobStatus**: "active", "inactive"

## Response Format

>>>
{
  "success": true,
  "totalJobs": number,
  "currentPage": number,
  "totalPages": number,
  "jobs": [
    {
      "_id": "string",
      "postedBy": "string",
      "jobPosition": "string",
      "jobWorkplace": "string",
      "jobLocation": "string",
      "company": "string",
      "jobType": "string",
      "description": "string",
      "lastDate": "string",
      "category": "string",
      "salaryFrom": "string",
      "salaryTo": "string",
      "qualification": ["string"],
      "jobStatus": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "user": [{
        "fullName": "string",
        "email": "string",
        "profile_picture": "string"
      }]
    }
  ]
}
>>>

## Sorting Examples

### Sort by creation date (newest first):

>>>
GET /api/jobs?sortBy=createdAt&sortOrder=-1
>>>

### Sort by creation date (oldest first):

>>>
GET /api/jobs?sortBy=createdAt&sortOrder=1
>>>

### Sort by salary (highest first):

>>>
GET /api/jobs?sortBy=salaryFrom&sortOrder=-1
>>>

### Sort by company name (alphabetical):

>>>
GET /api/jobs?sortBy=company&sortOrder=1
>>>

### Sort by position name (alphabetical):

>>>
GET /api/jobs?sortBy=jobPosition&sortOrder=1
>>>

## Filter Examples

### Filter by workplace type:

>>>
GET /api/jobs?workplace=remote
>>>

### Filter by job type and location:

>>>
GET /api/jobs?jobType=full time&Location=New York
>>>

### Filter by category and minimum salary:

>>>
GET /api/jobs?category=private&salaryFrom=50000
>>>

### Search by position:

>>>
GET /api/jobs?position=Software Engineer
>>>

### Filter active jobs for a specific company:

>>>
GET /api/jobs?status=active&company=Google
>>>

## Pagination Examples

### Get first page with 10 items:

>>>
GET /api/jobs?page=1&limit=10
>>>

### Get second page with 20 items:

>>>
GET /api/jobs?page=2&limit=20
>>>

## Combined Examples

### Remote jobs, sorted by salary:

>>>
GET /api/jobs?workplace=remote&sortBy=salaryFrom&sortOrder=-1
>>>

### Active private jobs, newest first:

>>>
GET /api/jobs?status=active&category=private&sortBy=createdAt&sortOrder=-1
>>>

### Full-time jobs with pagination:

>>>
GET /api/jobs?jobType=full time&page=1&limit=20&sortBy=createdAt&sortOrder=-1
>>>

## Error Responses

### 400 Bad Request

>>>
{
  "error": "Can't give more than 30 Jobs Data At Once It can Cause App Crash! Change the page to get more Data"
}
>>>

### 500 Server Error

>>>
{
  "error": "Internal server error message"
}
>>>
