'use client';

import { useRef, useState, useCallback } from 'react';
import { Upload, AlertTriangle } from 'lucide-react';
import { formatBytes } from '@/lib/storage-helpers';
import { uploadFile } from '@/lib/storage-helpers';
import { insertDocument, insertNotification } from '@/lib/db';
import type { StoredFile, FileCategory } from '@/lib/types';

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB (Supabase supports much larger)

function detectCategory(name: string): FileCategory {
  const lower = name.toLowerCase();
  if (lower.includes('statut')) return 'statuts';
  if (lower.includes('contrat')) return 'contrat';
  if (lower.includes('cin') || lower.includes('passeport') || lower.includes('identit')) return 'identite';
  if (lower.includes('fiscal') || lower.includes('impot') || lower.includes('nif') || lower.includes('admin')) return 'administratif';
  return 'autre';
}

interface FileUploadProps {
  userId: string;
  onUploadComplete: (file: StoredFile) => void;
}

export function FileUpload({ userId, onUploadComplete }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      setError('');

      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('Format non supporté. Utilisez PDF, JPG, PNG ou WebP.');
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        setError(`Fichier trop volumineux. Maximum ${formatBytes(MAX_FILE_BYTES)} par fichier.`);
        return;
      }

      setIsUploading(true);

      const uploadResult = await uploadFile(userId, file);
      if (!uploadResult) {
        setError('Erreur lors de l\'upload du fichier.');
        setIsUploading(false);
        return;
      }

      const storedFile: StoredFile = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        status: 'pending',
        category: detectCategory(file.name),
      };

      // Insert into database
      const dbResult = await insertDocument(userId, {
        ...storedFile,
        filePath: uploadResult.path,
      });

      if (dbResult) {
        // Insert notification
        await insertNotification(userId, 'Document reçu', `"${file.name}" est en cours de validation.`, 'info');
        onUploadComplete(storedFile);
      } else {
        setError('Erreur lors de l\'enregistrement du fichier.');
      }

      setIsUploading(false);
    },
    [userId, onUploadComplete],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={onInputChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        disabled={isUploading}
        className={`w-full border-2 border-dashed rounded-3xl p-8 flex flex-col items-center gap-3 transition-all cursor-pointer ${
          isDragging
            ? 'border-coral bg-coral/5 scale-[1.01]'
            : 'border-navy/20 bg-white hover:border-navy/40 hover:bg-navy/2'
        } ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {isUploading ? (
          <div className="w-8 h-8 rounded-full border-3 border-navy border-t-coral animate-spin" />
        ) : (
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDragging ? 'bg-coral/10' : 'bg-navy/5'}`}>
            <Upload className={`w-5 h-5 ${isDragging ? 'text-coral' : 'text-navy/40'}`} />
          </div>
        )}
        <div className="text-center">
          <p className="font-black text-navy text-sm">
            {isUploading ? 'Upload en cours…' : 'Déposer un fichier ou cliquer pour parcourir'}
          </p>
          <p className="text-navy/40 text-xs mt-1">
            PDF, JPG, PNG, WebP — max {formatBytes(MAX_FILE_BYTES)}
          </p>
        </div>
      </button>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-coral/10 border border-coral/20 rounded-2xl">
          <AlertTriangle className="w-4 h-4 text-coral shrink-0" />
          <p className="text-coral text-xs font-bold">{error}</p>
        </div>
      )}
    </div>
  );
}
