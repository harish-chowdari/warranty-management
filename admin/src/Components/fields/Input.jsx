import React from 'react';

const Input = ({
    name, 
    formik,
    type = 'text',
    disabled = false,
    marginClass = 'mx-auto',
    tailwindClasses = 'p-[6px]',    
    placeholder = '',
    label = '',
    onChange,
    onBlur,
    inpuFormatter,
    isErrRequired = true,
    isInitialTouchRequired = true
}) => {
    const [isHovering, setIsHovering] = React.useState(false);
    const [isFocusing, setIsFocusing] = React.useState(false);

    return (
        <div className={`flex flex-col ${marginClass}`}>
            <label className='text-xs mb-1' htmlFor={name}>{label}</label>
            <input 
                className={`rounded-sm text-xs border focus:outline-none 
                ${(formik?.touched[`${name}`] && formik?.errors[`${name}`]) ? 'border-red-600' : 
                (isHovering || isFocusing)? 'border-blue-500' : 'border-gray-300'}
                ${tailwindClasses}`}
                type={type} 
                name={name} 
                id={name}
                value={formik?.values[`${name}`]} 
                onChange={e => {
                    const formattedValue = inpuFormatter ? inpuFormatter(e.target.value) : e.target.value;
                    e.target.value = formattedValue;

                    onChange && onChange(formattedValue);
                    formik?.handleChange(e);
                }} 
                placeholder={placeholder}
                onFocus={() => setIsFocusing(true)}
                onBlur={(e) => {
                    setIsFocusing(false);
                    onBlur && onBlur(e);
                    formik.handleBlur(e);
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            />
            { isErrRequired && 
                <div className={`flex items-center`}>
                    <p className='text-red-500 text-[10px] flex-1'>
                        {(formik?.touched[`${name}`] && formik?.errors[`${name}`])}&nbsp;</p>
                </div>
            } 
        </div>
    );
}

export default Input;
