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
