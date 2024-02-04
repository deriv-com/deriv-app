import React, { HTMLProps, PropsWithChildren } from 'react';
import { qtMerge } from '@deriv/quill-design';

type TCardProps = HTMLProps<HTMLDivElement>;

export const Card = ({ children, className, ...props }: PropsWithChildren<TCardProps>) => {
    return (
        <div
            className={qtMerge(
                'p-800 rounded-200 border-solid-grey-5 flex flex-col justify-between h-auto m-800 border-75 border-solid w-full',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
