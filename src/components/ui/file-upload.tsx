"use client";

import React, { useState } from "react";
import { storage } from "@/models/client/config";
import { ID } from "appwrite";
import { IconUpload, IconX } from "@tabler/icons-react";
import toast from "react-hot-toast";

interface FileUploadProps {
  onUploadComplete: (fileId: string) => void;
  bucketId: string;
}

export default function FileUpload({ onUploadComplete, bucketId }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ id: string; name: string } | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading("Uploading file...");
    
    try {
      console.log("Uploading file to bucket:", bucketId);
      const response = await storage.createFile(bucketId, ID.unique(), file);
      console.log("File uploaded successfully:", response);
      
      const fileData = { id: response.$id, name: file.name };
      setUploadedFile(fileData);
      onUploadComplete(response.$id);
      
      toast.success("File uploaded successfully!", { id: toastId });
    } catch (err: any) {
      console.error("Error uploading file:", err);
      toast.error(err.message || "Failed to upload file. Please try again.", { id: toastId });
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    setUploadedFile(null);
    onUploadComplete("");
  }

  return (
    <div className="space-y-2">
      {!uploadedFile ? (
        <label className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
          <IconUpload className="w-4 h-4" />
          <span className="text-sm">{uploading ? "Uploading..." : "Attach a file"}</span>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      ) : (
        <div className="flex items-center gap-2 px-4 py-2 border rounded-md bg-gray-50">
          <span className="text-sm flex-1">{uploadedFile.name}</span>
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
