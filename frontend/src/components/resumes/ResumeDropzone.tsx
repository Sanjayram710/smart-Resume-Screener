import React, { useRef, useState } from 'react';
import { File, FileUp, UploadCloud, X } from 'lucide-react';

interface ResumeDropzoneProps {
  onUpload: (files: File[]) => Promise<void>;
  isUploading: boolean;
}

export const ResumeDropzone: React.FC<ResumeDropzoneProps> = ({ onUpload, isUploading }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesAdded = (files: FileList | null) => {
    if (!files) return;
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf' || ext === 'txt') {
        validFiles.push(file);
      }
    }
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFilesAdded(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async () => {
    if (selectedFiles.length === 0) return;
    await onUpload(selectedFiles);
    setSelectedFiles([]);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-500/10'
            : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt,application/pdf,text/plain"
          className="hidden"
          onChange={(e) => handleFilesAdded(e.target.files)}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">
              Drag & Drop PDF or TXT Resumes here
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports multi-file upload (up to 10MB per file)
            </p>
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700"
          >
            Browse Local Files
          </button>
        </div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="glass-card rounded-xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Selected Files ({selectedFiles.length})</span>
            <button
              type="button"
              onClick={() => setSelectedFiles([])}
              className="text-rose-400 hover:text-rose-300"
            >
              Clear All
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs"
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <File className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200 truncate">{file.name}</span>
                  <span className="text-slate-500 text-[10px]">
                    ({(file.size / 1024).toFixed(0)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="text-slate-500 hover:text-rose-400 ml-2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-800">
            <button
              type="button"
              disabled={isUploading}
              onClick={handleUploadSubmit}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              <FileUp className="w-4 h-4" />
              <span>{isUploading ? 'Uploading & Parsing...' : `Upload ${selectedFiles.length} Resumes`}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
