# Post Management System
aaaa
This project aims to develop a comprehensive Post Management System using modern web technologies.

## Technology Stack
- **Frontend**: React, TypeScript, Axios (with interceptors)
- **API**: Mock API service at [https://mockapi.io/) with two models: /users and /posts.
- Link Users: [https://66f4051b77b5e8897097eaef.mockapi.io/users](https://66f4051b77b5e8897097eaef.mockapi.io/users)
- Link Posts: [https://66f4051b77b5e8897097eaef.mockapi.io/posts](https://66f4051b77b5e8897097eaef.mockapi.io/posts)

## Data Models
- **User Model**:
  - `id`: Unique identifier
  - `name`: User's name
  - `password`: User's password
  - `email`: User's email address
  - `createDate`: Account creation date
  - `updateDate`: Last account update date
  - `role`: User's role (e.g., admin, user)
  - `avatar`: URL to user's avatar image

- **Post Model**:
  - `id`: Unique identifier
  - `userId`: ID of the user who created the post
  - `title`: Title of the post
  - `description`: Content of the post
  - `status`: Current status of the post (e.g., published, draft)
  - `createDate`: Post creation date
  - `updateDate`: Last post update date
  - `postImage`: URL to the post's image
  - `postVideo`: URL to the post's video (if applicable)
  - `postTag`: Tags associated with the post

## Features
1. User authentication (login and registration)
2. User authorization (JWT or session-based)
3. User management (add, delete, block users)
4. Search and filter posts by title, status, and tags
5. Pagination for post listings
6. Commenting functionality for posts
7. Notifications for new posts or comments
8. Save favorite posts for users
9. Share posts on social media
10. View edit history of posts
11. Upload multiple images and videos for a single post

## UI Framework
- Utilize Ant Design for layout and forms, ensuring responsive design and validation for all user inputs.

