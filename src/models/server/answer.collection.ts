import { IndexType, Permission } from "node-appwrite";
import { db, ANSWERS_COLLECTION } from "../name";
import { databases } from "./config";

export default async function createAnswerCollection() {
    // Creating Collection
    await databases.createCollection(db, ANSWERS_COLLECTION, ANSWERS_COLLECTION, [
        Permission.create("users"),
        Permission.read("any"),
        Permission.read("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ]);
    console.log("Answer Collection Created");

    // Creating Attributes
    await Promise.all([
        databases.createStringAttribute(db, ANSWERS_COLLECTION, "content", 10000, true),
        databases.createStringAttribute(db, ANSWERS_COLLECTION, "questionId", 50, true),
        databases.createStringAttribute(db, ANSWERS_COLLECTION, "authorId", 50, true),
    ]);
    console.log("Answer Attributes Created");
}