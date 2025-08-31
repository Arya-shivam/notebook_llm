import express from "express";
import cors from "cors";
import uploadRoute from "./routes/uploadRoute.js";
import chatRoute from "./routes/chatRoute.js"
const app = express()

// Configure CORS for production
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    /\.vercel\.app$/, // Allow all Vercel deployments
    /\.localhost:3000$/, // Local development
    'https://your-frontend-url.vercel.app' // Update this with your actual frontend URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});
// to upload files 
app.use("/upload",uploadRoute);

app.use("/chat",chatRoute)


const PORT = process.env.PORT || 3000;

// For Vercel, we export the app instead of listening
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;

