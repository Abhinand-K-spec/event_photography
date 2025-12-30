# 📸 Event Photography Platform

A modern, full-stack SaaS platform for event photography where photographers create events, generate QR codes, and guests find their photos by uploading selfies.

## 🚀 Features

- **QR Code-Based Access**: Guests scan QR codes to access event galleries
- **Selfie Photo Matching**: AI-simulated matching to find photos
- **Photographer Dashboard**: Manage events and upload photos
- **Secure Authentication**: JWT-based photographer authentication
- **Responsive Design**: Mobile-first UI that works on all devices
- **Instant Downloads**: Fast photo delivery to guests

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - Server framework
- **MongoDB** + **Mongoose** - Database
- **Multer** - File upload handling
- **QRCode** - QR code generation
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern design system with CSS variables
- **Vanilla JavaScript** - No frameworks, pure JS
- **Google Fonts** - Inter typography

## 📁 Project Structure

```
photography-project/
├── server/
│   ├── server.js              # Express app
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/                # Mongoose schemas
│   ├── controllers/           # Business logic
│   ├── routes/                # API routes
│   ├── middleware/            # Auth & upload middleware
│   └── utils/                 # QR generator & photo matcher
├── public/
│   ├── index.html             # Landing page
│   ├── login.html             # Auth page
│   ├── dashboard.html         # Photographer dashboard
│   ├── create-event.html      # Event creation
│   ├── event.html             # Guest page
│   ├── css/
│   │   └── styles.css         # Global design system
│   └── js/
│       ├── api.js             # API service layer
│       ├── login.js
│       ├── dashboard.js
│       ├── create-event.js
│       └── event.js
├── uploads/                   # File storage (gitignored)
├── package.json
└── .env
```

## 🏁 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository** (or navigate to the project directory):
```bash
cd photography-project
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:

Create a `.env` file in the root directory (it's already created, but verify the values):

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/event-photography
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

**For MongoDB Atlas** (cloud database), replace `MONGODB_URI` with your connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-photography
```

4. **Start MongoDB** (if running locally):
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Running the Application

**Development mode** (with auto-restart):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The application will be available at: **http://localhost:3000**

## 📖 Usage Guide

### For Photographers

1. **Register/Login**:
   - Visit http://localhost:3000
   - Click "Login" or "Get Started"
   - Register with email and password

2. **Create an Event**:
   - From the dashboard, click "Create New Event"
   - Enter event name and date
   - Generate QR code

3. **Upload Photos**:
   - From the dashboard, click "Upload Photos" on an event
   - Select multiple photos to upload

4. **Share with Guests**:
   - Download and print the QR code
   - Place it at your event venue
   - Or share the event link directly

### For Guests

1. **Access Event**:
   - Scan the QR code or visit the event link
   
2. **Upload Selfie**:
   - Click to upload a clear selfie
   - Make sure your face is visible

3. **Get Your Photos**:
   - Click "Find My Photos"
   - Wait for matching (simulated)
   - Download your photos

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register photographer
- `POST /api/auth/login` - Login photographer
- `GET /api/auth/me` - Get current photographer (protected)

### Events
- `GET /api/events` - Get all events (protected)
- `POST /api/events` - Create new event (protected)
- `GET /api/events/:eventCode` - Get event by code (public)
- `DELETE /api/events/:id` - Delete event (protected)

### Photos
- `POST /api/photos/upload/:eventId` - Upload photos (protected)
- `GET /api/photos/:eventId` - Get event photos (protected)
- `GET /api/photos/download/:photoId` - Download photo (public)

### Guest
- `POST /api/guest/find-photos` - Find photos by selfie (public)

## 🎨 Design System

The platform uses a comprehensive CSS design system with:

- **Color Palette**: Neutral grays with indigo primary color
- **Typography**: Inter font with consistent sizing scale
- **Spacing**: 4px base unit system
- **Components**: Buttons, cards, forms, grids, modals
- **Responsive**: Mobile-first with breakpoints at 768px and 1024px

## 🤖 Photo Matching

**Note**: The current implementation uses **simulated** photo matching. In a production environment, you would integrate a facial recognition service like:

- **AWS Rekognition**
- **Microsoft Azure Face API**
- **Google Cloud Vision API**
- **Face++**

The current logic returns 30-70% of event photos randomly to simulate matching.

## 📦 Dependencies

### Production
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- `multer` - File uploads
- `qrcode` - QR code generation
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

### Development
- `nodemon` - Auto-restart server

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Error**: `MongoNetworkError: failed to connect to server`

**Solutions**:
1. Make sure MongoDB is running: `mongod --version`
2. Check your `MONGODB_URI` in `.env`
3. For MongoDB Atlas, whitelist your IP address

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port in .env
PORT=3001
```

### File Upload Errors

**Error**: File uploads failing

**Solution**:
- Check that `uploads/` directories exist (they're created automatically)
- Verify file size limits in `server/middleware/upload.js`
- Ensure disk space is available

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/event-photography` |
| `JWT_SECRET` | Secret key for JWT | Required |
| `NODE_ENV` | Environment | `development` |

## 🚀 Deployment

### Deploy to Production

1. Set up a production MongoDB database (MongoDB Atlas recommended)
2. Update `.env` with production values
3. Deploy to a hosting platform:
   - **Heroku**
   - **DigitalOcean**
   - **AWS EC2**
   - **Render**
   - **Railway**

4. Set environment variables on your hosting platform
5. Run build command: `npm start`

### Recommended Production Setup

- Use a cloud database (MongoDB Atlas)
- Enable HTTPS/SSL
- Use a CDN for static assets
- Implement rate limiting
- Add real facial recognition API
- Use cloud storage (AWS S3) for photos
- Set up monitoring and logging

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, email your-email@example.com or create an issue in the repository.

---

**Built with ❤️ using Node.js, Express, MongoDB, and Vanilla JavaScript**
