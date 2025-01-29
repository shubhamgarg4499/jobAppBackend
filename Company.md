# Company API

## Base URL
```
http://localhost:3000/companies
```

## Note
### /list/id and /listall require only token

### /create, /update and /delete require both token and user to be an Admin

### Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzk0ZDJjMTQ5ODlhMmFkMWQyZmU2ZGYiLCJpYXQiOjE3Mzc4MDkyOTksImV4cCI6MTczODQxNDA5OX0.eWPqnbLRH1S9KO5bsS9aId5igD4SDsxZWpAU_hTG39w
```
(Admin token)


## Endpoints

### 1. **Create a New Company**
- **Endpoint**: `POST /companies`
- **Description**: Registers a new company.
- **Request Payload**:
  
```json
{
    "name": "Example Company",
    "industry": "Technology",
    "mail": "example@company.com",
    "ceoName": "John Doe",
    "number": "1234567890",
    "website": "https://example.com",
    "size": "500",
    "foundedIn": 2000,
    "location": "New York",
    "gstNumber": "1234GST5678"
}
```

Response:
Success (201):
```json
{
    "_id": "60f68e1bda3e4b8a8e74c2c1",
    "name": "Example Company",
    "industry": "Technology",
    "mail": "example@company.com",
    "ceoName": "John Doe",
    "number": "1234567890",
    "website": "https://example.com",
    "size": "500",
    "foundedIn": 2000,
    "location": "New York",
    "gstNumber": "1234GST5678",
    "createdAt": "2021-08-22T12:34:56.789Z",
    "updatedAt": "2021-08-22T12:34:56.789Z",
    "__v": 0
}
```
Error (400):
```json
{
    "error": "Missing required field: name"
}
```

### 2. **Get All Companies**
- Endpoint: GET /companies
- Description: Retrieves all companies from the system.
- Response:
Success (200):
```json
[
    {
        "_id": "60f68e1bda3e4b8a8e74c2c1",
        "name": "Example Company",
        "industry": "Technology",
        "mail": "example@company.com",
        "ceoName": "John Doe",
        "number": "1234567890",
        "website": "https://example.com",
        "size": "500",
        "foundedIn": 2000,
        "location": "New York",
        "gstNumber": "1234GST5678",
        "createdAt": "2021-08-22T12:34:56.789Z",
        "updatedAt": "2021-08-22T12:34:56.789Z",
        "__v": 0
    },
    {
        "_id": "60f68e1bda3e4b8a8e74c2c2",
        "name": "Tech Innovations",
        "industry": "Software",
        "mail": "info@techinnovations.com",
        "ceoName": "Alice Smith",
        "number": "9876543210",
        "website": "https://techinnovations.com",
        "size": "1000",
        "foundedIn": 2010,
        "location": "San Francisco",
        "gstNumber": "9876GST5432",
        "createdAt": "2021-08-22T12:34:56.789Z",
        "updatedAt": "2021-08-22T12:34:56.789Z",
        "__v": 0
    }
]
```

### 3. **Get a Specific Company by ID**
- Endpoint: GET /companies/:id
- Description: Retrieves details of a specific company by its unique ID.
- URL Parameters:

id: The unique identifier for the company (e.g., 60f68e1bda3e4b8a8e74c2c1).
Response:

Success (200):
```json
{
    "_id": "60f68e1bda3e4b8a8e74c2c1",
    "name": "Example Company",
    "industry": "Technology",
    "mail": "example@company.com",
    "ceoName": "John Doe",
    "number": "1234567890",
    "website": "https://example.com",
    "size": "500",
    "foundedIn": 2000,
    "location": "New York",
    "gstNumber": "1234GST5678",
    "createdAt": "2021-08-22T12:34:56.789Z",
    "updatedAt": "2021-08-22T12:34:56.789Z",
    "__v": 0
}
```

Error (404):
```json
{
    "error": "Company not found"
}
```

### 4. **Update Company Details**
- Endpoint: PUT /companies/:id
- Description: Updates the details of a specific company by its ID.
- URL Parameters:

id: The unique identifier for the company (e.g., 60f68e1bda3e4b8a8e74c2c1).
Request Payload:

```json
{
    "name": "Updated Company Name",
    "industry": "Updated Industry",
    "mail": "updated@company.com",
    "ceoName": "Updated CEO",
    "number": "1122334455",
    "website": "https://updatedcompany.com",
    "size": "800",
    "foundedIn": 2010,
    "location": "Los Angeles",
    "gstNumber": "5678GST1234"
}
```

Response:
Success (200):
```json
{
    "_id": "60f68e1bda3e4b8a8e74c2c1",
    "name": "Updated Company Name",
    "industry": "Updated Industry",
    "mail": "updated@company.com",
    "ceoName": "Updated CEO",
    "number": "1122334455",
    "website": "https://updatedcompany.com",
    "size": "800",
    "foundedIn": 2010,
    "location": "Los Angeles",
    "gstNumber": "5678GST1234",
    "createdAt": "2021-08-22T12:34:56.789Z",
    "updatedAt": "2021-08-23T15:45:32.123Z",
    "__v": 0
}
```

Error (404):
```json
{
    "error": "Company not found"
}
```

### 5. **Delete a Company**
- Endpoint: DELETE /companies/:id
- Description: Deletes a specific company by its ID.
- URL Parameters:

id: The unique identifier for the company (e.g., 60f68e1bda3e4b8a8e74c2c1).
Response:

Success (200):
```json
{
    "message": "Company deleted successfully"
}
```

Error (404):
```json
{
    "error": "Company not found"
}
```

Error Handling
If any error occurs, the API will respond with an appropriate HTTP status code and a JSON object containing the error message.

Example:

```json
{
    "error": "Invalid request data"
}
```