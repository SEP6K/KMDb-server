import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  const prisma = new PrismaClient();
  const movie = await prisma.movies.findFirst({
    where: {
      id: 15724,
    },
  });
  res.send(movie);
});

app.listen(port, () => {
  console.log("listening on", port);
});
