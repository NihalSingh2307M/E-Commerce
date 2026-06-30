import mongoose from "mongoose";

const connectDb = async () => {

    mongoose.connection.on('connected', () => {
        console.log('db connected')
    })

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err.message)
    })

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "e-commerce",
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message)
    }

}

export default connectDb;