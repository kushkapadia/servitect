// MVC Essential Dependencies

const dependencies = [
  { name: "bcryptjs", isDev: false },
  { name: "express", isDev: false },
  { name: "jsonwebtoken", isDev: false },
  { name: "connect-mongo", isDev: false },
  { name: "dotenv", isDev: false },
  { name: "express-async-handler", isDev: false },
  { name: "cors", isDev: false },
  { name: "http-status-codes", isDev: false },
  { name: "morgan", isDev: true },
  { name: "nodemon", isDev: true },
];

const fileUploadDependencies = [
  { name: "multer", isDev: false },
  { name: "cloudinary", isDev: false },
];

const firebaseDependencies = [
  { name: "firebase-admin", isDev: false },
  { name: "google-auth-library", isDev: false },
  { name: "googleapis", isDev: false },
];

const whatsappDependencies = [{ name: "axios", isDev: false }];

const nodeMailerDependencies = [{ name: "nodemailer", isDev: false }];

export {
  dependencies,
  fileUploadDependencies,
  firebaseDependencies,
  whatsappDependencies,
  nodeMailerDependencies,
};
