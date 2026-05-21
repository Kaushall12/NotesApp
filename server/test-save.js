import mongoose from 'mongoose';
import Note from './models/Note.js';
import Version from './models/Version.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected');
  
  // create dummy user
  const User = (await import('./models/User.js')).default;
  let user = await User.findOne();
  if (!user) user = await User.create({ name: 'Test', email: 'test@test.com', googleId: '123' });
  
  const note = await Note.create({ userId: user._id, title: 'Untitled', content: '' });
  console.log('Note created', note);
  
  try {
    await Version.create({
      noteId: note._id,
      title: note.title,
      content: note.content
    });
    console.log('Version created successfully');
  } catch (err) {
    console.error('Error creating version:', err.message);
  }
  
  process.exit(0);
}
test();
