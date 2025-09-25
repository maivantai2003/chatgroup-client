import { useEffect } from "react";

const ContextMenu = ({ x, y, onClose, onCopy, onDelete }) => {
  useEffect(() => {
    const handleClick = () => onClose();
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [onClose]);

  return (
    <div
      className="absolute bg-white border rounded shadow-md z-50"
      style={{ top: y, left: x }}
    >
      <button className="block px-4 py-2 hover:bg-gray-100" onClick={onCopy}>
        📋 Sao chép
      </button>
      <button className="block px-4 py-2 hover:bg-gray-100" onClick={onDelete}>
        🗑️ Xóa
      </button>
    </div>
  );
};

export default ContextMenu;
