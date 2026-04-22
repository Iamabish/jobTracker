import { MongoClient } from "mongodb";

let client : MongoClient | null = null


export async function getMongoClient() {
    if(!client) {
        client = await new MongoClient(process.env.MONGO_URL!).connect()
    }

    return client
}