// app/components/AddSourceModal.js
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog.jsx";
import { UploadCloud, Link as LinkIcon, FileText, Youtube, X } from 'lucide-react';

export default function AddSourceModal({ isOpen, setIsOpen }) {
  
  // These are placeholder functions for now
  const handleFileUpload = () => alert("File Upload clicked");
  const handleWebsite = () => alert("Website clicked");
  const handleYoutube = () => alert("YouTube clicked");
  const handlePasteText = () => alert("Paste Text clicked");

  return (
    // This is a "controlled" dialog. Its open state is managed by the parent component.
    <Dialog open={isOpen} onOpenChange={setIsOpen} className="w-3/4">
      <DialogContent className="bg-[#28292d] w-full text-white border-gray-700 max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Add sources</DialogTitle>
          <button onClick={() => setIsOpen(false)} className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* File Upload Section */}
          <div
            onClick={handleFileUpload}
            className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
          >
            <UploadCloud className="h-12 w-12 text-blue-500 mb-4" />
            <p className="font-semibold">Upload sources</p>
            <p className="text-sm text-gray-400">Drag and drop or <span className="text-blue-400 font-medium">choose file</span> to upload</p>
            <p className="text-xs text-gray-500 mt-2">Supported file types: PDF, .txt, Markdown, Audio (e.g. mp3)</p>
          </div>

          {/* Other Sources Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Google Drive Card (Placeholder) */}
            <div className="p-4 w-full bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">Google Drive</h3>
              <div className="space-y-2">
                 <button className="w-full text-left p-2 bg-gray-700 rounded text-sm hover:bg-gray-600">Google Docs</button>
                 <button className="w-full text-left p-2 bg-gray-700 rounded text-sm hover:bg-gray-600">Google Slides</button>
              </div>
            </div>

            {/* Link Card */}
            <div className="p-4 w-full bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center"><LinkIcon className="h-4 w-4 mr-2"/>Link</h3>
              <div className="space-y-2">
                 <button onClick={handleWebsite} className="w-full text-left p-2 bg-gray-700 rounded text-sm hover:bg-gray-600 flex items-center"><LinkIcon className="h-4 w-4 mr-2"/>Website</button>
                 <button onClick={handleYoutube} className="w-full text-left p-2 bg-gray-700 rounded text-sm hover:bg-gray-600 flex items-center"><Youtube className="h-4 w-4 mr-2"/>YouTube</button>
              </div>
            </div>

            {/* Paste Text Card */}
            <div className="p-4 w-full bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center"><FileText className="h-4 w-4 mr-2"/>Paste text</h3>
              <div className="space-y-2">
                 <button onClick={handlePasteText} className="w-full text-left p-2 bg-gray-700 rounded text-sm hover:bg-gray-600 flex items-center"><FileText className="h-4 w-4 mr-2"/>Copied text</button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}