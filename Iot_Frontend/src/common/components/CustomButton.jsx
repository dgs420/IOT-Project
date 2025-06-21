import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";



export const CustomButton = ({ icon, color, title, onClick, className = "", disabled=false }) => {
    const colors = {
        primary: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500",
        success: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
        warning: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
        danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500"
    };

    return (
        <button
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${colors[color || "primary"]} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >

            {icon && <span className="mr-2">{icon}</span>}
            {title}
        </button>
    );
};  

CustomButton.defaultProps = {
  icon: null,
  color: 'primary',
  onClick: undefined,
  className: '',
  disabled: false,
};