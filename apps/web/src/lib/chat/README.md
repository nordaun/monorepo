# Chat System

The main chat system for all Nordaun Applications with Pusher.

## Definitions

Mainly useful utility types and constants for type safety.

## Data Access Layer

Cached chat and messages related data that can be requested often and fast.

## Actions

Chat Actions are message handling logics which take a form input and execute neccessary data mutations.
They can be executed from the client via the useActionState() hook which sends a request to the server.
The response should automatically translated on the server and sent back the client where it's rendered.
If you see a star \* it means it that that action works without the useActionState() hook.

- `Send Message`: Sends a message to a chat.
- `Edit Message`: Edits an existing message in a chat.
- `Delete Message`: Deletes a message from a chat.
- `Rename Chat`: Renames a chat with 2 or more members.
- `Leave Chat*`: Removes the current user from a chat.

## Tools

Tools are simple abstraction layers that are often used in other logics.

- `Format Date`: Formats a date to a standardize format in the user's locale.
- `Format Time`: Formats a time to a standardize format in the user's locale
- `Get Initial`: Gets the monogram of the user's full name.
- `Order Messages`: Sorts, orders and separates messages by their timestamp.
- `Pick Error`: Selects an error from many errors, which can be shown to the user.
