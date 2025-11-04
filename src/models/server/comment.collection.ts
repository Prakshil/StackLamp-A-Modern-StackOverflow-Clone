import { Permission } from "node-appwrite";
import { db, COMMENTS_COLLECTION } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
    // Creating Collection
    await databases.createCollection(db, COMMENTS_COLLECTION, COMMENTS_COLLECTION, [
        Permission.create("users"),
        Permission.read("any"),
        Permission.read("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ]);
    console.log("Comment Collection Created");

    // Creating Attributes
    await Promise.all([
        databases.createStringAttribute(db, COMMENTS_COLLECTION, "content", 10000, true),
        databases.createEnumAttribute(db, COMMENTS_COLLECTION, "type", ["answer", "question"], true),
        databases.createStringAttribute(db, COMMENTS_COLLECTION, "typeId", 50, true),
        databases.createStringAttribute(db, COMMENTS_COLLECTION, "authorId", 50, true),
    ]);
    console.log("Comment Attributes Created");
}