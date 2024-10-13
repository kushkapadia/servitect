# Servitect

Servitect (Server + Architect) is a powerful npm package designed to rapidly scaffold and create MVC-structured servers with a rich set of pre-configured features and integrations.

## 🚀 Features

- 🏗️ Automatic generation of MVC (Model-View-Controller) folder structure
- 📁 Pre-configured files for routes, controllers, and models
- 🔧 Best practices for scalability, maintainability, and error-handling
- 🔐 Pre-configured basic authentication APIs
- 🛠️ Pre-configured CRUD APIs for any created entity
- 🔑 JWT-based authentication for any actor entity
- 📤 Option to add file upload functionality with Cloudinary integration
- 📱 WhatsApp Notifications integration
- 🔔 Firebase FCM integration APIs in one click
- 📧 NodeMailer Integration with a single click
- 💬 Chat logic with database model and API creation
- 🤖 Local LLM Integration using Langchain and Ollama

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

### Available Commands

- `npx mvc-create`: Initializes a new MVC project
- `npx mvc-add-model`: Adds a new model to your project
- `npx mvc-add-controller`: Adds a new controller
- `npx mvc-add-route`: Adds a new route

(Add more commands as applicable)

## 🗂️ Project Structure

Here's an overview of the generated project structure:

```
my-project/
│
├── src/
│   ├── models/
│   ├── views/
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   └── config/
│
├── tests/
├── public/
├── .env
├── .gitignore
├── package.json
└── README.md
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

Made with ❤️ by [Your Name/Organization]
