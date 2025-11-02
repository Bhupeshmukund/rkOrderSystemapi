
import mongoose from "mongoose";

const uri = "mongodb+srv://bhupeshv668_db_user:LMjQjVphTcm599A0@rkcluster0.0mq3pfb.mongodb.net/rkOrderSystem?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
  .then(() => console.log("✅ Mongo connected"))
  .catch((err) => console.error("❌ Mongo error:", err));

mongoose.connect(uri)
  .then(() => console.log("✅ Mongo connected"))
  .catch((err) => console.error("❌ Mongo error:", err));
