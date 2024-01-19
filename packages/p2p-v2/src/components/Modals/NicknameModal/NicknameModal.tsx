import React, { ComponentType, useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import Modal from 'react-modal';
import { p2p } from '@deriv/api';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Text } from '@deriv-com/ui/dist/components/Text';
import { useDevice } from '../../../hooks';
import P2PUserIcon from '../../../public/ic-cashier-p2p-user.svg';
import { Input } from '../../Input';
import { customStyles } from '../helpers';
import './NicknameModal.scss';

const NicknameModal = () => {
    const ReactModal = Modal as ComponentType<ReactModal['props']>;
    const {
        control,
        formState: { errors },
        getValues,
        handleSubmit,
        register,
    } = useForm({
        defaultValues: {
            nickname: '',
        },
        mode: 'onChange',
    });

    const { error, isError, mutate, reset } = p2p.advertiser.useCreate();
    const { isMobile } = useDevice();

    const onSubmit = () => {
        mutate({ name: getValues('nickname') });
        setTimeout(() => {
            reset();
        }, 3000);
    };

    const errorMessage = error?.error?.message || 'Can only contain letters, numbers, and special characters .-_@.';
    const hasError = errors?.nickname?.type === 'pattern' || isError;
    const watchNickname = useWatch({ control, defaultValue: '', name: 'nickname' });

    useEffect(() => {
        Modal.setAppElement('#v2_modal_root');
    }, []);

    return (
        <ReactModal
            className='p2p-v2-nickname-modal'
            isOpen={true}
            onRequestClose={() => {
                // Implement return function here
            }}
            shouldCloseOnOverlayClick
            style={customStyles}
        >
            <FormProvider {...{ control, errors, register }}>
                <form className='p2p-v2-nickname-modal__form' onSubmit={handleSubmit(onSubmit)}>
                    <P2PUserIcon />
                    <Text className='p2p-v2-nickname-modal__form-title' weight='bold'>
                        Choose your nickname
                    </Text>
                    <Text align='center' className='p2p-v2-nickname-modal__form-text' size={isMobile ? 'md' : 'sm'}>
                        This nickname will be visible to other Deriv P2P users.
                    </Text>
                    <Input
                        errorMessage={errorMessage}
                        hasError={hasError}
                        name='nickname'
                        options={{ pattern: /^[a-zA-Z0-9.@_-]*$/ }}
                        placeholder='Your nickname'
                    />
                    <Text className='p2p-v2-nickname-modal__form-text' size={isMobile ? 'md' : 'sm'}>
                        Your nickname cannot be changed later.
                    </Text>
                    <div className='p2p-v2-nickname-modal__form__button-group'>
                        <Button
                            className='p2p-v2-nickname-modal__form__button-group__cancel'
                            size='lg'
                            variant='outlined'
                        >
                            Cancel
                        </Button>
                        <Button disabled={watchNickname === '' || hasError} size='lg'>
                            Confirm
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </ReactModal>
    );
};

export default NicknameModal;
