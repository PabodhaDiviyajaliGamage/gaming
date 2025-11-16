// Script to migrate all plain-text passwords to bcrypt
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import readline from 'readline'

dotenv.config()

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function migratePasswords() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected!')
    
    console.log('\n📊 Checking users with plain-text passwords...\n')
    const users = await User.find({})
    
    const plainTextUsers = users.filter(u => !/^\$2[ayb]\$/.test(u.password))
    
    if (plainTextUsers.length === 0) {
      console.log('✅ All passwords are already hashed!')
      await mongoose.connection.close()
      rl.close()
      return
    }
    
    console.log(`Found ${plainTextUsers.length} users with plain-text passwords:`)
    plainTextUsers.forEach(u => console.log(`  - ${u.email}`))
    
    console.log('\n⚠️  WARNING: This will hash all plain-text passwords in your database.')
    console.log('⚠️  Users will NOT be able to login with their old passwords after this.')
    console.log('⚠️  Only run this if you want to RESET all plain-text passwords.\n')
    
    rl.question('Do you want to continue? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() !== 'yes') {
        console.log('❌ Migration cancelled.')
        await mongoose.connection.close()
        rl.close()
        return
      }
      
      console.log('\n🔄 Migrating passwords...\n')
      
      for (const user of plainTextUsers) {
        try {
          const plainPassword = user.password
          const salt = await bcrypt.genSalt(10)
          const hashedPassword = await bcrypt.hash(plainPassword, salt)
          
          await User.updateOne(
            { _id: user._id },
            { $set: { password: hashedPassword } }
          )
          
          console.log(`✅ Migrated: ${user.email}`)
          console.log(`   Old: ${plainPassword.substring(0, 20)}...`)
          console.log(`   New: ${hashedPassword.substring(0, 30)}...\n`)
        } catch (error) {
          console.error(`❌ Failed to migrate ${user.email}:`, error.message)
        }
      }
      
      console.log('✅ Migration complete!')
      await mongoose.connection.close()
      rl.close()
    })
  } catch (error) {
    console.error('❌ Error:', error)
    await mongoose.connection.close()
    rl.close()
  }
}

migratePasswords()
