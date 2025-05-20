type ButtonType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

interface ButtonProps {
  text?: string;
  type?: ButtonType;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({text = 'button', type = 'primary', onClick}: ButtonProps) => {
  
  return (
    <>
      <button 
      onClick={onClick}
      className={`btn btn-${type} m-2`}
      >
        {text}
      </button>
    </>
  )
}

export default Button
