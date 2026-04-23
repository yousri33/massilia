'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderPlus, Folder, FolderOpen, MoreVertical, Trash2, Edit2,
  Search, FileText, ImageIcon, ChevronRight, Home, Upload, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface FolderItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: FolderItem[];
  parentId?: string;
  color?: string;
}

const FOLDER_COLORS = [
  { bg: 'bg-blue-50',   icon: 'text-blue-500',   ring: 'hover:ring-blue-200' },
  { bg: 'bg-violet-50', icon: 'text-violet-500',  ring: 'hover:ring-violet-200' },
  { bg: 'bg-amber-50',  icon: 'text-amber-500',   ring: 'hover:ring-amber-200' },
  { bg: 'bg-emerald-50',icon: 'text-emerald-500', ring: 'hover:ring-emerald-200' },
  { bg: 'bg-rose-50',   icon: 'text-rose-500',    ring: 'hover:ring-rose-200' },
  { bg: 'bg-cyan-50',   icon: 'text-cyan-500',    ring: 'hover:ring-cyan-200' },
];

const DEFAULT_FOLDERS: FolderItem[] = [
  { id: '1', name: 'Statuts & Constitution', type: 'folder', children: [], color: '0' },
  { id: '2', name: 'Contrats & Accords',      type: 'folder', children: [], color: '1' },
  { id: '3', name: "Documents d'Identité",   type: 'folder', children: [], color: '2' },
  { id: '4', name: "Documents d'Entreprise",  type: 'folder', children: [], color: '3' },
];

interface FolderManagerProps {
  userId: string;
  files: any[];
  onUploadComplete: (file: any) => void;
  onDelete: (fileId: string) => void;
}

export function FolderManager({ userId }: FolderManagerProps) {
  const [folders, setFolders] = useState<FolderItem[]>(DEFAULT_FOLDERS);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameName, setRenameName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const currentFolder = currentFolderId ? findById(folders, currentFolderId) : null;
  const currentItems = currentFolder?.children ?? folders;
  const filtered = searchQuery
    ? currentItems.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : currentItems;

  function findById(items: FolderItem[], id: string): FolderItem | null {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  function mapTree(items: FolderItem[], fn: (item: FolderItem) => FolderItem): FolderItem[] {
    return items.map(item => ({
      ...fn(item),
      ...(item.children ? { children: mapTree(item.children, fn) } : {}),
    }));
  }

  function filterTree(items: FolderItem[], id: string): FolderItem[] {
    return items
      .filter(item => item.id !== id)
      .map(item => ({
        ...item,
        ...(item.children ? { children: filterTree(item.children, id) } : {}),
      }));
  }

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    const colorIdx = String(folders.length % FOLDER_COLORS.length);
    const newItem: FolderItem = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      type: 'folder',
      children: [],
      parentId: currentFolderId ?? undefined,
      color: colorIdx,
    };

    if (currentFolderId) {
      setFolders(mapTree(folders, item =>
        item.id === currentFolderId
          ? { ...item, children: [...(item.children ?? []), newItem] }
          : item
      ));
    } else {
      setFolders(prev => [...prev, newItem]);
    }

    setNewFolderName('');
    setIsCreateOpen(false);
  };

  const renameItem = () => {
    if (!renameName.trim() || !renameId) return;
    setFolders(mapTree(folders, item =>
      item.id === renameId ? { ...item, name: renameName.trim() } : item
    ));
    setRenameId(null);
    setRenameName('');
  };

  const deleteItem = (id: string) => {
    if (!window.confirm('Supprimer cet élément ?')) return;
    setFolders(filterTree(folders, id));
    if (currentFolderId === id) setCurrentFolderId(null);
  };

  const handleDrop = (e: any, targetId: string) => {
    e.preventDefault();
    setDragOverId(null);
    if (!draggedId || draggedId === targetId) return;
    const target = findById(folders, targetId);
    if (target?.type !== 'folder') return;

    const itemToMove = findById(folders, draggedId);
    if (!itemToMove) return;

    const withoutItem = filterTree(folders, draggedId);
    const moved = { ...itemToMove, parentId: targetId };

    setFolders(mapTree(withoutItem, item =>
      item.id === targetId
        ? { ...item, children: [...(item.children ?? []), moved] }
        : item
    ));
    setDraggedId(null);
  };

  const palette = (colorIdx?: string) => FOLDER_COLORS[Number(colorIdx) % FOLDER_COLORS.length] ?? FOLDER_COLORS[0];

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Rechercher dans vos documents…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-11 h-11 rounded-[16px] border-slate-200 bg-white/50 backdrop-blur-sm text-sm focus-visible:ring-navy/20 shadow-sm transition-all focus:bg-white"
          />
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-navy hover:bg-navy/90 text-white font-black rounded-[16px] gap-2 h-11 px-6 shadow-lg shadow-navy/10 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <FolderPlus className="w-4.5 h-4.5" />
          Nouveau dossier
        </Button>
      </div>

      {/* Breadcrumb */}
      {currentFolderId && (
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setCurrentFolderId(null)}
            className="flex items-center gap-1 text-slate-400 hover:text-navy transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Racine
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-navy font-black">{currentFolder?.name}</span>
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-50/50 rounded-[32px] border border-dashed border-slate-200">
          <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mx-auto mb-6">
            <Folder className="w-10 h-10 text-slate-200" />
          </div>
          <p className="font-black text-navy text-base">Ce dossier est vide</p>
          <p className="text-slate-400 text-sm mt-1 font-medium">Glissez vos documents ici ou utilisez le bouton "Nouveau dossier".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map((item, i) => {
              const p = palette(item.color);
              const isBeingDragged = draggedId === item.id;
              const isDropTarget = dragOverId === item.id;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.04 }}
                  draggable
                  onDragStart={(e: any) => { setDraggedId(item.id); e.dataTransfer.effectAllowed = 'move'; }}
                  onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
                  onDragOver={(e: any) => { e.preventDefault(); if (item.type === 'folder') setDragOverId(item.id); }}
                  onDragLeave={() => setDragOverId(null)}
                  onDrop={(e: any) => handleDrop(e, item.id)}
                  className={cn(
                    'group relative rounded-[24px] border border-slate-100 p-5 transition-all duration-300 cursor-pointer select-none',
                    'bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] hover:-translate-y-1',
                    isDropTarget && 'border-navy ring-4 ring-navy/5 shadow-lg',
                    isBeingDragged && 'opacity-40 scale-95',
                  )}
                >
                  {/* Three-dot menu */}
                  {renameId !== item.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-slate-50 transition-all text-slate-400 hover:text-navy"
                          onClick={e => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-[16px] shadow-2xl border-slate-100 p-1.5 bg-white z-50">
                        {item.type === 'folder' && (
                          <DropdownMenuItem
                            onClick={() => setCurrentFolderId(item.id)}
                            className="rounded-lg cursor-pointer text-sm font-bold p-2.5"
                          >
                            <FolderOpen className="w-4 h-4 mr-2.5 text-slate-400" />
                            Ouvrir le dossier
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => { setRenameId(item.id); setRenameName(item.name); }}
                          className="rounded-lg cursor-pointer text-sm font-bold p-2.5"
                        >
                          <Edit2 className="w-4 h-4 mr-2.5 text-slate-400" />
                          Renommer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1.5 bg-slate-50" />
                        <DropdownMenuItem
                          onClick={() => deleteItem(item.id)}
                          className="rounded-lg cursor-pointer text-sm font-black p-2.5 text-coral focus:text-white focus:bg-coral"
                        >
                          <Trash2 className="w-4 h-4 mr-2.5" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {/* Content */}
                  {renameId === item.id ? (
                    <div className="space-y-3 pt-2" onClick={e => e.stopPropagation()}>
                      <Input
                        autoFocus
                        value={renameName}
                        onChange={e => setRenameName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') renameItem();
                          if (e.key === 'Escape') setRenameId(null);
                        }}
                        className="h-9 rounded-xl border-slate-200 text-sm font-bold px-3 focus-visible:ring-navy/20"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={renameItem}
                          className="flex-1 h-9 rounded-xl bg-navy text-white text-[11px] font-black shadow-sm"
                        >
                          Valider
                        </button>
                        <button
                          onClick={() => setRenameId(null)}
                          className="flex-1 h-9 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-500 hover:bg-slate-50"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="w-full text-left"
                      onClick={() => item.type === 'folder' && setCurrentFolderId(item.id)}
                    >
                      {/* Icon Block */}
                      <div className={cn('w-14 h-14 rounded-[18px] flex items-center justify-center mb-4 relative overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-sm', p.bg)}>
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {item.type === 'folder'
                          ? <Folder className={cn('w-7 h-7 drop-shadow-sm', p.icon)} />
                          : item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                            ? <ImageIcon className="w-7 h-7 text-amber-500 drop-shadow-sm" />
                            : <FileText className="w-7 h-7 text-slate-400 drop-shadow-sm" />
                        }
                      </div>

                      {/* Name */}
                      <p className="font-black text-navy text-[15px] leading-tight line-clamp-2 group-hover:text-coral transition-colors duration-300">
                        {item.name}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={cn('w-1.5 h-1.5 rounded-full', p.icon.replace('text', 'bg'))} />
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                          {item.type === 'folder'
                            ? `${item.children?.length ?? 0} élément${(item.children?.length ?? 0) !== 1 ? 's' : ''}`
                            : 'Fichier'}
                        </p>
                      </div>
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* File drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDraggingFile(true); }}
        onDragLeave={() => setIsDraggingFile(false)}
        onDrop={e => { e.preventDefault(); setIsDraggingFile(false); }}
        className={cn(
          'relative rounded-[24px] border-2 border-dashed transition-all duration-300 py-10 text-center cursor-pointer overflow-hidden group',
          isDraggingFile
            ? 'border-navy bg-navy/5 scale-[1.01] shadow-xl'
            : 'border-slate-200 hover:border-navy/30 hover:bg-navy/[0.02] bg-white shadow-sm'
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-navy/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className={cn(
          'w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 relative z-10',
          isDraggingFile ? 'bg-navy text-white shadow-lg rotate-12 scale-110' : 'bg-slate-50 text-slate-400 group-hover:text-navy group-hover:bg-navy/10'
        )}>
          <Upload className="w-6 h-6" />
        </div>
        <div className="relative z-10">
          <p className={cn('font-black text-base transition-colors', isDraggingFile ? 'text-navy' : 'text-navy/80')}>
            {isDraggingFile ? 'Relâchez pour uploader' : 'Glisser-déposer des fichiers ici'}
          </p>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
            {isDraggingFile ? 'Action instantanée' : 'PDF, Word, Excel, Images — Max 50 MB'}
          </p>
        </div>
      </div>

      {/* Create Folder Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-navy">Nouveau dossier</DialogTitle>
            <DialogDescription className="text-sm">
              Donnez un nom au dossier{currentFolderId ? ` dans « ${currentFolder?.name} »` : ''}.
            </DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            placeholder="Ex: Contrats 2026"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createFolder()}
            className="rounded-xl border-slate-200 h-11 font-medium"
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="rounded-xl flex-1">
              Annuler
            </Button>
            <Button
              onClick={createFolder}
              disabled={!newFolderName.trim()}
              className="bg-navy hover:bg-navy/90 text-white font-black rounded-xl flex-1"
            >
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
