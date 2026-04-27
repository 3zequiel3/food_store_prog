import { useState } from "react";

export function useAdminCrudState<T>() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

  const openCreate = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: T) => {
    setEditing(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  return {
    isModalOpen,
    editing,
    deleteTarget,
    openCreate,
    openEdit,
    closeModal,
    setDeleteTarget,
  };
}
