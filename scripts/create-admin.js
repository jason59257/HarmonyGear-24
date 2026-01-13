// Script to create admin user
// Usage: node scripts/create-admin.js

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function hashPassword(password) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
    console.log('=== Create Admin User ===\n');
    
    const email = await question('Admin email: ');
    const password = await question('Admin password: ');
    const name = await question('Admin name (optional): ');
    
    if (!email || !password) {
        console.error('Email and password are required!');
        rl.close();
        process.exit(1);
    }
    
    const passwordHash = await hashPassword(password);
    
    console.log('\n=== Admin User Info ===');
    console.log('Email:', email);
    console.log('Name:', name || '');
    console.log('Password Hash:', passwordHash);
    console.log('\n=== SQL Command ===');
    console.log('Execute this SQL in your D1 database:');
    console.log('');
    console.log(`INSERT INTO admin_users (email, password_hash, name, role) VALUES ('${email}', '${passwordHash}', '${name || ''}', 'admin');`);
    console.log('');
    console.log('Or use wrangler command:');
    console.log(`npm run wrangler -- d1 execute harmonygear24 --command="INSERT INTO admin_users (email, password_hash, name, role) VALUES ('${email}', '${passwordHash}', '${name || ''}', 'admin');" --remote`);
    console.log('');
    
    rl.close();
}

main().catch(console.error);
