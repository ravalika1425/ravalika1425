import React from 'react';

const SwitchWithText = (props: any) => {
    const { value, setValue, title, value1, value2 } = props;

    const toggle = () => {
        setValue(!value);
    };

    return (
        <div>
            <div>
                <p className='text-sm text-gray py-2 ml-1'>{title}</p>
            </div>
            <div className='flex bg-[#eaecf0] rounded-full p-1'>
                <button
                    onClick={toggle}
                    className={`flex-1 p-2 rounded-full text-center ${value ? 'bg-white' : 'bg-transparent'} `}
                >
                    <span className={`${value ? 'text-primary' : 'text-gray'}`}>{value1}</span>
                </button>
                <button
                    onClick={toggle}
                    className={`flex-1 p-2 rounded-full text-center ${!value ? 'bg-white' : 'bg-transparent'} `}
                >
                    <span className={`${!value ? 'text-primary' : 'text-gray'}`}>{value2}</span>
                </button>
            </div>
        </div>
    );
};

export default SwitchWithText;
