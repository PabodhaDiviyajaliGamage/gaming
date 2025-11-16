// Script to check password formats in MongoDB
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

async function checkPasswords() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected!')
    
    console.log('\n📊 Checking all users...\n')
    const users = await User.find({}).select('email password role')
    
    for (const user of users) {
      const isBcryptHash = /^\$2[ayb]\$/.test(user.password)
      console.log('-----------------------------------')
      console.log('Email:', user.email)
      console.log('Role:', user.role)
      console.log('Password format:', isBcryptHash ? '✅ BCRYPT HASH' : '❌ PLAIN TEXT')
      console.log('Password preview:', user.password.substring(0, 30) + '...')
      
      if (!isBcryptHash) {
        console.log('⚠️  WARNING: This password is NOT hashed!')
        console.log('💡 Solution: This user will be auto-migrated on next login')
      }
    }
    
    console.log('\n-----------------------------------')
    console.log(`\n📊 Total users: ${users.length}`)
    console.log(`✅ Hashed: ${users.filter(u => /^\$2[ayb]\$/.test(u.password)).length}`)
    console.log(`❌ Plain text: ${users.filter(u => !/^\$2[ayb]\$/.test(u.password)).length}`)
    
    await mongoose.connection.close()
    console.log('\n✅ Done!')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkPasswords()
