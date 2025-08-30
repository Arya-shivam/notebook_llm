// app/components/UploadPanel.js
"use client";
import { Upload, Link, Youtube, FileText } from 'lucide-react';

export default function UploadPanel() {
  return (
    <div className="flex flex-col bg-black space-y-4">
      <h2 className="text-xl font-semibold">Add a Source</h2>
      <button className="flex items-center p-3 border rounded-lg hover:bg-gray-100 transition-colors">
        <Upload className="mr-3 h-5 w-5" />
        Upload PDF/Doc
      </button>
      <button className="flex items-center p-3 border rounded-lg hover:bg-gray-100 transition-colors">
        <Link className="mr-3 h-5 w-5" />
        Add a Website
      </button>
      <button className="flex items-center p-3 border rounded-lg hover:bg-gray-100 transition-colors">
        <Youtube className="mr-3 h-5 w-5" />
        Add a YouTube Video
      </button>
      <button className="flex items-center p-3 border rounded-lg hover:bg-gray-100 transition-colors">
        <FileText className="mr-3 h-5 w-5" />
        Add Text
      </button>
    </div>
  );
}