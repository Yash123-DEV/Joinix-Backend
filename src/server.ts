import { connectDB } from "./config/db";
import app from "./index";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
  });
});



