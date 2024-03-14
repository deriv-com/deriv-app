import React, { HTMLAttributes, ReactNode, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import FlyoutMenuList from './FlyoutMenuList';
import FlyoutMenuToggle from './FlyoutMenuToggle';
import './FlyoutMenu.scss';

type TFlyoutMenuProps = HTMLAttributes<HTMLDivElement> & {
    listItems?: ReactNode[];
    renderIcon?: () => React.ReactNode;
};

const FlyoutMenu = ({ listItems, renderIcon, ...props }: TFlyoutMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const flyoutMenuRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(flyoutMenuRef, () => {
        setIsOpen(false);
    });
    return (
        <div ref={flyoutMenuRef} {...props}>
            <FlyoutMenuToggle
                onClick={() => {
                    setIsOpen(!isOpen);
                }}
                renderIcon={renderIcon}
            />
            <FlyoutMenuList isOpen={isOpen} listItems={listItems} />
        </div>
    );
};

export default FlyoutMenu;
