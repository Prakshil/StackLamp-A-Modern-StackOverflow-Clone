import { IndexType, Permission } from "node-appwrite";

import { db, QUESTION_COLLECTION } from "../name";
import {databases} from "./config"


export default async function createQuestionCollection(){
  // create collection
  await databases.createCollection(db, QUESTION_COLLECTION, QUESTION_COLLECTION, [
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ])
  console.log("Question collection is created")

  //creating attributes and Indexes

  await Promise.all([
    databases.createStringAttribute(db, QUESTION_COLLECTION, "title", 100, true),
    databases.createStringAttribute(db, QUESTION_COLLECTION, "content", 10000, true),
    databases.createStringAttribute(db, QUESTION_COLLECTION, "authorId", 50, true),
    databases.createStringAttribute(db, QUESTION_COLLECTION, "tags", 50, true, undefined, true),
    databases.createStringAttribute(db, QUESTION_COLLECTION, "attachmentId", 50, false),
  ]);
  console.log("Question Attributes created")

  // create Indexes


  // await Promise.all([
  //   databases.createIndex(
  //     db,
  //     QUESTION_COLLECTION,
  //     "title",
  //     IndexType.Fulltext,
  //     ["title"],
  //     ['asc']
  //   ),
  //   databases.createIndex(
  //     db,
  //     QUESTION_COLLECTION,
  //     "content",
  //     IndexType.Fulltext,
  //     ["content"],
  //     ['asc']
  //   )
  // ])

}