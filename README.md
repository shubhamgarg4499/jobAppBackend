# 1) User Login Through Email and Password

- POST METHOD
- URL `api/user/signin`

### Parameters

- `email (string) (required)`
- `password (string) (required)`

### ERROR If any of the field missing

- Required Field Error
- Invalid email or password (when password incorrect)

### Error (when a google sign-In user try to signin with this method)

- Your Account Is Created With Google ! Please SignIn with Google

### Response (json response)

- success: `true`
- `user (user details with token)`
- `token`
- message :`User Login Successfully`

### ON ERROR

- Error Message (It's A server Error Not A custom Error)

# 2) User Login Through Google

- Get METHOD
- URL `/auth/google`

### Parameters

- None

### Response

- success: `true`
- `user (user details with token)` -` token`

### ON ERROR

- Error Message (It's a server Error Not A custom Error)

# 3) Logout User

- POST METHOD
- URL `/api/user/logout`

### Parameters

- ### `token (In Header) (required)`

### Response

- success: `true`
- message: `User Logged out Successfully!`

### ON ERROR

- Error Message (Note:- It's A server Error Not A custom Error)

# 4) Send or resend otp for email verification

- POST METHOD
- URL `api/user/sendOTP`

### Parameters

- `email (string) (required)`

### ERROR

- Required Field Error
- User Not Found! Signup First! (if user not signup with this email)
- User Email Already Verified! (if user already verified whith this email)
- Wait 2 Minutes For Resend OTP..... (need to wait 2 min for resend otp otherwise it will give this error)

### Response (json response)

- success: `true`
- message :`OTP sent Successfully on ${email}`

### ON ERROR

- Error Message (It's A server Error Not A custom Error)

# 5) To verify Email Verification OTP

- POST METHOD
- URL `api/user/verifyOTP`

### Parameters

- `otp (string) (required)`
- `email (string) (required)`

### ERROR

- Required Field Error
- User Not Found! Signup First! (if user not signup with this email)
- User Email Already Verified! (if user already verified whith this email)
- OTP Expired! Please request a new OTP
- Incorrect OTP. Please try again.
- User not found. Unable to verify email.

### Response (json response)

- success: `true`
- message :`User Email Verified Successfully`

### ON ERROR

- Error Message (It's A server Error Not A custom Error)

# 6) SignUp user with Email and details

- POST METHOD
- URL `api/user/signup`

### Parameters

- `fullName (string) (required)`
- `email (string) (required)`
- `password (string) (required)`
- ### `mobilenumber (string) (optional)`

### ERROR

- Required Fields Error
- Account already exists! Please log in.
- Account already exists! But Email not verified. Please verify your email.

### Response (json response)

- user(full document)
- success: `true`
- message :`User Email Verified Successfully`

### ON ERROR

- Error Message (It's A server Error Not A custom Error)

# 7) To send forgot password otp on email

- POST METHOD
- URL `api/user/forgotpasswordotp`

### Parameters

- `email (string) (required)`

### ERROR

- User Not Found! Please SignUp
- Wait 2 Minutes to Send OTP....(If user Tap on resend otp before 2 min)

### Response (json response)

- success: `true`
- message :`OTP Sent Successfully on ${email}`

### ON ERROR

- Error Message (It's A server Error Not A custom Error)

# 8) To verify forgot password otp

- POST METHOD
- URL `api/user/verifyforgotpasswordotp`

### Parameters

- `email (string) (required)`
- `otp (string) (required)`

### ERROR

- OTP Expired! Please request a new OTP
- Incorrect OTP. Please try again.

### Response (json response)

- success: `true`
- message :`Correct OTP`

### ON ERROR

- Error Message (It's A server Error Not A custom Error)

# 9) To Change Password (when user put correct otp)

- POST METHOD
- URL `api/user/changepassword`

### Parameters

- `email (string) (required)`
- `newPassword (string) (required)`

### ERROR

- User Not Found!

### Response (json response)

- success: `true`
- message :`Password Changed!`

### ON ERROR

- Error Message (It's A server Error Not A custom Error)

# 10) To Change About Me

- POST METHOD
- URL `api/user/aboutme`

### Parameters

- `token in header`
- `description (string) (required)`

### ERROR

- `Description Required*`

### Response (json response)

- success: `true`
- message :`About Section is Updated`

### ON ERROR

- Error Message (It's A server Error Not A custom Error)

# 11) To add Work Experience

- POST METHOD
- URL `api/user/workexperience`

### Parameters

- `token in header`
- `jobInfo (Array of Object) (required)`
- `jobInfo (array name)` : [
  {

        "jobTitle": "frontend" (string) (required)

        "company":"221" (string) (required)

        "startDate":"2w" (string)(format y-m-d) (required)

        "endDate":"12/3/5" (string)(format y-m-d) (required)

        "stillWorkingThere":false (boolean)
        (only one field required from endDate and stillWorkingThere)

        "description":""

  }
  ]

### ERROR

- Only Allow `ARRAY OF OBJECT` (if it doesnt get an array)
- `Need Atleast One Object To Add` (when user try to change with empty field)
- `All fields (jobTitle, company, and startDate) must be filled in every entry.` (when user dont fill any field from jobTitle, company, and startDate)
- `Please Select End Date or Check if You are Still Working There` (when user dont fill any field from endDate && stillWorkingThere)

### Response (json response)

- success: `true`
- message :`Your Experience Section has been updated Successfully`

### ON ERROR

- Error Message (It's A server Error Not A custom Error)

# 12) To Add Education

- POST METHOD
- URL `api/user/addeducation`

### Parameters

- `token in header`
- `educationInfo (Array of Object) (required)`
- `educationInfo (array name)` : [
  {

        "education": "bca" (string) (required)

        "institute":"IGNOU" (string) (required)

        "fieldOfStudy":"Computer-Sci" (string)(required)

        "startDate":"24/12/20" (string)(format y-m-d) (required)

only one field required from `endDate and stillPursuing`

        "endDate":"12/3/5" (string)(format y-m-d) (required)

        "stillPursuing":false (boolean)


        "description":""
    }
    ]

### ERROR

- Only Allow `ARRAY OF OBJECT` (if it doesnt get an array)
- `Need Atleast One Object To Add` (when user try to change with empty field)
- `All fields (Education, Institute,Field Of Study and Start Date) must be filled in every entry.` (when user dont fill any field from jobTitle, company, and startDate)
- `Please Select End Date or Check if You are Still Pursuing It` (when user dont fill any field from endDate && stillWorkingThere)

### Response (json response)

- success: `true`
- message :`Your Education Section has been updated Successfully`

### ON ERROR

- Error Message (It's A server Error Not A custom Error)

# 13) To Add Skills

- POST METHOD
- URL `api/user/addskills`

### Parameters

- `token in header`
- `skill (Array ) (required)`

- `skill (array name) : ["computer","web dev"]`

### ERROR

- Only Allow `ARRAY` (if it doesnt get an array)
- `Atleast 1 Skill required to Add`

### Response (json response)

- success: `true`
- message :`Skills Section Updated`

### ON ERROR

- Error Message (It's A server Error Not A custom Error)

# 14) To Add Appreciation

- POST METHOD
- URL `api/user/addappreciation`

### Parameters

- `token in header`
- `appre (Array of Object) (required)`
- `appre (array name)` : [

       {

       "awardName": "bca" (string) (required)

       "category":"IGNOU" (string) (required)

       "description":"lorem ipsum" (string)(optional)

       "year":"2023" (string)(required)

       }

  ]

### ERROR

- Only Allow `ARRAY OF OBJECT` (if it doesnt get an array)

- `Need Atleast One Object To Add` (when user try to change with empty field)

- `Fields (Award Name, Category & Year) must be filled.`

### Response (json response)

- success: `true`
- message :`Your Appreciation Section has been updated Successfully`

### ON ERROR

- Error Message (It's A server Error Not A custom Error)

# 15) To Add Language Known

- POST METHOD
- URL `api/user/addlanguage`

### Parameters

- `token in header`
- `langKnown (Array of Object) (required)`
- `langKnown (array name)` : [

        {

        "languageName": "english" (string) (required)

        "oralLevel":"intermediate" (string) (required)

        "writtenLevel":"intermediate" (string)(required)

        "primaryLanguage":false (boolean)(optional)

        }

  ]

### ERROR

- Only Allow `ARRAY OF OBJECT` (if it doesnt get an array)

- `Need Atleast One Object To Add` (when user try to change with empty field)

- `Fields (Language Name, Oral Level & Written Level) must be filled.`

### Response (json response)

- success: `true`
- message :`Your Language Section has been updated Successfully`

### ON ERROR

- Error Message (It's A server Error Not A custom Error)

# 16) Upload Resume

- POST METHOD
- URL `api/user/uploadresume`

### Parameters

- `token in header`
- `resume (pdf file only) (required)`
- `langKnown (array name)` : [

        {

        "languageName": "english" (string) (required)

        "oralLevel":"intermediate" (string) (required)

        "writtenLevel":"intermediate" (string)(required)

        "primaryLanguage":false (boolean)(optional)

        }

  ]

### ERROR

- Only PDF File Allowed

- `Need Atleast One Object To Add` (when user try to change with empty field)

- `Fields (Language Name, Oral Level & Written Level) must be filled.`

### Response (json response)

- success: `true`
- message :`Resume Updated Successfully`
- resume : `path/url`

### ON ERROR

- Error Message (It's A server Error Not A custom Error)
