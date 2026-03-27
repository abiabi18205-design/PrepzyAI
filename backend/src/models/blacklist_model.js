import mongoose from 'mongoose';

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d' // ✅ Auto delete after 7 days (matches JWT expiry)
  }
});

const Blacklist = mongoose.model('Blacklist', blacklistSchema);

export default Blacklist;