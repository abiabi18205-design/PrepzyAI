import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "./src/models/question_model.js";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const all = await Question.find();
    console.log("Total questions in DB:", all.length);
    const byCat = {};
    all.forEach(q => {
      const key = `${q.category} -> ${q.difficulty}`;
      byCat[key] = (byCat[key] || 0) + 1;
    });
    console.log("Count per category/difficulty:");
    console.log(byCat);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("DB Error:", err);
  });
