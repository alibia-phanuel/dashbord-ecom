import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Test minimal OK");
});

app.listen(3000, () => {
  console.log("Serveur test démarré sur le port 3000");
});
