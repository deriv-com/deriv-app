import React from 'react';
import { localize } from '@deriv/translations';

type CloseButtonProps = {
    className: string;
    onClick: () => void;
};

const CloseButton = ({ onClick, className }: CloseButtonProps) => (
    <button className={className} type='button' onClick={onClick} aria-label={localize('Close')} />
);

export default CloseButton;
