import React from 'react';
import { Plus } from 'lucide-react';

const VARIANT_CLASSES = {
    primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
};

export const CustomButton = ({
                                 onClick,
                                 children,
                                 icon: Icon,
                                 variant = 'primary',
                                 className = '',
                                 ...props
                             }) => {
    const variantClasses = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;

    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClasses} ${className}`}
            {...props}
        >
            {Icon && <Icon className="h-4 w-4 mr-2" />}
            {children}
        </button>
    );
};
