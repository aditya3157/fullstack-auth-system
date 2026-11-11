const bcrypt = require('bcryptjs');
const { createUser, findUserByEmail } = require('./database');

async function seed() {
  console.log('🌱 Seeding initial demo account...');
  
  const demoEmail = 'alex.rivera@example.com';
  const existing = findUserByEmail(demoEmail);

  if (!existing) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);

    const user = createUser({
      name: 'Alex Rivera',
      email: demoEmail,
      password: hashedPassword,
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      bio: 'Senior Full Stack Engineer & Cloud Architect. Passionate about building secure, responsive web applications and scalable database backends.'
    });

    console.log('✅ Demo user seeded successfully:', user.email);
    console.log('   Email:    alex.rivera@example.com');
    console.log('   Password: Password123!');
  } else {
    console.log('ℹ️ Demo user already exists:', demoEmail);
  }
}

seed().catch(console.error);
