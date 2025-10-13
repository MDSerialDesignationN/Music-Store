# Music Store Admin Panel

A modern admin panel for managing the Music Store application, built with React and Tailwind CSS.

## Features

### 🔐 Authentication
- Secure admin login system
- Session management
- Demo credentials for testing

### 📊 Dashboard
- Overview statistics (albums, artists, users, orders)
- Recent activity feed
- Quick action buttons
- Real-time data visualization

### 💿 Album Management
- View all albums in a comprehensive table
- Add new albums with form validation
- Edit existing album information
- Delete albums with confirmation
- Search and filter albums by title, artist, or genre
- Integration with artist and genre data

### 🎤 Artist Management
- Comprehensive artist catalog management
- Add/edit artist profiles with biography
- View album counts per artist
- Search and filter functionality
- Country-based organization

### 👥 User Management
- View all registered users
- User status management (active/inactive/suspended)
- User activity tracking
- Order history and spending analytics
- Search and filter users
- Detailed user profiles with statistics

## Demo Credentials

For testing purposes, use these login credentials:
- **Email:** admin@musicstore.com
- **Password:** admin123

## Technology Stack

- **Frontend:** React 19.2.0
- **Styling:** Tailwind CSS (via CDN)
- **UI Components:** Custom components with consistent design system
- **State Management:** React hooks (useState, useEffect)
- **Data:** Mock data with backend API integration points

## Getting Started

1. **Install Dependencies**
   ```bash
   cd frontend_admin
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Access Admin Panel**
   - Open http://localhost:3000 (or the assigned port)
   - Login with demo credentials
   - Navigate through different management sections

## API Integration

The admin panel is designed to work with the existing Music Store backend APIs:

### Available Endpoints
- `GET /api/album` - Fetch all albums
- `GET /api/artist` - Fetch all artists
- `POST /api/album` - Create new album (to be implemented)
- `PUT /api/album/:id` - Update album (to be implemented)
- `DELETE /api/album/:id` - Delete album (to be implemented)

### Demo Mode
When backend endpoints are not available, the application falls back to demo data to showcase functionality.

## File Structure

```
src/
├── components/
│   ├── AdminHeader.js      # Navigation header with menu
│   ├── Login.js            # Authentication component
│   ├── Dashboard.js        # Main dashboard with stats
│   ├── AlbumManagement.js  # Album CRUD operations
│   ├── ArtistManagement.js # Artist CRUD operations
│   └── UserManagement.js   # User administration
├── App.js                  # Main application component
├── App.css                 # Additional styles
└── index.js               # Application entry point
```
