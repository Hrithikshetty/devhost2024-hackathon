import dotenv from 'dotenv';
import connectDB from "./DB/db.js";

import app from './app.js'

dotenv.config({
  path: './env',
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server started on port ${process.env.PORT || 8000}`.bgCyan.white);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed !!".bgRed.white, err);
<<<<<<< HEAD
  });
=======
  });
>>>>>>> f19ce0cab38f7979b9e42a2f8b1f769823137f3c
