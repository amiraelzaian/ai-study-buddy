"use client";

import { Trash, X } from "lucide-react";
import ConfirmDialog from "./DeletePopup";
import { useState } from "react";
import { deleteAllHistory } from "../_lib/actions";
import toast from "react-hot-toast";
type Header = {
  userId: string;
  onClose: () => void;
  length: number;
};

function SidebarHeader({ userId, onClose, length }: Header) {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleDelete() {
    try {
      setLoading(true);
      await deleteAllHistory(userId);
      toast.success("Conversations deleted successfully");
    } catch (err) {
      toast.error(`${err}`);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  }
  return (
    <>
      <div className="flex items-center justify-between px-4 py-4 border-b border-border flex-shrink-0">
        <h2 className="font-semibold text-base text-foreground">
          Recent Sessions
        </h2>
        {length > 0 && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className=" p-1 rounded-lg  hover:bg-muted transition-colors"
            aria-label="Close sidebar"
          >
            <Trash className="w-5 h-5 text-muted-foreground  hover:text-red-500" />
          </button>
        )}
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded-lg hover:bg-muted transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
      <ConfirmDialog
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete these sessions?"
        description="This will permanently delete these study sessions and all its messages."
        loading={loading}
      />
    </>
  );
}

export default SidebarHeader;
