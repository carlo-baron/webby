import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { appMode } from './appMode.js';
dotenv.config();

export default async function connectDB() {
	if(mongoose.connection.readyState === 1){
		console.log("DB not connected");
		return;
	}
		
	const uri = appMode === 
		"production" ? 
			process.env.MONGO_URI!
				: 
			process.env.MONGO_URI_LOCAL!;

	await mongoose.connect(uri);
	console.log('DB Connection Successful');
}

