'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderPlus, Folder, FolderOpen, File, MoreVertical, Trash2, Edit2,
  Upload, ChevronRight, Plus, Search, FileText, ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface FolderStructure {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: FolderStructure[];
  parentId?: string;
  uploadDate?: string;
  size?: number;
}

interface FolderManagerProps {
  userId: string;
  files: any[];
  onUploadComplete: (file: any) => void;
  onDelete: (fileId: string) => void;
}

export function FolderManager({ userId, files, onUploadComplete, onDelete }: FolderManagerProps) {
  const [folders, setFolders] = useState<FolderStructure[]>([
    { id: '1', name: 'Statuts & Constitution', type: 'folder', children: [] },
    { id: '2', name: 'Contrats', type: 'folder', children: [] },
    { id: '3', name: 'Documents d\'Identité', type: 'folder', children: [] },
    { id: '4', name: 'Documents Fiscaux', type: 'folder', children: [] },
  ]);

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameName, setRenameName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const currentFolder = currentFolderId ? folders.find(f => f.id === currentFolderId) : null;
  const currentItems = currentFolder?.children || folders;
  const filteredItems = searchQuery
    ? currentItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : currentItems;

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: FolderStructure = {
      id: Date.now().toString(),
      name: newFolderName,
      type: 'folder',
      children: [],
      parentId: currentFolderId || undefined,
    };

    if (currentFolderId) {
      setFolders(folders.map(f => {
        if (f.id === currentFolderId && f.children) {
          return { ...f, children: [...f.children, newFolder] };
        }
        return f;
      }));
    } else {
      setFolders([...folders, newFolder]);
    }

    setNewFolderName('');
    setIsCreateDialogOpen(false);
  };

  const renameItem = (id: string) => {
    if (!renameName.trim()) return;

    const rename = (items: FolderStructure[]): FolderStructure[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, name: renameName };
        }
        if (item.children) {
          return { ...item, children: rename(item.children) };
        }
        return item;
      });
    };

    setFolders(rename(folders));
    setRenameId(null);
    setRenameName('');
  };

  const deleteItem = (id: string) => {
    const deleteRecursive = (items: FolderStructure[]): FolderStructure[] => {
      return items.filter(item => item.id !== id);
    };

    setFolders(folders.map(f => {
      if (f.children) {
        return { ...f, children: deleteRecursive(f.children) };
      }
      return f;
    }).filter(f => f.id !== id));

    if (currentFolderId === id) {
      setCurrentFolderId(null);
    }
  };

  const handleDragStart = (e: any, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: any, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const targetItem = findItemById(folders, targetId);
    if (targetItem?.type !== 'folder') return;

    // Move item logic
    const moveItem = (items: FolderStructure[], itemId: string): FolderStructure[] => {
      const itemToMove = findItemById(items, itemId);
      if (!itemToMove) return items;

      const filtered = items.filter(i => i.id !== itemId);
      const updated = filtered.map(f => {
        if (f.id === targetId && f.children) {
          return { ...f, children: [...f.children, { ...itemToMove, parentId: targetId }] };
        }
        if (f.children) {
          return { ...f, children: moveItem(f.children, itemId) };
        }
        return f;
      });
      return updated;
    };

    setFolders(moveItem(folders, draggedItem));
    setDraggedItem(null);
  };

  const findItemById = (items: FolderStructure[], id: string): FolderStructure | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/30" />
          <Input
            placeholder="Rechercher des dossiers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-slate-200 h-10"
          />
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-navy hover:bg-navy/90 text-white font-black rounded-xl gap-2 h-10"
        >
          <FolderPlus className="w-4 h-4" />
          Nouveau dossier
        </Button>
      </div>

      {/* Breadcrumb */}
      {currentFolderId && (
        <div className="flex items-center gap-2 text-sm font-medium">
          <button
            onClick={() => setCurrentFolderId(null)}
            className="text-navy hover:text-navy/80 font-bold"
          >
            Racine
          </button>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="text-slate-600">{currentFolder?.name}</span>
        </div>
      )}

      {/* Folder/File Grid */}
      <div>
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="w-12 h-12 text-navy/20 mx-auto mb-3" />
            <p className="font-bold text-navy/40">Aucun dossier ou document</p>
            <p className="text-xs text-slate-400 mt-1">Créez un dossier pour commencer.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <AnimatePresence>
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.04 }}
                  draggable={item.type === 'folder'}
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item.id)}
                  className={cn(
                    'group relative rounded-2xl border-2 p-4 transition-all cursor-pointer',
                    'border-slate-100 hover:border-navy/20 hover:shadow-md',
                    item.type === 'folder' && draggedItem === item.id && 'border-navy/50 bg-navy/5',
                    renameId === item.id && 'ring-2 ring-navy/50'
                  )}
                >
                  {renameId === item.id ? (
                    <div className="space-y-2">
                      <Input
                        autoFocus
                        value={renameName}
                        onChange={(e) => setRenameName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') renameItem(item.id);
                          if (e.key === 'Escape') setRenameId(null);
                        }}
                        className="h-8 rounded-lg border-slate-200 text-sm font-bold"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => renameItem(item.id)}
                          className="flex-1 h-7 rounded-lg bg-navy text-white text-xs font-black"
                        >
                          Valider
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRenameId(null)}
                          className="flex-1 h-7 rounded-lg"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <div className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center',
                          item.type === 'folder'
                            ? expandedFolders.has(item.id)
                              ? 'bg-navy/10'
                              : 'bg-blue-50'
                            : 'bg-slate-100'
                        )}>
                          {item.type === 'folder' ? (
                            expandedFolders.has(item.id) ? (
                              <FolderOpen className="w-6 h-6 text-navy" />
                            ) : (
                              <Folder className="w-6 h-6 text-blue-600" />
                            )
                          ) : item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <ImageIcon className="w-6 h-6 text-amber-600" />
                          ) : (
                            <FileText className="w-6 h-6 text-slate-400" />
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="w-3.5 h-3.5 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            {item.type === 'folder' && (
                              <DropdownMenuItem
                                onClick={() => setCurrentFolderId(item.id)}
                                className="cursor-pointer text-sm"
                              >
                                <FolderOpen className="w-3 h-3 mr-2" />
                                Ouvrir
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => {
                                setRenameId(item.id);
                                setRenameName(item.name);
                              }}
                              className="cursor-pointer text-sm"
                            >
                              <Edit2 className="w-3 h-3 mr-2" />
                              Renommer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                if (window.confirm(`Supprimer "${item.name}" ?`)) {
                                  deleteItem(item.id);
                                }
                              }}
                              className="cursor-pointer text-sm text-red-600"
                            >
                              <Trash2 className="w-3 h-3 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <button
                        onClick={() => item.type === 'folder' && setCurrentFolderId(item.id)}
                        className="w-full text-left"
                      >
                        <h3 className="font-bold text-navy text-sm truncate group-hover:text-navy/80 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">
                          {item.type === 'folder' ? `${item.children?.length || 0} éléments` : 'Fichier'}
                        </p>
                      </button>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create Folder Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-navy">Créer un nouveau dossier</DialogTitle>
            <DialogDescription>
              Donnez un nom à votre dossier pour l'organiser.
            </DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            placeholder="Nom du dossier"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') createFolder();
            }}
            className="rounded-xl border-slate-200 h-11 font-medium"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              className="rounded-xl"
            >
              Annuler
            </Button>
            <Button
              onClick={createFolder}
              className="bg-navy hover:bg-navy/90 text-white font-black rounded-xl"
            >
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
