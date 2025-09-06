"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link, Youtube, FileText } from "lucide-react";

export function UploadInterface() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    
    try {
      const response = await fetch("/api/upload/file", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage(`✅ ${result.message}`);
      } else {
        setMessage(`❌ Error: ${result.error || result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebsiteUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const url = formData.get("url") as string;

    try {
      const response = await fetch("/api/upload/website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage(`✅ ${result.message}`);
      } else {
        setMessage(`❌ Error: ${result.error || result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleYoutubeUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const url = formData.get("url") as string;

    try {
      const response = await fetch("/api/upload/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage(`✅ ${result.message}`);
      } else {
        setMessage(`❌ Error: ${result.error || result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const text = formData.get("text") as string;

    try {
      const response = await fetch("/api/upload/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage(`✅ ${result.message} (${result.chunksCreated} chunks created)`);
      } else {
        setMessage(`❌ Error: ${result.error || result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Content</CardTitle>
        <CardDescription>
          Upload files, websites, YouTube videos, or text to your knowledge base
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="file">
              <Upload className="w-4 h-4 mr-2" />
              File
            </TabsTrigger>
            <TabsTrigger value="website">
              <Link className="w-4 h-4 mr-2" />
              Website
            </TabsTrigger>
            <TabsTrigger value="youtube">
              <Youtube className="w-4 h-4 mr-2" />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="text">
              <FileText className="w-4 h-4 mr-2" />
              Text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4">
            <form onSubmit={handleFileUpload} className="space-y-4">
              <Input
                type="file"
                name="document"
                accept=".pdf"
                required
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Uploading..." : "Upload PDF"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="website" className="space-y-4">
            <form onSubmit={handleWebsiteUpload} className="space-y-4">
              <Input
                type="url"
                name="url"
                placeholder="https://example.com"
                required
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Indexing..." : "Index Website"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="youtube" className="space-y-4">
            <form onSubmit={handleYoutubeUpload} className="space-y-4">
              <Input
                type="url"
                name="url"
                placeholder="https://youtube.com/watch?v=..."
                required
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Indexing..." : "Index YouTube Video"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <form onSubmit={handleTextUpload} className="space-y-4">
              <Textarea
                name="text"
                placeholder="Enter your text content here..."
                required
                disabled={isLoading}
                rows={6}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Indexing..." : "Index Text"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {message && (
          <div className="mt-4 p-3 rounded-md bg-muted">
            <p className="text-sm">{message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
