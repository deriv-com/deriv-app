import { qtMerge } from '@deriv/quill-design';
import React from 'react';
// import clsx from 'clsx';

// const mobileStyle = 'sm:h-100 sm:bg-[length:200%_100%] sm:bg-right sm:bg-gradient-to-r sm:aria-[current=true]:bg-left';
// const desktopStyle =
//     'lg:h-2000 lg:bg-[length:100%_200%] lg:bg-bottom lg:bg-gradient-to-b lg:aria-[current=true]:bg-top';

const StepConnector = ({ isActive, className }: { isActive?: boolean; className?: string }) => (
    <div
        aria-current={isActive}
        // className={clsx(
        //     mobileStyle,
        //     desktopStyle,
        //     'block from-50% from-brand-coral via-50% via-brand-coral to-50% to-system-light-less-prominent-text transition-all duration-700 ease-out'
        // )}
        className={qtMerge(
            'h-2000 w-100 bg-solid-grey-1 transition-colors duration-700 ease-linear aria-[current=true]:bg-solid-coral-700',
            className
        )}
    >
        {' '}
    </div>
);

export default StepConnector;
