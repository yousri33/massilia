import { supabase } from './supabase';
import type { StoredFile, Recommendation } from './types';

// ─── Cases ───────────────────────────────────────────────────────────────────
export async function getCases(userId: string) {
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cases:', error);
    return [];
  }

  return data || [];
}

// ─── Documents ────────────────────────────────────────────────────────────────
export async function getDocuments(userId: string): Promise<StoredFile[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('uploaded_at', { ascending: false });

  if (error) {
    console.error('Error fetching documents:', error);
    return [];
  }

  return (data || []).map((doc: any) => ({
    id: doc.id,
    name: doc.name,
    type: doc.mime_type || 'application/octet-stream',
    size: doc.size_bytes || 0,
    uploadDate: doc.uploaded_at,
    status: doc.status as 'pending' | 'validated' | 'rejected',
    category: doc.category as any,
    filePath: doc.file_path,
  }));
}

export async function insertDocument(userId: string, doc: Omit<StoredFile, 'id'> & { filePath: string }) {
  const { data, error } = await supabase
    .from('documents')
    .insert({
      user_id: userId,
      name: doc.name,
      file_path: doc.filePath,
      mime_type: doc.type,
      size_bytes: doc.size,
      category: doc.category,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error inserting document:', error);
    return null;
  }

  return data;
}

export async function deleteDocument(userId: string, docId: string) {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', docId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting document:', error);
    return false;
  }

  return true;
}

// ─── Invoices ─────────────────────────────────────────────────────────────────
export async function getInvoices(userId: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }

  return data || [];
}

// ─── Notifications ────────────────────────────────────────────────────────────
export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('read', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return data || [];
}

export async function getAllNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all notifications:', error);
    return [];
  }

  return data || [];
}

export async function markNotificationRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }

  return true;
}

export async function insertNotification(userId: string, title: string, body: string, type: string = 'info') {
  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title,
      body,
      type,
    });

  if (error) {
    console.error('Error inserting notification:', error);
    return false;
  }

  return true;
}
