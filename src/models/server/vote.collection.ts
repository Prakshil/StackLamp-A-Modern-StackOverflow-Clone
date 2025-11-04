import { Permission } from "node-appwrite";
import { db, VOTE_COLLECTION } from "../name";
import { databases } from "./config";

export default async function createVoteCollection() {
    // Creating Collection
    await databases.createCollection(db, VOTE_COLLECTION, VOTE_COLLECTION, [
        Permission.create("users"),
        Permission.read("any"),
        Permission.read("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ]);
    console.log("Vote Collection Created");

    // Creating Attributes
    await Promise.all([
        databases.createEnumAttribute(db, VOTE_COLLECTION, "type", ["question", "answer"], true),
        databases.createStringAttribute(db, VOTE_COLLECTION, "typeId", 50, true),
        databases.createEnumAttribute(
            db,
            VOTE_COLLECTION,
            "voteStatus",
            ["upvoted", "downvoted"],
            true
        ),
        databases.createStringAttribute(db, VOTE_COLLECTION, "votedById", 50, true),
    ]);
    console.log("Vote Attributes Created");
}