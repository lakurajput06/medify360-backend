import app from "./src/app.js";
import { config } from "dotenv";
import connectDB from "./src/db/index.js";

config();

const PORT = process.env.PORT || 5000;


const App =  app.listen(PORT,async()=>{
    await connectDB();
    console.log(`App is running at http://localhost:${PORT}`);
});
export default App;