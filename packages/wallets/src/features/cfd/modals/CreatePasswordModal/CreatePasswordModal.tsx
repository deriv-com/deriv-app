import React, { ComponentProps, FC } from 'react';
import { Button } from '@deriv-com/ui';
import { ModalStepWrapper, ModalWrapper } from '../../../../components';
import useDevice from '../../../../hooks/useDevice';
import { PlatformDetails } from '../../constants';
import { CreatePassword } from '../../screens';

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
                <CreatePassword
                    isLoading={isLoading}
                    onPasswordChange={onPasswordChange}
                    onPrimaryClick={onPrimaryClick}
                    password={password}
                    platform={platform}
                />
            </ModalWrapper>
        );
    }

    return (
        <ModalStepWrapper
            renderFooter={() => {
                return (
                    <Button
                        disabled={!password || isLoading}
                        isFullWidth
                        isLoading={isLoading}
                        onClick={onPrimaryClick}
                        size='lg'
                    >
                        {`Create ${PlatformDetails[platform].title} password`}
                    </Button>
                );
            }}
            title={''}
        >
            <CreatePassword
                isLoading={isLoading}
                onPasswordChange={onPasswordChange}
                onPrimaryClick={onPrimaryClick}
                password={password}
                platform={platform}
            />
        </ModalStepWrapper>
    );
};

export default CreatePasswordModal;
