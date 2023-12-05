import React from 'react';
import PasswordHide from '../../../public/images/ic-password-hide.svg';
import PasswordShow from '../../../public/images/ic-password-show.svg';
import { IconButton } from '../IconButton';

interface PasswordViewerIconProps {
    setViewPassword: React.Dispatch<React.SetStateAction<boolean>>;
    viewPassword: boolean;
}

const PasswordViewerIcon: React.FC<PasswordViewerIconProps> = ({ setViewPassword, viewPassword }) => (
    <IconButton
        color='transparent'
        icon={viewPassword ? <PasswordShow /> : <PasswordHide />}
        isRound
        onClick={() => setViewPassword(!viewPassword)}
        size='sm'
        type='button'
    />
);

export default PasswordViewerIcon;
