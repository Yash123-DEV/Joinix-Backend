import { connectDB } from "./config/db";
import {server} from "./index";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
  });
});



