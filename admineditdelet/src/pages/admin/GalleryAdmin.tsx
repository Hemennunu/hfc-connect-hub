// src/pages/admin/GalleryAdmin.tsx
import { useState } from "react";
import GalleryManagement from "../../components/GalleryManagement";
import GalleryList from "../../components/GalleryList";

const GalleryAdmin = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGalleryAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-12">
      {/* Add New Gallery Item Section */}
      <div className="bg-card p-8 rounded-lg shadow-medium border">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Add New Gallery Item</h1>
        <GalleryManagement onGalleryAdded={handleGalleryAdded} />
      </div>

      {/* Manage Existing Gallery Items Section */}
      <div className="bg-card p-8 rounded-lg shadow-medium border">
        <GalleryList refresh={refreshKey} />
      </div>
    </div>
  );
};

export default GalleryAdmin;
