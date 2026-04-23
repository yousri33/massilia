'use client';

import { FileText, ImageIcon, Download, Trash2 } from 'lucide-react';
import { formatBytes } from '@/lib/storage-helpers';
import { getSignedUrl } from '@/lib/storage-helpers';
import { deleteDocument } from '@/lib/db';
import type { StoredFile, FileCategory, FileStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';

const CATEGORY_LABELS: Record<FileCategory, string> = {
  statuts: 'Statuts',
  contrat: 'Contrat',
  identite: 'Identité',
  fiscal: 'Fiscal',
  autre: 'Autre',
};

const CATEGORY_COLORS: Record<FileCategory, string> = {
  statuts: 'bg-blue-100 text-blue-700 border-blue-200',
  contrat: 'bg-purple-100 text-purple-700 border-purple-200',
  identite: 'bg-amber-100 text-amber-700 border-amber-200',
  fiscal: 'bg-green-100 text-green-700 border-green-200',
  autre: 'bg-navy/10 text-navy/60 border-navy/20',
};

const STATUS_LABELS: Record<FileStatus, string> = {
  pending: 'En attente',
  validated: 'Validé',
  rejected: 'Rejeté',
};

const STATUS_COLORS: Record<FileStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  validated: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-coral/10 text-coral border-coral/20',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-DZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

interface FileListProps {
  files: (StoredFile & { filePath?: string })[];
  userId: string;
  onDelete: (fileId: string) => void;
}

export function FileList({ files, userId, onDelete }: FileListProps) {
  const handleDownload = async (file: StoredFile & { filePath?: string }) => {
    if (!file.filePath) return;

    const signedUrl = await getSignedUrl(file.filePath);
    if (signedUrl) {
      const a = document.createElement('a');
      a.href = signedUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleDelete = async (file: StoredFile & { filePath?: string }) => {
    if (window.confirm(`Supprimer "${file.name}" ? Cette action est irréversible.`)) {
      const success = await deleteDocument(userId, file.id);
      if (success) {
        onDelete(file.id);
      }
    }
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-12 text-navy/30">
        <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="font-bold text-sm">Aucun document encore</p>
        <p className="text-xs mt-1">Déposez votre premier fichier ci-dessus.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-black text-navy/40 tracking-widest uppercase">
        {files.length} document{files.length > 1 ? 's' : ''}
      </p>
      {files.map((file) => {
        const isImage = file.type.startsWith('image/');
        const Icon = isImage ? ImageIcon : FileText;

        return (
          <div
            key={file.id}
            className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-navy/8 hover:border-navy/20 transition-colors group"
          >
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-navy/40" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-black text-navy text-sm truncate">{file.name}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-black ${CATEGORY_COLORS[file.category]}`}>
                  {CATEGORY_LABELS[file.category]}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-black ${STATUS_COLORS[file.status]}`}>
                  {STATUS_LABELS[file.status]}
                </span>
                <span className="text-navy/30 text-xs font-medium">
                  {formatBytes(file.size)} · {formatDate(file.uploadDate)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {file.filePath && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownload(file)}
                  className="h-8 w-8 rounded-xl text-navy/40 hover:text-navy hover:bg-navy/5"
                  title="Télécharger"
                >
                  <Download className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(file)}
                className="h-8 w-8 rounded-xl text-navy/40 hover:text-coral hover:bg-coral/5"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
