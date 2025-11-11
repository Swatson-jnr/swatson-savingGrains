/// <reference types="jest" />
import mongoose from 'mongoose'

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/saving-grains-test';

// Global test setup
beforeAll(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri)
    console.log('✓ Connected to test database')
  } catch (error) {
    console.error('✗ Failed to connect to test database:', error)
    process.exit(1)
  }
}, 30000)

// Global cleanup
afterAll(async () => {
  try {
    // Disconnect from MongoDB
    await mongoose.disconnect()
    console.log('✓ Disconnected from test database')
  } catch (error) {
    console.error('✗ Failed to disconnect from test database:', error)
  }
}, 30000)

// Clear database between tests
afterEach(async () => {
  try {
    const collections = mongoose.connection.collections
    for (const key in collections) {
      const collection = collections[key]
      await collection.deleteMany({})
    }
  } catch (error) {
    console.error('✗ Failed to clear test database:', error)
  }
})
