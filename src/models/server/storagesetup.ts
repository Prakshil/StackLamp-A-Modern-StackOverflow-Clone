import { Permission } from "node-appwrite";
import { QUESTION_ATTACHMENT_COLLECTION } from "../name";
import { storage } from "./config";

export default async function getOrCreateStorage() {
    try {
        await storage.getBucket(QUESTION_ATTACHMENT_COLLECTION);
        console.log("Storage Connected");
    } catch (error) {
        try {
            await storage.createBucket(
                QUESTION_ATTACHMENT_COLLECTION,
                QUESTION_ATTACHMENT_COLLECTION,
                [
                    Permission.create("users"),
                    Permission.read("any"),
                    Permission.read("users"),
                    Permission.update("users"),
                    Permission.delete("users"),
                ],
                false,
                undefined,
                undefined,
                ["jpg", "png", "gif", "jpeg", "webp", "heic"]
            );

            console.log("Storage Created");
            console.log("Storage Connected");
        } catch (error) {
            console.error("Error creating storage:", error);
        }
    }
}