import React from "react";
import { Plus } from "lucide-react";
import { CustomButton } from "./CustomButton.jsx";

const PageContentHeader = ({
  onClick = undefined,
  label,
  description,
  buttonLabel = undefined,
  className = "",
}) => {
  return (
    <div
      className={`px-6 py-5 border-b rounded-lg border-gray-200 bg-white shadow ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-gray-900"> {label}</h1>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        {buttonLabel && onClick && (
          <CustomButton onClick={onClick}>
            <Plus className="h-4 w-4 mr-2" />
            {buttonLabel}
          </CustomButton>
        )}
      </div>
    </div>
  );
};

export default PageContentHeader;
