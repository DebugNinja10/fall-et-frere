import { Plus, Edit, Trash2, Search } from 'lucide-react';
import type { ReactNode } from 'react';

type AdminTableProps = {
  title: string;
  search?: string;
  onSearchChange?: (v: string) => void;
  onAdd?: () => void;
  addLabel?: string;
  columns: string[];
  children: ReactNode;
  emptyMessage?: string;
};

export function AdminTableShell({
  title,
  search,
  onSearchChange,
  onAdd,
  addLabel = 'Ajouter',
  columns,
  children,
  emptyMessage = 'Aucune donnée',
}: AdminTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {onAdd && (
          <button onClick={onAdd} className="btn-primary !py-2.5">
            <Plus className="w-5 h-5" /> {addLabel}
          </button>
        )}
      </div>

      {onSearchChange && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-600"
                  >
                    {col}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">{children}</tbody>
          </table>
        </div>
        {!children && (
          <div className="text-center py-12 text-gray-400">{emptyMessage}</div>
        )}
      </div>
    </div>
  );
}

type ActionButtonsProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export function ActionButtons({ onEdit, onDelete }: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={onEdit}
        className="p-2 rounded-lg text-brand-700 hover:bg-brand-50 transition-colors"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={onDelete}
        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

type ConfirmDeleteProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  message: string;
};

export function ConfirmDelete({ open, onCancel, onConfirm, message }: ConfirmDeleteProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmer la suppression</h3>
        <p className="text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1 !py-2.5">
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

type StatusBadgeProps = {
  status: string;
};

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  refused: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  completed: 'Terminé',
  cancelled: 'Annulé',
  refused: 'Refusé',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {statusLabels[status] ?? status}
    </span>
  );
}
