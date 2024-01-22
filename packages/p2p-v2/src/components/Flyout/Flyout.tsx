import React, { HTMLAttributes, ReactNode, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import FlyoutList from './FlyoutList';
import FlyoutToggle from './FlyoutToggle';
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
            <FlyoutToggle onClick={() => setIsOpen(!isOpen)} renderIcon={renderIcon} />
            <FlyoutList isOpen={isOpen} listItems={listItems} />
        </div>
    );
};

export default Flyout;
