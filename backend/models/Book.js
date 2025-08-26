import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  grade: { type: Number, required: true, min: 0, max: 5 },
}, { _id: false });

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: { type: [ratingSchema], required: true, default: [] },
  averageRating: { type: Number, required: true, min: 0, max: 5, default: 0 },
  
});

export default mongoose.model('Book', bookSchema);