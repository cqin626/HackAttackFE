interface SpinnerProps {
  message?: string
}

const Spinner = ({message = 'Loading...'}: SpinnerProps) => {
  return (
    <div className="text-center my-5">
      <div className="spinner-border" role="status"></div>
      <div>{message}</div>
    </div>
  )
}

export default Spinner
