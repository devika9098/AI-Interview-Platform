import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { uploadResume } from '../services/api';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const ResumePage = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a valid PDF file!');
      return;
    }

    setIsUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdfDocument = await loadingTask.promise;

      let fullText = '';
      for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(item => item.str).join(' ') + '\n';
      }

      const formData = new FormData();
      formData.append('resume', file);
      formData.append('extractedText', fullText);

      await uploadResume(formData);
      toast.success('Resume Analyzed Successfully! 🎯');
      
      setTimeout(() => {
        navigate('/interview', { state: { resumeText: fullText } }); 
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error('Failed to analyze resume.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">📄 Upload Your Resume</h2>
      <p className="text-slate-400 mb-8">Upload your PDF resume to get personalized AI interview questions based on your skills and experience.</p>
      
      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`w-full p-12 bg-slate-800 border-2 border-dashed border-slate-600 hover:border-blue-500 hover:bg-slate-700/50 rounded-2xl text-center cursor-pointer transition ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input type="file" accept="application/pdf" ref={fileInputRef} onChange={handleResumeUpload} disabled={isUploading} className="hidden" />
        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-blue-400 font-medium">Analyzing Resume...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <span className="text-5xl">📁</span>
            <p className="text-xl font-semibold text-white">Click to upload PDF</p>
            <p className="text-sm text-slate-400">or drag and drop your file here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePage;