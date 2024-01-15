import React, { HTMLAttributes, ReactNode, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import FlyOutList from './FlyOutList';
import FlyOutToggle from './FlyOutToggle';
import './flyout.scss';

type TFlyOutProps = HTMLAttributes<HTMLDivElement> & {
    listItems?: ReactNode[];
    renderIcon?: () => React.ReactNode;
};

const FlyOut = ({ listItems, renderIcon, ...props }: TFlyOutProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const flyOutRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(flyOutRef, () => setIsOpen(false));
    return (
        <div ref={flyOutRef} {...props}>
            <FlyOutToggle onClick={() => setIsOpen(!isOpen)} renderIcon={renderIcon} />
            <FlyOutList isOpen={isOpen} listItems={listItems} />
        </div>
    );
};

export default FlyOut;
