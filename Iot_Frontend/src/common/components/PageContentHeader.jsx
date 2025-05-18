import React from "react";
import { Button } from "@mui/material";
import { Plus } from "lucide-react";

const PageContentHeader = ({ onClick, label, description, buttonLabel }) => {
  return (
    <div className="px-6 py-5 border-b rounded-lg border-gray-200 bg-white shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-gray-900"> {label}</h1>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus size={18} />}
          onClick={onClick}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};

export default PageContentHeader;
