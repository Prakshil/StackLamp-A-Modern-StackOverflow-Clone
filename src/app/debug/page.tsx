"use client";

import { useState } from "react";
import { databases, account } from "@/models/client/config";
import { db, QUESTION_COLLECTION } from "@/models/name";
import { ID } from "appwrite";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/ui/header";

export default function DebugPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function testConnection() {
    setLoading(true);
    const logs: any[] = [];

    try {
      // Test 1: Check user session
      logs.push({ test: "User Session", status: "checking..." });
      try {
        const user = await account.get();
        logs.push({ test: "User Session", status: "✓ Success", data: { id: user.$id, name: user.name, email: user.email } });
      } catch (err: any) {
        logs.push({ test: "User Session", status: "✗ Failed", error: err.message });
      }

      // Test 2: List documents to check database/collection
      logs.push({ test: "Database & Collection Access", status: "checking..." });
      try {
        const questions = await databases.listDocuments(db, QUESTION_COLLECTION);
        logs.push({ test: "Database & Collection Access", status: "✓ Success", data: { total: questions.total } });
      } catch (err: any) {
        logs.push({ test: "Database & Collection Access", status: "✗ Failed", error: err.message });
      }

      // Test 3: Create a test document
      logs.push({ test: "Create Question", status: "checking..." });
      try {
        const user = await account.get();
        const testQuestion = {
          title: "Test Question",
          content: "This is a test question to verify permissions",
          authorId: user.$id,
          tags: ["test"]
        };
        const created = await databases.createDocument(db, QUESTION_COLLECTION, ID.unique(), testQuestion);
        logs.push({ test: "Create Question", status: "✓ Success", data: { id: created.$id } });
        
        // Clean up - delete test question
        await databases.deleteDocument(db, QUESTION_COLLECTION, created.$id);
        logs.push({ test: "Delete Test Question", status: "✓ Cleaned up" });
      } catch (err: any) {
        logs.push({ test: "Create Question", status: "✗ Failed", error: err.message, code: err.code, type: err.type });
      }

      setResults(logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Debug Appwrite Connection</h1>
        
        <Card className="mb-6">
          <Button onClick={testConnection} disabled={loading} variant="primary">
            {loading ? "Testing..." : "Run Tests"}
          </Button>
        </Card>

        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, idx) => (
              <Card key={idx}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{result.test}</h3>
                    <p className={`text-sm mt-1 ${result.status.includes('✓') ? 'text-green-600' : result.status.includes('✗') ? 'text-red-600' : 'text-yellow-600'}`}>
                      {result.status}
                    </p>
                    {result.error && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-sm">
                        <p className="font-semibold text-red-800">Error:</p>
                        <p className="text-red-700">{result.error}</p>
                        {result.code && <p className="text-red-600 text-xs mt-1">Code: {result.code}</p>}
                        {result.type && <p className="text-red-600 text-xs">Type: {result.type}</p>}
                      </div>
                    )}
                    {result.data && (
                      <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
