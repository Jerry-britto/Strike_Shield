// MUST be the first import: ESM evaluates dependencies before this file's
// body, so the old `dotenv.config()` call below the imports ran AFTER
// firebase_upload.js had already read process.env at module scope.
import "dotenv/config";
import app from "./app.js";
import { connectToDb } from "./db/connect.js";

const PORT = process.env.PORT || 4000;

connectToDb()
  .then(function () {
    app.listen(PORT, function () {
      console.log(`App is running on http://localhost:${PORT}`);
    });
  })
  .catch(function (err) {
    console.log("MONGODB connection error failed!!", err);
    app.on("error", function (error) {
      //this is done to ensure whether our express app is able to respond to db or not
      console.log("Not able to connect with db");
      process.exit(1)
    });
  });
