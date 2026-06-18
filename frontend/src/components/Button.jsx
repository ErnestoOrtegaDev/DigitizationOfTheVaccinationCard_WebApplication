import { Loader2 } from 'lucide-react';

export const Button = ({ 
    children, 
    onClick, 
    type = "button", 
    variant = "primary", 
    isLoading = false, 
    disabled = false,
    className = "" 
}) => {
    const variants = {
        primary: "bg-primary hover:bg-blue-800 text-white shadow-md hover:shadow-lg",
        secondary: "bg-secondary hover:bg-blue-600 text-white shadow-md",
        outline: "bg-white border-2 border-secondary text-secondary hover:bg-blue-50 shadow-sm"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`w-full py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                ${variants[variant]} 
                ${(disabled || isLoading) ? 'opacity-70 cursor-not-allowed' : ''} 
                ${className}`}
        >
            {isLoading && <Loader2 className="animate-spin" size={20} />}
            {children}
        </button>
    );
};