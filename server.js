import "dotenv/config";
import connectDb from "./src/common/config/db.js";
import app from "./src/app.js";

connectDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`App is listening on ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Mongo Db failed to connect ", error);
  });
