import React from 'react'

const Button = ({
    label = 'Submit',
    type = '',
    disabled = false,
    onClick,
  }) => {
  return (
      <div>
          <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {label}
          </button>
      </div>
  )
}

export default Button