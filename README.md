# Student Team Members Management Application

A full-stack web application for managing student team members with a clean, modern interface built using React, Node.js, Express, and MongoDB.

## Project Overview

This application provides a streamlined platform for managing team members, including adding new members with profile photos, viewing all team members in a card-based layout, and accessing detailed information about individual members. The application follows International Typographic Style design principles with a minimalist aesthetic featuring bold red accents and crisp black typography.

## Features

- **Home Page**: Landing page with team introduction and navigation to main features
- **Add Member Page**: Form to add new team members with name, role, email, phone, bio, and profile photo upload
- **View Members Page**: Grid layout displaying all team members with quick access to detailed profiles
- **Member Details Page**: Comprehensive view of individual member information including profile photo
- **Image Upload**: Support for profile photo uploads with storage integration
- **Form Validation**: Client-side and server-side validation for all form inputs
- **Responsive Design**: Mobile-friendly layout that works across all devices
- **Clean Navigation**: Consistent header navigation across all pages

## Technologies Used

### Frontend
- **React 19**: Modern UI framework
- **Tailwind CSS 4**: Utility-first CSS framework
- **tRPC**: End-to-end typesafe APIs
- **Wouter**: Lightweight router for navigation
- **Sonner**: Toast notifications

### Backend
- **Node.js**: JavaScript runtime
- **Express 4**: Web framework
- **tRPC 11**: RPC framework for type-safe APIs
- **Mongoose**: MongoDB object modeling
- **MongoDB**: NoSQL database

### Development
- **Vite**: Fast build tool
- **TypeScript**: Type safety
- **Vitest**: Unit testing framework

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm package manager
- MongoDB database or MongoDB Atlas cluster

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-team-management
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/team_management
   JWT_SECRET=your-secret-key
   VITE_APP_ID=your-app-id
   OAUTH_SERVER_URL=your-oauth-url
   ```

4. **Database setup**
   MongoDB uses runtime models through Mongoose, so no SQL migration is required.

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## API Endpoints

### Members Endpoints

#### Add Member
- **Procedure**: `members.add`
- **Type**: Mutation
- **Input**:
  ```typescript
  {
    name: string (required)
    role: string (required)
    email: string (required, valid email format)
    phone?: string (optional)
    bio?: string (optional)
    imageData?: string (optional, base64 encoded)
    imageName?: string (optional)
  }
  ```
- **Response**: Member object with id, name, role, email, phone, bio, imageUrl, createdAt, updatedAt

#### Get All Members
- **Procedure**: `members.getAll`
- **Type**: Query
- **Response**: Array of member objects

#### Get Member by ID
- **Procedure**: `members.getById`
- **Type**: Query
- **Input**:
  ```typescript
  {
    id: string (required, MongoDB ObjectId)
  }
  ```
- **Response**: Single member object

## Project Structure

```
student-team-management/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── AddMemberPage.tsx
│   │   │   ├── ViewMembersPage.tsx
│   │   │   └── MemberDetailsPage.tsx
│   │   ├── components/
│   │   │   └── Header.tsx
│   │   ├── lib/
│   │   │   └── trpc.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── public/
├── server/
│   ├── routers.ts
│   ├── db.ts
│   ├── members.test.ts
│   └── _core/
├── package.json
├── tsconfig.json
└── README.md
```

## Running the Application

### Development Mode
```bash
pnpm dev
```

### Build for Production
```bash
pnpm build
```

### Start Production Server
```bash
pnpm start
```

### Run Tests
```bash
pnpm test
```

### Format Code
```bash
pnpm format
```

## Database Models

### Members Collection
- `id` (int, auto-increment, primary key)
- `name` (varchar, required)
- `role` (varchar, required)
- `email` (varchar, required)
- `phone` (varchar, optional)
- `bio` (text, optional)
- `imageUrl` (text, optional)
- `imageKey` (varchar, optional)
- `createdAt` (timestamp, auto-set)
- `updatedAt` (timestamp, auto-update)

## Design System

The application follows the **International Typographic Style** with:
- **Color Palette**: Pristine white background (#ffffff) with bold red accents (#dc2626)
- **Typography**: Crisp black sans-serif typography with precise letter-spacing
- **Layout**: Asymmetric grid-based layout with generous negative space
- **Borders**: Fine black divider lines for visual hierarchy
- **Spacing**: Consistent spacing system based on 4px grid

## Features in Detail

### Home Page
- Team introduction with welcome message
- Navigation buttons to Add Member and View Members pages
- Feature highlights with red accent borders
- Responsive two-column layout

### Add Member Page
- Form with validation for all required fields
- Profile photo upload with preview
- Optional fields for phone and bio
- Real-time form validation
- Success toast notification on submission

### View Members Page
- Grid layout displaying all team members
- Member cards with profile photo, name, role, and email
- "View Details" button for each member
- Empty state with call-to-action when no members exist
- Responsive grid (1 column mobile, 2 columns tablet, 3 columns desktop)

### Member Details Page
- Full member information display
- Large profile photo
- All member details with clear labels
- Navigation back to members list
- Quick access to add another member

## Form Validation

All form inputs are validated both client-side and server-side:
- **Name**: Required, max 255 characters
- **Role**: Required, max 255 characters
- **Email**: Required, valid email format
- **Phone**: Optional, max 20 characters
- **Bio**: Optional, text field
- **Image**: Optional, image file upload

## Error Handling

The application includes comprehensive error handling:
- Form validation errors displayed inline
- Toast notifications for success and error states
- Graceful handling of missing members
- Database error logging

## Contributing

This is a student project. To contribute:
1. Create a feature branch
2. Make your changes
3. Commit with clear messages
4. Push to the repository
5. Create a pull request

## Submission

This project is submitted as part of the Full Stack Development course (21CSS301T) at SRM Institute of Science and Technology.

**Repository**: [Your GitHub Repository URL]
**Submission Date**: [Submission Date]
**Team Name**: [Your Team Name]

## License

MIT License - See LICENSE file for details

## Support

For issues or questions about the application, please refer to the project documentation or contact the development team.

---

**Last Updated**: April 24, 2025
**Version**: 1.0.0
