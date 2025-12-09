# File System

The main file system for all Nordaun Applications with Google Cloud Storage.

## Definitions

Mainly useful utility types and allowed file extension constants for type safety.

## Data Access Layer

Fast interactivity layer for creating and deleting files in both database and storage.

## Actions

Files Actions are file handling logics which take a form input and execute neccessary data mutations.
They can be executed from the client via the useActionState() hook which sends a request to the server.
The response should automatically translated on the server and sent back the client where it's rendered.
If you see a star \* it means it that that action works without the useActionState() hook.

- `Upload Avatar`: Uploads a file as a user avatar and returns the urls.
- `Upload Chat Avatar`: Uploads a file as a chat avatar and returns the urls.
- `Upload Attachments*`: Uploads files as chat attachments and returns the urls.

## Tools

Tools are simple abstraction layers that are often used in other logics.

- `Convert Image`: Converts any image file to a websafe fromat (WEBP) and optionally resizes it.
- `Get File Extensions`: Returns the file extension of a file.
- `Get File Icon`: Returns an icon for a file based on its mime category.
- `Get File Name`: Returns the name of a file based on a URL.
- `Get File Size`: Returns a file's formatted size (like 128 B or 1.6 GB).
- `Validate File`: Checks if a file is elligable to be uploaded to the storage.
