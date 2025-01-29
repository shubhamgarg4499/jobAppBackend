# Company API

## Base URL
```
http://localhost:3000/companies
```

## Note
### /list/id and /listall require only token

### /create requires both token and user to be employer

### /delete and add employee require both token and user to be an Admin

ur description:

## Flow Overview

1. **/list/:id** and **/listall**:
   - **Requirement**: Only the **Token** is required.
   - These routes allow authenticated users to retrieve company details or a list of all companies.

2. **/create**:
   - **Requirement**: Both **Token** and the user must be a verified **Employer**.
   - Any verified employer can create a new company by submitting the necessary details. 
   - After the company is created, an **Admin** needs to add the user who created the company to the **employers** list of that company.

3. **/delete** and **/addEmployer**:
   - **Requirement**: Both **Token** and the user must be an **Admin**.
   - Only an Admin can delete a company or add an employer to a company.
   - The Admin will be responsible for managing which users are part of the company’s employer list.

4. **Creating Jobs**:
   - After creating a company, only those users who are added to the **employers** list of that company can create jobs related to that company.
   - This ensures that only legitimate employees (as defined by the company's employer list) can post jobs for that company.

### Sequence of Actions:

1. **Employer creates a company**:
   - An authenticated **Employer** sends a **POST request** to **/create** with the required details.
   
2. **Admin adds the Employer to the company's employers list**:
   - After the company is created, an **Admin** uses the **/addEmployer** route to add the Employer's user ID to the **employers** list of that company.

3. **Employer creates a job**:
   - Once the Employer is added to the company's employer list, they can create jobs related to the company.
   
### Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzk0ZDJjMTQ5ODlhMmFkMWQyZmU2ZGYiLCJpYXQiOjE3Mzc4MDkyOTksImV4cCI6MTczODQxNDA5OX0.eWPqnbLRH1S9KO5bsS9aId5igD4SDsxZWpAU_hTG39w
```
(Admin token)


## Endpoints

# 1) Create Company

### POST METHOD

- **URL**: `/api/company/create`

### Headers

- **Token**: Required in the header.

### Request Body

```
{
    "name": "<companyName>",
    "industry": "<industry>",
    "mail": "<email>",
    "ceoName": "<CEO Name>",
    "number": "<contactNumber>",
    "website": "<websiteUrl>",
    "size": "<companySize>",
    "foundedIn": <year>,
    "location": "<location>",
    "gstNumber": "<gstNumber>"
}
```

### Response (JSON)

```
{
    "_id": "<companyId>",
    "name": "<companyName>",
    "industry": "<industry>",
    "mail": "<email>",
    "ceoName": "<CEO Name>",
    "number": "<contactNumber>",
    "website": "<websiteUrl>",
    "size": "<companySize>",
    "foundedIn": <year>,
    "location": "<location>",
    "gstNumber": "<gstNumber>",
    "logo": "<logoUrl>",
    "employers": [],
    "address": {
        "street": "<street>",
        "state": "<state>",
        "zipCode": "<zipCode>",
        "country": "<country>"
    },
    "createdAt": "<timestamp>",
    "updatedAt": "<timestamp>"
}
```

### Errors

**Server Error**:

- "An unexpected error occurred. Please try again later."

---

# 2) Get All Companies

### GET METHOD

- **URL**: `/api/company/listall`

### Headers

- **Token**: Required in the header.

### Response (JSON)

```
[
  {
    "_id": "<companyId>",
    "name": "<companyName>",
    "industry": "<industry>",
    "mail": "<email>",
    "ceoName": "<CEO Name>",
    "number": "<contactNumber>",
    "website": "<websiteUrl>",
    "size": "<companySize>",
    "foundedIn": <year>,
    "location": "<location>",
    "gstNumber": "<gstNumber>",
    "logo": "<logoUrl>",
    "employers": [],
    "address": {
        "street": "<street>",
        "state": "<state>",
        "zipCode": "<zipCode>",
        "country": "<country>"
    },
    "createdAt": "<timestamp>",
    "updatedAt": "<timestamp>"
  }
]
```

### Errors

**Server Error**:

- "An unexpected error occurred. Please try again later."

---

# 3) Get Company by ID

### GET METHOD

- **URL**: `/api/company/list/:id`

### Parameters

- **id** (required): The ID of the company to retrieve.

### Headers

- **Token**: Required in the header.

### Response (JSON)

```
{
    "_id": "<companyId>",
    "name": "<companyName>",
    "industry": "<industry>",
    "mail": "<email>",
    "ceoName": "<CEO Name>",
    "number": "<contactNumber>",
    "website": "<websiteUrl>",
    "size": "<companySize>",
    "foundedIn": <year>,
    "location": "<location>",
    "gstNumber": "<gstNumber>",
    "logo": "<logoUrl>",
    "employers": [],
    "address": {
        "street": "<street>",
        "state": "<state>",
        "zipCode": "<zipCode>",
        "country": "<country>"
    },
    "createdAt": "<timestamp>",
    "updatedAt": "<timestamp>"
}
```

### Errors

**404 - Not Found**:

- "Company not found"

**Server Error**:

- "An unexpected error occurred. Please try again later."

---

# 4) Update Company

### PUT METHOD

- **URL**: `/api/company/update/:id`

### Parameters

- **id** (required): The ID of the company to update.

### Headers

- **Token**: Required in the header.

### Request Body

```
{
    "name": "<companyName>",
    "industry": "<industry>",
    "mail": "<email>",
    "ceoName": "<CEO Name>",
    "number": "<contactNumber>",
    "website": "<websiteUrl>",
    "size": "<companySize>",
    "foundedIn": <year>,
    "location": "<location>",
    "gstNumber": "<gstNumber>"
}
```

### Response (JSON)

```
{
    "_id": "<companyId>",
    "name": "<companyName>",
    "industry": "<industry>",
    "mail": "<email>",
    "ceoName": "<CEO Name>",
    "number": "<contactNumber>",
    "website": "<websiteUrl>",
    "size": "<companySize>",
    "foundedIn": <year>,
    "location": "<location>",
    "gstNumber": "<gstNumber>",
    "logo": "<logoUrl>",
    "employers": [],
    "address": {
        "street": "<street>",
        "state": "<state>",
        "zipCode": "<zipCode>",
        "country": "<country>"
    },
    "createdAt": "<timestamp>",
    "updatedAt": "<timestamp>"
}
```

### Errors

**404 - Not Found**:

- "Company not found"

**Server Error**:

- "An unexpected error occurred. Please try again later."

---
# 5) Delete Company

### DELETE METHOD

- **URL**: `/api/company/delete/:id`

### Parameters

- **id** (required): The ID of the company to delete.

### Headers

- **Token**: Required in the header.

### Response (JSON)

```
{
    "message": "Company deleted successfully"
}
```

### Errors

**404 - Not Found**:

- "Company not found"

**Server Error**:

- "An unexpected error occurred. Please try again later."

---

# 6) Add Employer to Company

### PATCH METHOD

- **URL**: `/api/company/addEmployer/:id`

### Parameters

- **id** (required): The ID of the company to update.

### Headers

- **Token**: Required in the header.

### Request Body

```
{
    "employer": "<employerId>"
}
```

### Response (JSON)

```
{
    "message": "Employer added successfully",
    "data": {
        "_id": "<companyId>",
        "name": "<companyName>",
        "industry": "<industry>",
        "mail": "<email>",
        "ceoName": "<CEO Name>",
        "number": "<contactNumber>",
        "website": "<websiteUrl>",
        "size": "<companySize>",
        "foundedIn": <year>,
        "location": "<location>",
        "gstNumber": "<gstNumber>",
        "logo": "<logoUrl>",
        "employers": ["<employerId>"],
        "address": {
            "street": "<street>",
            "state": "<state>",
            "zipCode": "<zipCode>",
            "country": "<country>"
        },
        "createdAt": "<timestamp>",
        "updatedAt": "<timestamp>"
    }
}
```

### Errors

**404 - Not Found**:

- "Company not found"

**Server Error**:

- "An unexpected error occurred. Please try again later."

---

### Notes:
- The `verifyTokenMiddleware` ensures that the request is authenticated.
- The `isAdmin` middleware ensures that the user has admin privileges when performing certain actions like deleting or adding employers.
- The `isVerifiedEmployer` middleware ensures that only verified employers can create new companies.
