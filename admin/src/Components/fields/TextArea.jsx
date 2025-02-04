import React from 'react'

const TextArea = ({
    name, 
    formik,
    type='text',
    disabled=false,
    rows=3,
    marginClass='mx-auto',
    tailwindClasses='p-[6px]',    
    placeholder='',
    label='',
    onChange,
    onBlur,
    inpuFormatter,
    isErrRequired = true,
    isInitialTouchRequired 
}) => {

    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    return (
        <div className={`flex flex-col ${marginClass}`}>
        <label htmlFor={name}>{label}</label>
        <textarea 
            rows={rows}
            className={`rounded-sm text-sm border disabled:cursor-not-allowed disabled:bg-gray-150 
            ${((formik?.touched[`${name}`] && formik?.errors[`${name}`]))? 'border-red-600' : 
            `${(isHovered || isFocused)? 'border-blue-500' : 'border-gray-300'}`} 
            ${tailwindClasses}`}
            type={type} 
            name={name} 
            id={name}
            value={formik?.values[`${name}`]} 
            onChange={e => {
                const formattedValue = inpuFormatter? inpuFormatter(e.target.value) : e.target.value;
                e.target.value = formattedValue;

                onChange && onChange(formattedValue);
                if(isInitialTouchRequired) formik?.setFieldTouched(name, true);
                formik?.handleChange(e);
            }} 
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
                setIsFocused(false);
                onBlur && onBlur(e);
                formik.handleBlur(e);
            }}

            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            />
            { isErrRequired && 
                <div className={`flex items-center`}>
                    <p className='text-red-500 text-[10.5px] flex-1'>
                        {(formik?.touched[`${name}`] && formik?.errors[`${name}`])}&nbsp;</p>
                </div>
            }    
        </div>
  )
}


export default TextArea