import React from 'react';
import classNames from 'classnames';
import PasswordHide from '../../../public/images/ic-password-hide.svg';
import PasswordShow from '../../../public/images/ic-password-show.svg';
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
        icon={viewPassword ? <PasswordShow /> : <PasswordHide />}
        isRound
        onClick={() => !isIconDisabled && setViewPassword(!viewPassword)}
        size='sm'
        type='button'
    />
);

export default PasswordViewerIcon;
