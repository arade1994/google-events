import app from "./src/app";

const start = () => {
  app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
  });
};

start();
