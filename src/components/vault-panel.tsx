// components/VaultPanel.tsx
"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Key, Copy, User, Pencil, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Assuming you added Textarea via shadcn-ui

// Mock Data (Type definition should be created in types/vault.ts)
interface VaultItem {
  _id: string; // From MongoDB
  title: string;
  username: string;
  password?: string; // Decrypted on demand or for editing
  url: string;
  notes: string;
}

const MOCK_VAULT_DATA: VaultItem[] = [
  { _id: '1', title: 'Google Mail', username: 'user@gmail.com', password: 'Decrypted-Mock-Password-1', url: 'https://mail.google.com', notes: 'Personal email account.' },
  { _id: '2', title: 'GitHub', username: 'dev-user', password: 'Decrypted-Mock-Password-2', url: 'https://github.com', notes: 'Code repository access.' },
  { _id: '3', title: 'AWS Console', username: 'iam-admin', password: 'Decrypted-Mock-Password-3', url: 'https://aws.amazon.com', notes: 'Do not share this key.' },
];

export default function VaultPanel() {
  const [items, setItems] = useState<VaultItem[]>(MOCK_VAULT_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // TODO: Implement Save/Update/Delete handlers (Client-side encryption here)
  const handleSave = (item: Omit<VaultItem, '_id'>, isNew: boolean) => {
    console.log(isNew ? 'Saving new item (will encrypt):' : 'Updating item (will re-encrypt):', item);
    
    // UI update (replace with actual backend fetch/update logic)
    if (isNew) {
        setItems(prev => [...prev, { ...item, _id: Date.now().toString() }]);
    } else if (editingItem) {
        setItems(prev => prev.map(i => i._id === editingItem._id ? { ...item, _id: editingItem._id } : i));
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (_id: string) => {
    // 1. Send delete request to backend API
    setItems(prev => prev.filter(i => i._id !== _id));
  };

  const openModal = (item: VaultItem | null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-primary">Your Secure Vault ({items.length} Entries)</CardTitle>
        <Button
          onClick={() => openModal(null)}
          className="flex items-center text-sm"
        >
          <Plus className="w-4 h-4 mr-1" /> Add New
        </Button>
      </CardHeader>
      <CardContent>
        {/* Search Input (Must-have) */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by Title or Username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
        </div>

        {/* Vault Items List */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No entries found.</p>
          ) : (
            filteredItems.map(item => (
              <VaultItemRow 
                  key={item._id} 
                  item={item} 
                  onEdit={() => openModal(item)} 
                  onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </CardContent>

      {/* Modal for Add/Edit */}
      <VaultItemModal
        open={isModalOpen}
        item={editingItem}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
      />
    </Card>
  );
}

// ------------------------------------
// Sub-Components
// ------------------------------------

// Vault Item Row Component
interface VaultItemRowProps {
  item: VaultItem;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

const VaultItemRow: React.FC<VaultItemRowProps> = ({ item, onEdit, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!item.password) return;
    navigator.clipboard.writeText(item.password);
    setCopied(true);
    
    // Auto-clear (Must-have)
    setTimeout(() => {
        navigator.clipboard.writeText(''); // Overwrite
        setCopied(false);
    }, 15000); // 15 seconds
  };

  return (
    <div className="flex items-center bg-accent/10 p-3 rounded-md hover:bg-accent/30 transition border border-border">
      <div className="flex-grow min-w-0">
        <p className="font-semibold truncate text-primary">{item.title}</p>
        <p className="text-sm text-muted-foreground truncate flex items-center">
          <User className="w-3 h-3 mr-1" /> {item.username}
        </p>
      </div>

      <div className="flex items-center space-x-2 ml-4">
        {/* Password Display */}
        <div className="relative flex items-center border rounded-md bg-background">
          <Input 
            type={showPassword ? 'text' : 'password'}
            value={item.password}
            readOnly
            className="w-32 h-8 py-0 px-2 text-sm font-mono truncate border-none focus-visible:ring-0"
          />
          <Button
            onClick={() => setShowPassword(!showPassword)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:bg-transparent"
          >
            <Key className="w-4 h-4" />
          </Button>
        </div>

        {/* Copy Button (Must-have) */}
        <Button
          onClick={handleCopy}
          title="Copy Password"
          size="icon"
          className={copied ? 'bg-green-500 hover:bg-green-600' : ''}
        >
          <Copy className="w-4 h-4" />
        </Button>
        
        {/* Action Buttons */}
        <Button
          onClick={onEdit}
          title="Edit Entry"
          variant="outline"
          size="icon"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => onDelete(item._id)}
          title="Delete Entry"
          variant="destructive"
          size="icon"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

// Modal Component for Edit/Add
interface VaultItemModalProps {
  open: boolean;
  item: VaultItem | null;
  onSave: (item: Omit<VaultItem, '_id'>, isNew: boolean) => void;
  onClose: () => void;
}

const VaultItemModal: React.FC<VaultItemModalProps> = ({ open, item, onSave, onClose }) => {
  const isNew = !item;
  const [data, setData] = useState<Omit<VaultItem, '_id'>>({
    title: item?.title || '',
    username: item?.username || '',
    password: item?.password || '',
    url: item?.url || '',
    notes: item?.notes || '',
  });

  React.useEffect(() => {
    if (item) {
        setData(item);
    } else {
        setData({ title: '', username: '', password: '', url: '', notes: '' });
    }
  }, [item]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(data, isNew);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className='text-primary'>{isNew ? 'Add New Vault Item' : `Edit: ${item?.title}`}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <FormInput label="Title" name="title" value={data.title} onChange={handleChange} required />
          <FormInput label="Username" name="username" value={data.username} onChange={handleChange} required />
          <FormInput label="Password" name="password" value={data.password} type="password" onChange={handleChange} required />
          <FormInput label="URL" name="url" value={data.url} onChange={handleChange} />
          
          <div className="grid gap-2">
             <Label htmlFor="notes">Notes</Label>
             <Textarea 
               id="notes"
               name="notes"
               value={data.notes}
               onChange={handleChange}
               rows={3}
             />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
            >
              {isNew ? 'Save Item (Encrypt)' : 'Update Item (Re-Encrypt)'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Reusable Form Input
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, ...props }) => (
    <div className="grid gap-2">
        <Label htmlFor={props.name}>{label}</Label>
        <Input
            id={props.name}
            {...props}
        />
    </div>
);