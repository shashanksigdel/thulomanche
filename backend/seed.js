import mongoose from 'mongoose';
import User from './src/models/User.js';
import Post from './src/models/Post.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Thulomanche',
      email: 'admin@thulomanche.com',
      password: 'password123',
      bio: 'Creator and writer at Thulomanche',
      role: 'admin'
    });
    console.log('Admin user created');

    // Create sample posts
    const posts = [
      {
        title: 'Welcome to Thulomanche: A Journey Begins',
        content: '<h2>Hello World</h2><p>Welcome to my digital space. This is the beginning of something special—a place where ideas come to life and thoughts find their audience.</p><p>Thulomanche is more than just a blog. It\'s a collection of insights, stories, and perspectives on life, technology, creativity, and everything in between.</p><p>Whether you\'re here for the articles, the insights, or just curious about what I have to say, I\'m glad you stopped by. Stick around and let\'s explore some interesting ideas together.</p>',
        excerpt: 'Welcome to Thulomanche. A space for ideas, stories, and perspectives.',
        author: admin._id,
        categories: ['Personal', 'Introduction'],
        tags: ['welcome', 'start', 'journey'],
        published: true,
        viewCount: 0
      },
      {
        title: 'The Art of Writing: Finding Your Voice',
        content: '<h2>Discovering Your Unique Voice</h2><p>Writing is a journey of self-discovery. Every writer has a unique voice—a distinct way of seeing and expressing the world. The challenge is finding it and having the courage to share it with others.</p><h2>Tips for Finding Your Voice</h2><p>Start by writing what you know. Don\'t imitate others; instead, let your personality shine through your words. Read widely, write often, and be willing to revise.</p><p>Your voice is not something you find overnight. It\'s something you develop over time through consistent practice and honest reflection.</p><h2>Why It Matters</h2><p>In a world full of noise, authentic voices stand out. Readers connect with writers who are genuine and sincere. So find your voice and use it.</p>',
        excerpt: 'Discovering and developing your unique writing voice.',
        author: admin._id,
        categories: ['Writing', 'Creativity'],
        tags: ['writing', 'voice', 'creativity', 'tips'],
        published: true,
        viewCount: 0
      },
      {
        title: 'Technology and Human Connection',
        content: '<h2>A Digital Paradox</h2><p>We\'ve never been more connected technologically, yet somehow feel more isolated than ever. This paradox is one of the defining challenges of our time.</p><p>Technology was supposed to bring us together, and in many ways it has. But it\'s also created new barriers, new forms of anxiety, and new ways to disconnect from genuine human contact.</p><h2>Finding Balance</h2><p>The answer isn\'t to reject technology entirely. Instead, we need to be more intentional about how we use it. We need to remember that behind every screen is a human being seeking connection.</p><p>Let\'s use technology as a tool to enhance our relationships, not replace them. Let\'s be present with the people around us while also leveraging the incredible opportunities technology provides.</p>',
        excerpt: 'Exploring the complex relationship between technology and human connection in the modern world.',
        author: admin._id,
        categories: ['Technology', 'Society'],
        tags: ['technology', 'connection', 'digital', 'society'],
        published: true,
        viewCount: 0
      },
      {
        title: 'Productivity Myths We Need to Stop Believing',
        content: '<h2>The Hustle Culture Trap</h2><p>We\'ve been sold a lie. That productivity is about doing more, working longer, and pushing harder. But true productivity is about working smarter, not harder.</p><h2>Myth #1: Busy = Productive</h2><p>Just because you\'re busy doesn\'t mean you\'re being productive. Many of the busiest people accomplish the least of value.</p><h2>Myth #2: Sleep is Optional</h2><p>If you want to be productive, you need rest. Sleep is not a luxury—it\'s a necessity. Your brain does its best work when it\'s well-rested.</p><h2>Myth #3: More Hours = Better Results</h2><p>Working 10 hours a day doesn\'t produce twice the output of 5 hours. In fact, it often produces worse results due to fatigue and diminished focus.</p><h2>What Actually Works</h2><p>Focus on the important tasks. Take regular breaks. Get enough sleep. And remember that rest is productive too.</p>',
        excerpt: 'Let\'s debunk common productivity myths and discover what actually works.',
        author: admin._id,
        categories: ['Productivity', 'Lifestyle'],
        tags: ['productivity', 'myths', 'efficiency', 'lifestyle'],
        published: true,
        viewCount: 0
      },
      {
        title: 'The Power of Reading: Why Every Writer Should Read',
        content: '<h2>You Can\'t Write If You Don\'t Read</h2><p>If you want to be a better writer, read more. It\'s that simple. Reading is the foundation of good writing.</p><h2>What Reading Does</h2><p>Reading expands your vocabulary, exposes you to different writing styles, and gives you ideas. It shows you what\'s possible and inspires you to push your own boundaries.</p><h2>What to Read</h2><p>Read widely. Don\'t just read in your genre. Read fiction, philosophy, science, history, poetry—everything. Each genre teaches you something different about the craft of writing.</p><h2>Make It a Habit</h2><p>Set a reading goal. Whether it\'s 30 minutes a day or one book a week, consistency matters. Over time, reading will transform your writing.</p><p>So pick up a book today. Your writing will thank you for it.</p>',
        excerpt: 'Why reading is essential for writers and how to make it a daily habit.',
        author: admin._id,
        categories: ['Writing', 'Books'],
        tags: ['reading', 'writing', 'books', 'learning'],
        published: true,
        viewCount: 0
      }
    ];

    await Post.insertMany(posts);
    console.log('Sample posts created');

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
