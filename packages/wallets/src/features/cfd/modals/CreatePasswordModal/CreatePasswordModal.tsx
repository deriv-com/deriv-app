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
    const { isMobile } = useDevice();
    if (isMobile) {
        return (
            <ModalStepWrapper
                renderFooter={() => {
                    return (
                        <Button
                            disabled={!password || isLoading}
                            isFullWidth
                            isLoading={isLoading}
                            onClick={onPrimaryClick}
                            size={isMobile ? 'lg' : 'md'}
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
    }

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
};

export default CreatePasswordModal;
