# Servitect - A one-click Node.js MVC Server generator

### **Server + Architect = Servitect**
 
Automate the creation of a well-structured Model-View-Controller (MVC) pattern for your Node.js projects with ease. `Servitect` is designed to help developers quickly scaffold a project, follow best practices, and integrate various functionalities with minimal setup.

<div align="center">
<img src="https://github.com/kushkapadia/servitect/blob/main/servitectLogo.jpeg" alt="Servitect Logo" width="400" height="250">
</div>

[![npm version](https://badge.fury.io/js/servitect.svg)](https://badge.fury.io/js/servitect)
[![npm downloads](https://img.shields.io/npm/dm/servitect.svg)](https://www.npmjs.com/package/servitect)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### 🤔 Why Servitect?

Servitect is designed to simplify and accelerate the server development process by automating the setup of essential components for a modern backend. Here's why you should choose Servitect:

- 🏎️ **Speedy Development**: Perfect for **hackathons** and **rapid prototyping**, Servitect allows you to set up a fully functional server in minutes, letting you focus on building unique features and meeting tight deadlines rather than getting stuck in setup.

- 🗄️ **MongoDB Integration**: With built-in support for MongoDB, Servitect is ideal for modern applications that need a flexible and scalable NoSQL database.
  
- ⚙️ **Customizable**: Servitect's menu-driven approach allows you to pick and choose the features you need, giving you flexibility while still automating repetitive tasks.

- 🤖 **AI-Ready**: Built-in support for Large Language Models (LLMs) with LangChain integration for modern AI-powered applications.

Servitect streamlines the backend creation process, allowing developers to focus on building what matters most. Whether you're a beginner or an experienced developer, Servitect provides the tools you need to jumpstart your server development!

## 🚀 **Features**

`Servitect` comes with a variety of built-in features that streamline the development process:

<div align="center">
<img src="https://github.com/user-attachments/assets/6c13bfa0-892d-4ef8-bdb2-d6363e89a7e7" alt="Servitect Features" width="400" height="250">
</div>

### 1. 📁 MVC Folder Structure Generation

- Automatically generates a standard Model-Controller folder structure.
- Creates the directories and files for:
  - **Models**: MongoDB Schema definitions and database models.
  - **Controllers**: Handles logic and data flow between models and views.
  - **Routes**: Defines CRUD endpoints.
  - **Helper**: Utility functions and middleware.
  - **Constants**: Application constants and messages.

### 2. ✅ Best Practices for Scalability and Error Handling

- Comes with pre-configured global error-handling mechanisms.
- Implements best practices for middleware and request validation.
- Follows scalable design patterns to ensure maintainability even as your application grows.
- Built-in try-catch wrapper for async route handlers.

### 3. 🔒 Authentication APIs

- Provides complete authentication system with JWT tokens.
- Actor-based authentication system for users, admins, and custom roles.
- Secure password hashing with bcryptjs.
- Token verification middleware for protected routes.
- Session management with configurable token expiration.

### 4. 📝 CRUD API Generation

- Quickly generate Create, Read, Update, Delete (CRUD) APIs for any entity.
- Support for both Actor models (with authentication) and Entity models.
- Consistent API response format with success/error handling.
- Automatic route registration and controller generation.

### 5. 📤 File Uploads to Cloudinary

- Complete file upload system with Cloudinary integration.
- Support for single file, multiple files, and field-specific uploads.
- Automatic local file cleanup after cloud upload.
- Built-in file deletion capabilities from Cloudinary.
- Multer middleware for handling multipart/form-data.

### 6. 🟢 WhatsApp Notifications Integration

- Integrates with WhatsApp Cloud API for sending notifications.
- Template-based message sending system.
- Easy configuration with access tokens.
- Perfect for automated notifications and alerts.

### 7. 🔔 Firebase Cloud Messaging API Integration for Mobile Apps

- Complete Firebase FCM setup for push notifications.
- Support for sending notifications to individual devices.
- Topic-based messaging for broadcasting to multiple users.
- Batch notifications for sending to multiple FCM tokens.
- Multi-topic notification support with condition-based targeting.

### 8. 📨 NodeMailer Integration

- Full email functionality with NodeMailer.
- Gmail SMTP configuration out of the box.
- HTML email support for rich content.
- Environment-based configuration for security.

### 9. 💬 Chat Logic with Database Model and API Creation

- Ready-to-use real-time chat system.
- MongoDB-based chat storage with message history.
- APIs for sending messages and retrieving conversations.
- Support for one-on-one conversations with message threading.
- Timestamp tracking and sender identification.

### 10. 🐳 Docker Setup
- Pre-configured Docker setup for containerization.
- Production-ready Dockerfile with Node.js best practices.
- Easy deployment with container orchestration support.
- Development and production environment configurations.

### 11. 🤖 Large Language Model (LLM) Integration
- **Ollama Integration**: Local LLM deployment with conversation memory.
- **LangChain Framework**: Advanced prompt engineering and chain operations.
- Session-based conversation history for contextual responses.
- Customizable system prompts and model configurations.
- Support for multiple LLM models through Ollama.

## 📦 **Installation**

Install Servitect globally using npm:

```bash
npm install -g servitect
```

For Linux and Mac users:

```bash
sudo npm install -g servitect
```

## 🏁 **Quick Start**

After installation, you can create a new MVC project by running:

```bash
servitect
```

Follow the interactive **Menu** to configure your project with the features you need.

## 📚 **Usage**

### Creating a New Project

1. **Install Servitect globally:**
   ```bash
   npm install -g servitect
   ```

2. **Run the CLI tool:**
   ```bash
   servitect
   ```

3. **Select your project directory** and provide a project name when prompted.

4. **Choose "Initialize MVC"** from the menu to create the basic structure.

5. **Add additional modules** as needed:
   - Actor Models (Users, Admins, etc.)
   - Entity Models (Products, Orders, etc.)
   - Chat Module
   - File Upload Module
   - Firebase FCM
   - WhatsApp Integration
   - NodeMailer
   - Docker Setup
   - LLM Integration

6. **Navigate to your project and start the server:**
   ```bash
   cd your-project-name
   npm run server
   ```

7. **Test your APIs** - if you see `Connected` in the console, your APIs are ready!

## 🗂️ **Project Structure**

Here's an overview of the generated project structure:

```
my-project/
│
├── models/                 # Database models
│   ├── User.js            # Example actor model
│   └── Product.js         # Example entity model
│
├── controllers/           # Business logic
│   ├── userController.js
│   ├── productController.js
│   ├── chatController.js
│   ├── uploadController.js
│   └── firebaseController.js
│
├── routes/               # API routes
│   ├── router.js         # Main router
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── chatRoutes.js
│   ├── fileUploadRoutes.js
│   └── firebaseRoutes.js
│
├── helper/               # Utility functions
│   ├── JsonResponse.js   # Standardized API responses
│   ├── JWTAuthHelper.js  # JWT authentication
│   ├── TryCatch.js       # Error handling wrapper
│   ├── cloudinary.js     # File upload utilities
│   ├── LlmHelperOllama.js # LLM integration
│   ├── Nodemailer.js     # Email utilities
│   └── WhatsappNotification.js # WhatsApp messaging
│
├── constants/            # Application constants
│   └── Message.js        # Response messages
│
├── middleware/           # Express middleware
│   └── multer.js         # File upload middleware
│
├── public/               # Static files
│   └── uploads/          # Temporary file storage
│
├── .env                  # Environment variables
├── .gitignore           # Git ignore rules
├── package.json         # Dependencies and scripts
├── app.js               # Express application setup
├── db.js                # Database connection
├── Dockerfile           # Docker configuration
└── firebase-key.json    # Firebase service account key
```

## 🔌 **Integrations**

### 1. Cloudinary Setup

To enable file uploads with [Cloudinary](https://cloudinary.com/):

1. Sign up for a Cloudinary account
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. When prompted by Servitect, enter these credentials or add them to `.env` later:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### 2. Firebase FCM Setup

To use Firebase Cloud Messaging:

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
2. Go to **Settings** → **Cloud Messaging** and enable it
3. Go to **Service Accounts** → Generate **Private Key**
4. Save the downloaded JSON file as `firebase-key.json` in your project root
5. Add to `.env`:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS="firebase-key.json"
   ```

### 3. WhatsApp Setup

To use WhatsApp Cloud API:

1. Follow the [Meta WhatsApp Business API](https://developers.facebook.com/docs/whatsapp/) documentation
2. Get your access token and phone number ID
3. Add to `.env`:
   ```env
   WHATSAPP_URL="https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages"
   WHATSAPP_ACCESS_TOKEN=your_access_token
   ```

### 4. NodeMailer Setup

For email functionality:

1. Use a Gmail account with App Password (recommended)
2. Add to `.env`:
   ```env
   NODEMAILER_ADMIN_EMAIL=your_email@gmail.com
   NODEMAILER_ADMIN_PASSWORD=your_app_password
   ```

### 5. LLM Setup (Ollama)

For AI integration:

1. Install [Ollama](https://ollama.com/) locally
2. Pull a model (e.g., `ollama pull llama3.1`)
3. Ensure Ollama is running on `http://localhost:11434`
4. The LLM helper is pre-configured and ready to use

## 📋 **API Documentation**

### Authentication Endpoints

```
POST /user/register        # User registration
POST /user/login           # User login
GET  /user/get-by-id/:id   # Get user by ID (protected)
```

### File Upload Endpoints

```
POST /fileUpload/uploadSingleFile      # Upload single file
POST /fileUpload/uploadMultipleFiles   # Upload multiple files
POST /fileUpload/deleteSingleFile      # Delete file from Cloudinary
```

### Chat Endpoints

```
POST /chat/send-chat                   # Send a message
GET  /chat/get-my-chat/:id/:contactId  # Get conversation history
```

### Firebase FCM Endpoints

```
POST /firebase/sendNotificationToCustomDevice    # Send to specific device
POST /firebase/sendNotificationToTopic/:topic    # Send to topic subscribers
POST /firebase/sendBatchNotificationsMultipleFCMS # Batch send to multiple devices
```

### LLM Endpoints

```
POST /llm/ask-llm          # Send prompt to LLM and get response
```

## 🛡️ **Security Features**

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **CORS Protection**: Cross-origin request handling
- **Environment Variables**: Sensitive data protection
- **Input Validation**: Request data validation and sanitization
- **Error Handling**: Comprehensive error management without exposing sensitive info

## 🔧 **Development Commands**

```bash
npm run server    # Start development server with nodemon
npm run watch     # Alternative development command
```

## 🐣 **New to Development? We're Here to Help!**

If you are just starting your journey in server development or find certain concepts challenging, we have resources to assist you:

- **YouTube Tutorials**: Visit our [YouTube channel](https://www.youtube.com/@CodeGenieKush) for comprehensive tutorials
- **In-Depth Documentation**: Detailed documentation covering features, commands, and best practices
- **Community Support**: Connect with us on LinkedIn for support and questions:
   - [Kush Kapadia](https://www.linkedin.com/in/kushkapadia/)
   - [Mit Shah](https://www.linkedin.com/in/mitshah2406/)
   - [Atharva Jadhav](https://www.linkedin.com/in/atharvajadhav88/)

## 🤝 **Contributing**

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/kushkapadia/MVCGenerator/issues).

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📈 **Stats**

- 🎯 **1000+** weekly downloads on npm
- ⭐ **Growing** GitHub stars
- 🚀 **Production-ready** code generation
- 🔧 **10+** integrated modules and features

## 📄 **License**

This project is [MIT](https://opensource.org/licenses/MIT) licensed.

## 🙏 **Acknowledgements**

- Thanks to all contributors who have helped shape Servitect
- Inspired by the need for rapid, scalable server development in the Node.js ecosystem
- Built with modern development practices and industry standards

## 🔗 **Links**

- **NPM Package**: [https://www.npmjs.com/package/servitect](https://www.npmjs.com/package/servitect)
- **GitHub Repository**: [https://github.com/kushkapadia/MVCGenerator](https://github.com/kushkapadia/MVCGenerator)
- **YouTube Channel**: [CodeGenieKush](https://www.youtube.com/@CodeGenieKush)

---

## 🚀 **Happy Coding!**

Made with ❤️ by **Elite Coders**

**Server + Architect = Servitect** - Your one-click solution for Node.js MVC backend development!
