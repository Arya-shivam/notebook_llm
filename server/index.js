import express from "express";
import cors from "cors";
import uploadRoute from "./routes/uploadRoute.js";
import chatRoute from "./routes/chatRoute.js"
const app = express()

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});
// to upload files 
app.use("/upload",uploadRoute);

app.use("/chat",chatRoute)


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

