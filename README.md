# Servitect

### **Server + Architect = Servitect**
Automate the creation of a well-structured Model-View-Controller (MVC) pattern for your Node.js projects with ease. `Servitect` is designed to help developers quickly scaffold a project, follow best practices, and integrate various functionalities with minimal setup.

## 🚀 **Features**

`Servitect` comes with a variety of built-in features that streamline the development process:

### 1. MVC Folder Structure Generation
- Automatically generates a standard Model-View-Controller folder structure.
- Creates the directories and files for:
  - **Models**: Schema definitions and database models.
  - **Views**: Template files for rendering views.
  - **Controllers**: Handles logic and data flow between models and views.
  - **Routes**: Defines API routes and endpoints.
- Pre-configured to follow best practices for scalability and maintainability.

### 2. Pre-Configured Files
- Basic template files are generated for routes, controllers, and models.
- Pre-configured for easy expansion and customization, allowing you to focus on building out your business logic.

### 3. Best Practices for Scalability and Error Handling
- Comes with pre-configured error-handling mechanisms.
- Follows scalable design patterns to ensure maintainability even as your application grows.
- Implements best practices for middleware and request validation.

### 4. Pre-Configured Authentication APIs
- Provides basic authentication APIs out of the box.
- JWT-based authentication is available for secure user sessions.
- Easily configure authentication for any actor entity in your project.

### 5. CRUD API Generation
- Quickly generate Create, Read, Update, Delete (CRUD) APIs for any entity.
- Pre-built controllers and routes to speed up the setup process.
- Helps ensure consistency in API design.

### 6. File Uploads to Cloudinary
- Includes an option to add file upload functionality to Cloudinary.
- Pre-configured with Cloudinary integration, making it easy to manage media assets.

### 7. WhatsApp Notifications Integration
- Integrates with WhatsApp for sending notifications directly from your application.
- Useful for sending alerts, reminders, or updates to users.

### 8. Firebase FCM Integration
- Provides a simple setup for Firebase Cloud Messaging (FCM).
- Send push notifications to users with minimal setup.
- Great for real-time updates and user engagement.

### 9. NodeMailer Integration
- Pre-configured integration with NodeMailer for email communication.
- Quickly set up email functionality to send password resets, welcome emails, and more.
- Works out of the box with minimal configuration required.

### 10. Chat Logic with Database Model and API Creation
- Ready-to-use logic for implementing chat features.
- Generates chat database models and API endpoints.
- Easily set up messaging functionality within your applications.

### 11. Local LLM Integration Using LangChain and Ollama
- Integrates with LangChain and Ollama for local large language model (LLM) support.
- Enables advanced AI-driven interactions and language processing directly in your app.
- Easily set up custom LLM-based features without external dependencies.

## 📦 Installation

Install Servitect globally using npm:

```bash
npm install -g servitect
```

## 🏁 Quick Start

After installation, you can create a new MVC project by running:

```bash
npx mvc-create
```

Follow the interactive prompts to configure your project.

## 📚 Usage

### Creating a New Project

1. Open your terminal
2. Navigate to the directory where you want to create your project
3. Run the command:
   ```bash
   npx mvc-create
   ```
4. Follow the prompts to set up your project



## 🗂️ Project Structure

Here's an overview of the generated project structure:

```
my-project/
│
├── models/
├── controllers/
├── middleware/
│── helper/
│── public/
│
├── .env
├── .gitignore
├── package.json
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root of your project and add the following:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Adjust these values according to your needs.

## 🔌 Integrations

### Cloudinary Setup

To enable file uploads with Cloudinary:

1. Sign up for a Cloudinary account
2. Add the following to your `.env` file:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Firebase FCM Setup

To use Firebase Cloud Messaging:

1. Set up a Firebase project
2. Add your Firebase configuration to `.env`:
   ```env
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY=your_private_key
   FIREBASE_CLIENT_EMAIL=your_client_email
   ```

(Add setup instructions for other integrations)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/yourusername/servitect/issues).

## 📄 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.

## 🙏 Acknowledgements

- Thanks to all contributors who have helped shape Servitect
- Inspired by the need for rapid, scalable server development in the Node.js ecosystem

---

Made with ❤️ by Elite Coders
