interface SpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Spinner = ({ message = 'Loading...', size = 'md' }: SpinnerProps) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : 
                   size === 'lg' ? 'spinner-border-lg' : '';
  
  return (
    <div className="spinner-container d-flex flex-column justify-content-center align-items-center py-5">
      <div className={`spinner-border ${sizeClass} text-primary mb-3`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="text-secondary">{message}</div>
    </div>
  );
};

export default Spinner;