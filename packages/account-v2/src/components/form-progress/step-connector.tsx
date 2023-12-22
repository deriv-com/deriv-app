import React from 'react';
import clsx from 'clsx';

// const mobileStyle = 'sm:h-100 sm:bg-[length:200%_100%] sm:bg-right sm:bg-gradient-to-r sm:aria-[current=true]:bg-left';
// const desktopStyle =
//     'lg:h-2000 lg:bg-[length:100%_200%] lg:bg-bottom lg:bg-gradient-to-b lg:aria-[current=true]:bg-top';

const StepConnector = ({ isActive }: { isActive: boolean }) => (
    <div
        aria-current={isActive}
        // className={clsx(
        //     mobileStyle,
        //     desktopStyle,
        //     'block from-50% from-brand-coral via-50% via-brand-coral to-50% to-system-light-less-prominent-text transition-all duration-700 ease-out'
        // )}
        className='h-2000 bg-solid-coral-700 w-400'
    >
        {/* {' '} */}
        Hello world
    </div>
);

export default StepConnector;
