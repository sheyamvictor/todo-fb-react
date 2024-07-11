import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

const app = express();

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://sheyamjoseph:Vy1fsw49zHUZwmMS@cluster0.4zuposy.mongodb.net/todolistdb?retryWrites=true&w=majority&tls=true";

const client = new MongoClient(uri);
let todoListCol;

const connectDb = async () => {
  try {
    await client.connect();
    console.log("Connected to DB");
    todoListCol = client.db('todolistdb').collection('todolist');
  } catch (error) {
    console.error("Database connection error: ", error);
  }
};

app.get("/todo", async (req, res) => {
  try {
    let todoLists = await todoListCol.find().toArray();
    res.send({ status: 200, data: todoLists });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/todo", async (req, res) => {
  let { todoValue } = req.body;
  try {
    await todoListCol.insertOne({ value: todoValue });
    res.send(true);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.put("/todo/:id", async (req, res) => {
  const { id } = req.params;
  const { todoValue } = req.body;
  try {
    const result = await todoListCol.updateOne(
      { _id: new ObjectId(id) },
      { $set: { value: todoValue } }
    );
    res.send(result.matchedCount > 0);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.delete("/todo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await todoListCol.deleteOne({ _id: new ObjectId(id) });
    res.send(result.deletedCount > 0);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(5001, () => {
  console.log("Server started on port 5001");
  connectDb();
});
