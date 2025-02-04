import { AppDataSource } from "./data-source";
import { app } from "./app";

const PORT = process.env.PORT || 4000;

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    /*if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL must be defined");
    }*/

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error: any) => {
    console.error("Error during Data Source initialization:", error);
  });
