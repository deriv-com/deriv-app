import React from 'react';
import classNames from 'classnames';
import { LegacyVisibility1pxIcon, LegacyVisibilityOff1pxIcon } from '@deriv/quill-icons';
import { IconButton } from '../IconButton';
import './PasswordViewerIcon.scss';

interface PasswordViewerIconProps {
    isIconDisabled?: boolean;
    setViewPassword: React.Dispatch<React.SetStateAction<boolean>>;
    viewPassword: boolean;
}

const PasswordViewerIcon: React.FC<PasswordViewerIconProps> = ({ isIconDisabled, setViewPassword, viewPassword }) => (
    <IconButton
        className={classNames('wallets-password-viewer-icon', {
            'wallets-password-viewer-icon--disabled': isIconDisabled,
        })}
        color='transparent'
        icon={viewPassword ? <LegacyVisibility1pxIcon iconSize='xs' /> : <LegacyVisibilityOff1pxIcon iconSize='xs' />}
        isRound
        onClick={() => !isIconDisabled && setViewPassword(!viewPassword)}
        size='sm'
        type='button'
    />
);

export default PasswordViewerIcon;
