import React, { HTMLAttributes, ReactNode, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import FlyOutList from './FlyoutList';
import FlyOutToggle from './FlyoutToggle';
import './Flyout.scss';

type TFlyoutProps = HTMLAttributes<HTMLDivElement> & {
    listItems?: ReactNode[];
    renderIcon?: () => React.ReactNode;
};

const Flyout = ({ listItems, renderIcon, ...props }: TFlyoutProps) => {
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

export default Flyout;
