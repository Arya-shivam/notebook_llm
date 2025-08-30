// app/components/AddSourceModal.js
"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog.jsx";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { UploadCloud, Link as LinkIcon, FileText, Youtube, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function AddSourceModal({ isOpen, setIsOpen }) {
  const { addSource } = useAppContext();
  const [isUploading, setIsUploading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [showWebsiteInput, setShowWebsiteInput] = useState(false);
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      addSource({ id: Date.now(), name: file.name, type: 'file', checked: false });
      alert('File uploaded successfully!');
      setIsOpen(false);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleWebsiteSubmit = async () => {
    if (!websiteUrl.trim()) return;

    setIsUploading(true);
    try {
      const response = await fetch('/api/upload/website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: websiteUrl }),
      });

      if (!response.ok) throw new Error('Website indexing failed');

      const result = await response.json();
      addSource({ id: Date.now(), name: websiteUrl, type: 'website', checked: false });
      alert('Website indexed successfully!');
      setWebsiteUrl('');
      setShowWebsiteInput(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Website error:', error);
      alert('Website indexing failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleYoutubeSubmit = async () => {
    if (!youtubeUrl.trim()) return;

    setIsUploading(true);
    try {
      const response = await fetch('/api/upload/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: youtubeUrl }),
      });

      if (!response.ok) throw new Error('YouTube indexing failed');

      const result = await response.json();
      addSource({ id: Date.now(), name: youtubeUrl, type: 'youtube', checked: false });
      alert('YouTube video indexed successfully!');
      setYoutubeUrl('');
      setShowYoutubeInput(false);
      setIsOpen(false);
    } catch (error) {
      console.error('YouTube error:', error);
      alert('YouTube indexing failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textContent.trim()) return;

    setIsUploading(true);
    try {
      const response = await fetch('/api/upload/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textContent }),
      });

      if (!response.ok) throw new Error('Text indexing failed');

      const result = await response.json();
      addSource({ id: Date.now(), name: 'Text Content', type: 'text', checked: false });
      alert('Text indexed successfully!');
      setTextContent('');
      setShowTextInput(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Text error:', error);
      alert('Text indexing failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl w-[90vw]  backdrop-blur-lg max-h-[90vh] overflow-y-auto  border border-white/15">
        <DialogHeader className="space-y-3 pb-6 relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none text-white hover:text-gray-300"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <DialogTitle className="text-2xl font-semibold tracking-tight text-white">Add Sources</DialogTitle>
          <p className="text-sm text-gray-300">
            Upload files, index websites, or add text content to enhance your knowledge base
          </p>
        </DialogHeader>

        <div className="space-y-8">
          {/* File Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <UploadCloud className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-medium text-white">Upload Files</h3>
            </div>
            <div className="relative group">
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                accept=".pdf,.txt,.md,.csv"
              />
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/20 rounded-xl hover:border-indigo-400/50 transition-all duration-200 group-hover:bg-white/5">
                <UploadCloud className={`h-16 w-16 mb-4 transition-colors ${isUploading ? 'text-gray-400 animate-pulse' : 'text-indigo-400 group-hover:text-indigo-300'}`} />
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium text-white">
                    {isUploading ? 'Uploading...' : 'Drop files here or click to browse'}
                  </p>
                  <p className="text-sm text-gray-300">
                    Drag and drop or <span className="text-indigo-400 font-medium">choose files</span> to upload
                  </p>
                  <p className="text-xs text-gray-400">
                    Supports: PDF, TXT, Markdown, Audio (MP3)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Online Sources Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <LinkIcon className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-medium text-white">Online Sources</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Google Drive Card (Placeholder) */}
              <div className="p-6 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <h4 className="font-medium mb-4 text-white">Google Drive</h4>
                <div className="space-y-3">
                   <button className="w-full justify-start h-auto p-3 bg-white/10 hover:bg-white/20 rounded-md transition-colors text-sm text-gray-300" disabled>
                     <FileText className="h-4 w-4 mr-2 inline" />
                     Google Docs
                   </button>
                   <button className="w-full justify-start h-auto p-3 bg-white/10 hover:bg-white/20 rounded-md transition-colors text-sm text-gray-300" disabled>
                     <FileText className="h-4 w-4 mr-2 inline" />
                     Google Slides
                   </button>
                </div>
                <p className="text-xs text-gray-400 mt-3">Coming soon</p>
              </div>

              {/* Links Card */}
              <div className="p-6 border border-white/10 rounded-xl bg-white/5">
                <h4 className="font-medium mb-4 text-white">Web Content</h4>
                <div className="space-y-4">
                  {/* Website Section */}
                  <div className="space-y-3">
                    <Button
                      variant={showWebsiteInput ? "default" : "outline"}
                      onClick={() => setShowWebsiteInput(!showWebsiteInput)}
                      className="w-full justify-start h-auto p-3 bg-white/10 hover:bg-white/20 border-white/20"
                    >
                      <LinkIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">Website</span>
                    </Button>
                    {showWebsiteInput && (
                      <div className="space-y-3 pl-4 border-l-2 border-white/20">
                        <Input
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          placeholder="https://example.com"
                          disabled={isUploading}
                          className="text-sm bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        />
                        <Button
                          onClick={handleWebsiteSubmit}
                          disabled={isUploading || !websiteUrl.trim()}
                          size="sm"
                          className="w-full bg-indigo-500 hover:bg-indigo-600"
                        >
                          {isUploading ? 'Indexing...' : 'Index Website'}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* YouTube Section */}
                  <div className="space-y-3">
                    <Button
                      variant={showYoutubeInput ? "default" : "outline"}
                      onClick={() => setShowYoutubeInput(!showYoutubeInput)}
                      className="w-full justify-start h-auto p-3 bg-white/10 hover:bg-white/20 border-white/20"
                    >
                      <Youtube className="h-4 w-4 mr-2" />
                      <span className="text-sm">YouTube</span>
                    </Button>
                    {showYoutubeInput && (
                      <div className="space-y-3 pl-4 border-l-2 border-white/20">
                        <Input
                          value={youtubeUrl}
                          onChange={(e) => setYoutubeUrl(e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          disabled={isUploading}
                          className="text-sm bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        />
                        <Button
                          onClick={handleYoutubeSubmit}
                          disabled={isUploading || !youtubeUrl.trim()}
                          size="sm"
                          className="w-full bg-indigo-500 hover:bg-indigo-600"
                        >
                          {isUploading ? 'Indexing...' : 'Index Video'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-medium text-white">Text Content</h3>
            </div>

            <div className="p-6 border border-white/10 rounded-xl bg-white/5">
              <div className="space-y-4">
                <Button
                  variant={showTextInput ? "default" : "outline"}
                  onClick={() => setShowTextInput(!showTextInput)}
                  className="w-full justify-start h-auto p-3 bg-white/10 hover:bg-white/20 border-white/20"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <span className="text-sm">Paste Text</span>
                </Button>
                {showTextInput && (
                  <div className="space-y-3 pl-4 border-l-2 border-white/20">
                    <Textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Paste your text content here..."
                      disabled={isUploading}
                      rows={6}
                      className="text-sm resize-none bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                    <Button
                      onClick={handleTextSubmit}
                      disabled={isUploading || !textContent.trim()}
                      size="sm"
                      className="w-full bg-indigo-500 hover:bg-indigo-600"
                    >
                      {isUploading ? 'Indexing...' : 'Index Text'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}