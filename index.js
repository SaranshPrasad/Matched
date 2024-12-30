const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {connectDB} = require("./src/config/database");


// app init
const app = express();
const PORT = process.env.PORT || 7777;
// middlewares for frontend 
app.use(cors({
    credentials: true,
    origin: "https://matchedfrontend.onrender.com/"
  }));

// middlewares 
app.use(cookieParser());
app.use(express.json());

// database connection


connectDB().then(() =>{
    console.log("Database connection done !");
}).catch((err) =>{
    console.error("Database connection issue : ", err.message);
});

app.get("/", (req, res) => {
    res.send("Hellow")
});

const userRouter = require("./src/routes/auth");
const eventRouter = require("./src/routes/event");
const attendeeRouter = require("./src/routes/attendee");
const matchRouter = require("./src/routes/match");
app.use("/", userRouter);
app.use("/", eventRouter);
app.use("/", attendeeRouter);
app.use("/", matchRouter);

app.listen(PORT, (req,res) =>{
    console.log(`Server is up at url :- http://localhost:${PORT}`);

})

