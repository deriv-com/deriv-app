import React, { HTMLProps } from 'react';
import { qtMerge } from '@deriv/quill-design';

type TCardProps = HTMLProps<HTMLDivElement> & {
    content?: React.ReactNode;
    footer?: React.ReactNode;
    header?: React.ReactNode;
};

export const Card = ({ className, content, footer, header, ...props }: TCardProps) => {
    return (
        <div
            className={qtMerge(
                'p-800 rounded-200 border border-solid-grey-5 flex flex-col justify-between h-auto m-800',
                className
            )}
            {...props}
        >
            {!!header && <div>{header}</div>}
            {!!content && <div>{content}</div>}
            {!!footer && <div>{footer}</div>}
        </div>
    );
};
