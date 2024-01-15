import React, { ReactNode } from 'react';
import {
    NewTooltipClassnames,
    NewTooltipClassnamesProps,
    NewTooltipContainerClassnames,
    NewTooltipContainerProps,
} from './NewTooltip.classnames';

type TNewTooltip = NewTooltipClassnamesProps &
    NewTooltipContainerProps & {
        children: ReactNode;
        content: ReactNode;
    };

const NewTooltip = ({ children, content, position }: TNewTooltip) => (
    <div className='relative cursor-pointer group'>
        <div className='m-200'>{children}</div>
        <span className={NewTooltipContainerClassnames({ position })}>{content}</span>
        <span className={NewTooltipClassnames({ position })} />
    </div>
);

export default NewTooltip;
