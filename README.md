# Servitect - A one-click Node.js MVC Server generator

### **Server + Architect = Servitect**
 
Automate the creation of a well-structured Model-View-Controller (MVC) pattern for your Node.js projects with ease. `Servitect` is designed to help developers quickly scaffold a project, follow best practices, and integrate various functionalities with minimal setup.

<div align="center">
<img src="https://github.com/kushkapadia/servitect/blob/main/servitectLogo.jpeg" alt="Description" width="400" height="250">
</div>

## **Why Servitect?**
Servitect is designed to simplify and accelerate the server development process by automating the setup of essential components for a modern backend. 
Here’s why you should choose Servitect:
-**Speedy Development**: Perfect for **_hackathons_** and rapid **_prototyping_**, Servitect allows you to set up a fully functional server in minutes, letting you focus on building unique features and meeting tight deadlines rather than getting stuck in setup.
-**MongoDB Integration**: Support MongoDB by default to makes it ideal for modern applications.
-**Customizable**: Servitect’s menu-driven approach allows you to pick and choose the features you need, giving you flexibility while still automating repetitive tasks.
## 🚀 **Features**

`Servitect` comes with a variety of built-in features that streamline the development process:

### 1. MVC Folder Structure Generation

- Automatically generates a standard Model-Controller folder structure.
- Creates the directories and files for:
  - **Models**: Schema definitions and database models.
  - **Controllers**: Handles logic and data flow between models and views.
  - **Routes**: Defines API routes and endpoints.
- Pre-configured to follow best practices for scalability and maintainability.

### 2. Pre-Configured Files

- Basic template files are generated for routes, controllers, and models.
- Pre-configured for easy expansion and customization, allowing you to focus on building out your business logic.

### 3. Best Practices for Scalability and Error Handling

- Comes with pre-configured global error-handling mechanisms.
- Follows scalable design patterns to ensure maintainability even as your application grows.
- Implements best practices for middleware and request validation.

### 4. Authentication APIs

- Provides basic authentication APIs out of the box.
- JWT-based authentication is available for secure user sessions.
- Auto configures authentication for any actor entity in your project.

### 5. CRUD API Generation

- Quickly generate Create, Read, Update, Delete (CRUD) APIs for any entity.
- Pre-built controllers and routes to speed up the setup process.
- Helps ensure consistency in API design.

### 6. File Uploads to Cloudinary

- Includes an option to add file upload functionality to Cloudinary.
- Configured with Cloudinary integration, making it easy to manage media assets.

### 7. WhatsApp Notifications Integration

- Integrates with WhatsApp for sending notifications directly from your application.
- Useful for sending alerts, reminders, or updates to users.

### 8. Firebase Cloud Messaging API Integration for Mobile Apps

- Provides a simple setup for Firebase Cloud Messaging (FCM).
- Send push notifications to users.
- Great for real-time updates and user engagement.

### 9. NodeMailer Integration

- Integration with NodeMailer for email communication.
- Quickly set up email functionality to send password resets, welcome emails, and more.

### 10. Chat Logic with Database Model and API Creation

- Ready-to-use logic for implementing chat features.
- Generates chat database models and API endpoints.
- Easily set up messaging functionality within your applications.

## 📦 **Installation**

Install Servitect using npm:

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
mvc-create
```

Follow the `Menu` to configure your project.

## 📚 **Usage**

### Creating a New Project

1. Open your terminal
2. Navigate to the directory where you want to create your project
3. Run the command
   ```bash
   npm i -g servitect
   ```
4. Run the command
   ```bash
   mvc-create
   ```
5. Follow the `Menu` to configure your project.
6. Run the command:
   ```bash
   cd project-name
   npm run server
   ```
   to run the server.
   If you see `connected` on your console, your APIs are ready to test.

## 🗂️ **Project Structure**

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

## 🔌 **Integrations**

### Cloudinary Setup

To enable file uploads with [Cloudinary](https://cloudinary.com/):

1. Sign up for a Cloudinary account

### Firebase FCM Setup

To use Firebase Cloud Messaging:

1. Create a private key file.
2. To create the file, set up a Firebase project using the [Firebase Console](https://console.firebase.google.com/u/0/?pli=1).
3. Go to 🛠️ **Settings** -> ⛅ **Cloud Messaging** tab. Enable it.
4. Go to **Service accounts** tab -> generate 🔐 **private key**.
5. Copy the content of that file as it is to 📂 **"firebase-key.json"**.

### Whatsapp Setup

To use Firebase Cloud Messaging:

--add whats app steps here.

(Add setup instructions for other integrations)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/kushkapadia/servitect/issues).

## 📄 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.

## 🙏 Acknowledgements

- Thanks to all contributors who have helped shape Servitect
- Inspired by the need for rapid, scalable server development in the Node.js ecosystem

## 🚀Happy Coding!

Made with ❤️ by Elite Coders
