import React, { ComponentProps, FC } from 'react';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { ModalStepWrapper, ModalWrapper, WalletButton } from '../../../../components';
import { PlatformDetails } from '../../constants';
import { CreatePassword } from '../../screens';
import '../EnterPasswordModal/EnterPasswordModal.scss';

const CreatePasswordModal: FC<ComponentProps<typeof CreatePassword>> = ({
    isLoading,
    onPasswordChange,
    onPrimaryClick,
    password,
    platform,
}) => {
    const { isDesktop } = useDevice();
    if (isDesktop) {
        return (
            <ModalWrapper>
                <div className='wallets-password-modal'>
                    <CreatePassword
                        isLoading={isLoading}
                        onPasswordChange={onPasswordChange}
                        onPrimaryClick={onPrimaryClick}
                        password={password}
                        platform={platform}
                    />
                </div>
            </ModalWrapper>
        );
    }

    return (
        <ModalStepWrapper
            renderFooter={() => {
                return (
                    <div className='wallets-password-modal__footer'>
                        <WalletButton
                            disabled={!password || isLoading}
                            isFullWidth
                            isLoading={isLoading}
                            onClick={onPrimaryClick}
                            size={isDesktop ? 'md' : 'lg'}
                        >
                            <Localize
                                i18n_default_text='Create {{platformTitle}} password'
                                values={{ platformTitle: PlatformDetails[platform].title }}
                            />
                        </WalletButton>
                    </div>
                );
            }}
            title={''}
        >
            <div className='wallets-password-modal__body'>
                <CreatePassword
                    isLoading={isLoading}
                    onPasswordChange={onPasswordChange}
                    onPrimaryClick={onPrimaryClick}
                    password={password}
                    platform={platform}
                />
            </div>
        </ModalStepWrapper>
    );
};

export default CreatePasswordModal;
