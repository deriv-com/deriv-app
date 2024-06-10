import React from 'react';
import { LabelPairedChevronDownSmRegularIcon } from '@deriv/quill-icons';
import './chip.scss';
import clsx from 'clsx';
import { Text } from '@deriv-com/quill-ui';
import { TRegularSizes } from '@deriv-com/quill-ui/dist/types';

type BaseChipProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'label'> & {
    label?: React.ReactNode;
    disabled?: boolean;
    isDropdownOpen?: boolean;
    dropdown?: boolean;
    selected?: boolean;
    size?: TRegularSizes;
    onClick?: () => void;
};

const Chip = React.forwardRef<HTMLButtonElement, BaseChipProps>(
    ({ size = 'md', label, dropdown = false, className, selected, isDropdownOpen = false, onClick, ...rest }, ref) => (
        <button
            onClick={onClick}
            className={clsx(
                'quill-chip',
                dropdown && 'quill-chip__custom-right-padding',
                selected && 'quill-chip--selected',
                className
            )}
            ref={ref}
            {...rest}
        >
            {label && <Text size={size}>{label}</Text>}
            {dropdown && (
                <LabelPairedChevronDownSmRegularIcon
                    className={clsx('rotate', `rotate--${isDropdownOpen ? 'open' : 'close'}`)}
                    data-testid='dt_chevron'
                />
            )}
        </button>
    )
);

Chip.displayName = 'Chip';
export default Chip;
