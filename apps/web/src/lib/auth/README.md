# Auth System

The main authentication system for all Nordaun Applications.

## Definitions

Mainly useful utility types and zod schemas for input validation and type safety.

## Sessions & Licenses

Uses a hybrid system for creating, validating and deleting sessions and licenses (access to licensed routes).
Protected Routes require email verification before access: /resetpassword, /migrateemail and /terminateaccount.
It accepts both cookies (browser) and bearer tokens (native) in order for a wider availability.
It also utilizes JWT encryption and decryption for security and integrity.

## Data Access Layer

Cached auth related data that can be requested often and fast.

## Actions

Auth Actions are authentication logics which take a form input and execute neccessary data mutations.
They can be executed from the client via the useActionState() hook which sends a request to the server.
The response should automatically translated on the server and sent back the client where it's rendered.
If you see a star \* it means it that that action works without the useActionState() hook.

- `Signup`: Signs a user up.
- `Login`: Logs a user in.
- `Logout*`: Logs a user out.
- `Personalize`: Personalizes user details (e.g.: name, phone).
- `Verify`: Starts a process that requires email confirmation (license) with an OTP.
- `Confirm`: Confirms that a user is legit with the OTP sent along the verify email.
- `Reset Password`: Resets (changes) the password of the user (works with license).
- `Migrate Email`: Migrates (changes) the email of the user (works with license).
- `Terminate Account`: Terminates (deletes) the account of the user (works with license).
- `Toggle 2FA*`: Toggles the users Two-factor authentication (2FA) state.

## Methods

Handles Third party provider logins like Google (and soon Apple).
It uses Ky to fetch the Google User API and turn access tokens to user data like email that can later be validated.
