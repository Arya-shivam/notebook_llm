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
    'https://your-frontend-url.vercel.app', // Update this with your actual Vercel URL
    /\.vercel\.app$/ // Allow all Vercel preview deployments
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});
// to upload files 
app.use("/upload",uploadRoute);

app.use("/chat",chatRoute)


const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

