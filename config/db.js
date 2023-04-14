import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL)
    console.log('connected')
  } catch (error) {
    console.log(error)
  }
}

export default connectDB
