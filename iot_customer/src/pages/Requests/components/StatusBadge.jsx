// Status Badge Component
import {Clock, CheckCircle, XCircle} from 'lucide-react';

export const StatusBadge = ({ status }) => {
    let bgColor, textColor, icon;

    switch (status) {
        case 'approved':
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            icon = <CheckCircle className="h-3 w-3 mr-1" />;
            break;
        case 'rejected':
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            icon = <XCircle className="h-3 w-3 mr-1" />;
            break;
        case 'completed':
            bgColor = 'bg-blue-100';
            textColor = 'text-blue-800';
            icon = <CheckCircle className="h-3 w-3 mr-1" />;
            break;
        case 'pending':
        default:
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            icon = <Clock className="h-3 w-3 mr-1" />;
            break;
    }

    return (
        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
            {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
    );
};