import Express from "express";
import { LeetcodeAuth } from "./leetcodeAuth.js";

const app = Express();
app.use(
  Express.urlencoded({
    extended: true,
  })
);

app.use(Express.json());

const leetcodeAuth = new LeetcodeAuth();

app.get("/access-token", async (req, res) => {
  const token = await leetcodeAuth.accessToken();
  res.json(token);
});

app.post("/user-info", async (req, res) => {
  const d = req.body;
  const data = await leetcodeAuth.getUserInfo(d.username, d.token, d.session);
  res.json(data);
});

app.listen(8000);
