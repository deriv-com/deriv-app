import React, { ComponentProps, FC } from 'react';
import { Localize } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';
import { ModalStepWrapper, ModalWrapper } from '../../../../components';
import { validPassword, validPasswordMT5 } from '../../../../utils/password-validation';
import { CFD_PLATFORMS, PlatformDetails } from '../../constants';
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
    const isMT5 = platform === CFD_PLATFORMS.MT5;
    const disableButton = isMT5 ? !validPasswordMT5(password) : !validPassword(password);

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
                        <Button
                            disabled={!password || isLoading || disableButton}
                            isFullWidth
                            isLoading={isLoading}
                            onClick={onPrimaryClick}
                            size='lg'
                            textSize={isDesktop ? 'md' : 'sm'}
                        >
                            <Localize
                                i18n_default_text='Create {{platformTitle}} password'
                                values={{ platformTitle: PlatformDetails[platform].title }}
                            />
                        </Button>
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
