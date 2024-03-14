import React, { ComponentType, useEffect } from 'react';
import { debounce } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import Modal from 'react-modal';
import { useDevice, useSwitchTab } from '@/hooks';
import { p2p } from '@deriv/api-v2';
import { DerivLightIcCashierUserIcon } from '@deriv/quill-icons';
import { Button, Input, Text } from '@deriv-com/ui';
import { customStyles } from '../helpers';
import './NicknameModal.scss';

type TNicknameModalProps = {
    isModalOpen: boolean | undefined;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean | undefined>>;
};

const NicknameModal = ({ isModalOpen, setIsModalOpen }: TNicknameModalProps) => {
    const ReactModal = Modal as ComponentType<ReactModal['props']>;
    const {
        control,
        formState: { isDirty, isValid },
        getValues,
        handleSubmit,
    } = useForm({
        defaultValues: {
            nickname: '',
        },
        mode: 'onChange',
    });

    const switchTab = useSwitchTab();
    const { error: createError, isError, isSuccess, mutate, reset } = p2p.advertiser.useCreate();
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';
    const debouncedReset = debounce(reset, 3000);

    const onSubmit = () => {
        mutate({ name: getValues('nickname') });
    };

    useEffect(() => {
        Modal.setAppElement('#v2_modal_root');
    }, []);

    useEffect(() => {
        if (isSuccess) {
            setIsModalOpen(false);
        } else if (isError) {
            debouncedReset();
        }
    }, [isError, isSuccess]);

    return (
        <ReactModal className='p2p-v2-nickname-modal' isOpen={!!isModalOpen} style={customStyles}>
            <form className='p2p-v2-nickname-modal__form' onSubmit={handleSubmit(onSubmit)}>
                <DerivLightIcCashierUserIcon height='12.8rem' width='12.8rem' />
                <Text className='p2p-v2-nickname-modal__form-title' weight='bold'>
                    Choose your nickname
                </Text>
                <Text align='center' className='mt-4 mb-6' size={textSize}>
                    This nickname will be visible to other Deriv P2P users.
                </Text>
                <Controller
                    control={control}
                    name='nickname'
                    render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                        <Input
                            data-testid='dt_p2p_v2_nickname_modal_input'
                            error={!!error?.message || isError}
                            label='Your nickname'
                            message={createError?.error?.message || error?.message}
                            onBlur={onBlur}
                            onChange={onChange}
                            value={value}
                        />
                    )}
                    rules={{
                        pattern: {
                            message: 'Can only contain letters, numbers, and special characters .-_@.',
                            value: /^[a-zA-Z0-9.@_-]*$/,
                        },
                        required: 'Nickname is required',
                    }}
                />
                <Text className='my-10' size={textSize}>
                    Your nickname cannot be changed later.
                </Text>
                <div className='p2p-v2-nickname-modal__form__button-group'>
                    <Button
                        className='p2p-v2-nickname-modal__form__button-group__cancel'
                        onClick={() => {
                            switchTab('buy-sell');
                            setIsModalOpen(false);
                        }}
                        size='lg'
                        type='button'
                        variant='outlined'
                    >
                        <Text size={textSize} weight='bold'>
                            Cancel
                        </Text>
                    </Button>
                    <Button disabled={!isValid || !isDirty || isError} size='lg' type='submit'>
                        <Text color='white' size={textSize} weight='bold'>
                            Confirm
                        </Text>
                    </Button>
                </div>
            </form>
        </ReactModal>
    );
};

export default NicknameModal;
