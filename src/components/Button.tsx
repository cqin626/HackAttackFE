type ButtonType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

interface ButtonProps {
  text?: string;
  type?: ButtonType;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  outline?: boolean;
  className?: string;
  disabled?: boolean;
}

const Button = ({
  text = 'Button',
  type = 'primary',
  onClick,
  icon,
  size,
  outline = false,
  className = '',
  disabled = false
}: ButtonProps) => {
  const sizeClass = size ? `btn-${size}` : '';
  const typeClass = outline ? `btn-outline-${type}` : `btn-${type}`;
  
  return (
    <button 
      onClick={onClick}
      className={`btn ${typeClass} ${sizeClass} ${className}`}
      disabled={disabled}
    >
      {icon && <i className={`bi bi-${icon} ${text ? 'me-2' : ''}`}></i>}
      {text}
    </button>
  );
};

export default Button;