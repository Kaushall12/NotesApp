import mongoose from 'mongoose';

const versionSchema = new mongoose.Schema(
  {
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Version', versionSchema);
