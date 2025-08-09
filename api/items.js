// /api/items.js
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://razzakruqia:tzzrcZf46FGo48kG@cluster0.qiwkfh1.mongodb.net/myDatabase?retryWrites=true&w=majority';
// Replace 'myDatabase' with your actual DB name if different

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then(mongoose => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const itemSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);

export default async function handler(req, res) {
  await connectToDatabase();

  const { method } = req;

  try {
    switch (method) {
      case 'GET': {
        const items = await Item.find();
        res.status(200).json(items);
        break;
      }
      case 'POST': {
        const { name } = req.body;
        const newItem = new Item({ name });
        const saved = await newItem.save();
        res.status(201).json(saved);
        break;
      }
      case 'PUT': {
        const { id, name } = req.body;
        const updated = await Item.findByIdAndUpdate(id, { name }, { new: true });
        res.status(200).json(updated);
        break;
      }
      case 'DELETE': {
        const { id } = req.query;
        await Item.findByIdAndDelete(id);
        res.status(200).json({ success: true });
        break;
      }
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
