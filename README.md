# Servitect - A one-click Node.js MVC Server generator

### **Server + Architect = Servitect**
 
Automate the creation of a well-structured Model-View-Controller (MVC) pattern for your Node.js projects with ease. `Servitect` is designed to help developers quickly scaffold a project, follow best practices, and integrate various functionalities with minimal setup.

<div align="center">
<img src="https://github.com/kushkapadia/servitect/blob/main/servitectLogo.jpeg" alt="Description" width="400" height="250">
</div>

### 🤔 Why Servitect?

Servitect is designed to simplify and accelerate the server development process by automating the setup of essential components for a modern backend. Here’s why you should choose Servitect:

- 🏎️ **Speedy Development**: Perfect for **hackathons** and **rapid prototyping**, Servitect allows you to set up a fully functional server in minutes, letting you focus on building unique features and meeting tight deadlines rather than getting stuck in setup.

- 🗄️ **MongoDB Integration**: With built-in support for MongoDB, Servitect is ideal for modern applications that need a flexible and scalable NoSQL database.
  
- ⚙️ **Customizable**: Servitect’s menu-driven approach allows you to pick and choose the features you need, giving you flexibility while still automating repetitive tasks.

Servitect streamlines the backend creation process, allowing developers to focus on building what matters most. Whether you're a beginner or an experienced developer, Servitect provides the tools you need to jumpstart your server development!

## 🚀 **Features**

`Servitect` comes with a variety of built-in features that streamline the development process:

<div align="center">
<img src="https://github.com/user-attachments/assets/6c13bfa0-892d-4ef8-bdb2-d6363e89a7e7" alt="Description" width="400" height="250">
</div>


### 1. 📁 MVC Folder Structure Generation

- Automatically generates a standard Model-Controller folder structure.
- Creates the directories and files for:
  - **Models**: MongoDB Schema definitions and database models.
  - **Controllers**: Handles logic and data flow between models and views.
  - **Routes**: Defines CRUD endpoints.

### 2. ✅ Best Practices for Scalability and Error Handling

- Comes with pre-configured global error-handling mechanisms.
- Implements best practices for middleware and request validation.
- Follows scalable design patterns to ensure maintainability even as your application grows.

### 3. 🔒 Authentication APIs

- Provides basic authentication APIs.
- JWT-based authentication is available for secure user sessions.
- Auto configures authentication for any actor entity in your project.

### 4. 📝 CRUD API Generation

- Quickly generate Create, Read, Update, Delete (CRUD) APIs for any entity.
- Ensures consistency in API design.

### 5. 📤 File Uploads to Cloudinary

- Includes an option to add file upload functionality to Cloudinary.
- Configured with Cloudinary integration, making it easy to manage media assets.

### 6. 🟢 WhatsApp Notifications Integration

- Integrates with WhatsApp on the fly for sending notifications directly from your application.
- Useful for sending alerts, reminders, or updates to users.

### 7. 🔔 Firebase Cloud Messaging API Integration for Mobile Apps

- Provides a simple setup for Firebase Cloud Messaging (FCM).
- Send push notifications to users.
- Great for real-time updates and user engagement.

### 8. 📨 NodeMailer Integration

- Integration with NodeMailer for email communication.
- Quickly set up email functionality to send password resets, welcome emails, and more.

### 9. 💬 Chat Logic with Database Model and API Creation

- Ready-to-use logic for implementing chat features.
- Generates chat database models and API endpoints.
- Easily set up messaging functionality within your applications.

### 10. 🐳 Docker Setup
- Quickly containerize your application with a pre-configured Docker setup.
- Generates Docker files for easy deployment, ensuring consistency across different environments.

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

To use Whatsapp APIs, refer the official documentaion:

- [META Documentation](https://developers.facebook.com/docs/whatsapp/).

### 🐣 New to Development? We’re Here to Help!

If you are just starting your journey in server development or find certain concepts challenging, rest assured that we have the resources to assist you:

- **YouTube Tutorials**: Visit our [YouTube channel](https://www.youtube.com/@CodeGenieKush) for comprehensive tutorials that guide you through the process of using Servitect and understanding the generated code.

- **In-Depth Documentation**: Access our detailed [documentation](#) that covers features, commands, and industry best practices in a clear and approachable manner.

- **Community Support**: Connect with us on LinkedIn for community support. Feel free to reach out with any questions or share your experiences. I’m here to provide assistance!
   - [Kush Kapadia](https://www.linkedin.com/in/kushkapadia/)
   - [Mit Shah](https://www.linkedin.com/in/mitshah2406/)
   - [Atharva Jadhav](https://www.linkedin.com/in/atharvajadhav88/)

With these resources at your disposal, you’ll be well-equipped to leverage Servitect and develop outstanding applications efficiently and on the go.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/kushkapadia/servitect/issues).

## 📄 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.

## 🙏 Acknowledgements

- Thanks to all contributors who have helped shape Servitect
- Inspired by the need for rapid, scalable server development in the Node.js ecosystem

## 🚀Happy Coding!

Made with ❤️ by Elite Coders
