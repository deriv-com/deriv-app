import React, { useEffect } from 'react';
import { debounce } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { BUY_SELL_URL } from '@/constants';
import { p2p } from '@deriv/api-v2';
import { DerivLightIcCashierUserIcon } from '@deriv/quill-icons';
import { Button, Input, Modal, Text, useDevice } from '@deriv-com/ui';
import './NicknameModal.scss';

type TNicknameModalProps = {
    isModalOpen: boolean | undefined;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean | undefined>>;
};

const NicknameModal = ({ isModalOpen, setIsModalOpen }: TNicknameModalProps) => {
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

    const history = useHistory();
    const { error: createError, isError, isSuccess, mutate, reset } = p2p.advertiser.useCreate();
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';
    const debouncedReset = debounce(reset, 3000);

    const onSubmit = () => {
        mutate({ name: getValues('nickname') });
    };

    useEffect(() => {
        if (isSuccess) {
            setIsModalOpen(false);
        } else if (isError) {
            debouncedReset();
        }
    }, [isError, isSuccess]);

    return (
        <Modal className='p2p-v2-nickname-modal' isOpen={!!isModalOpen}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body className='p2p-v2-nickname-modal__body'>
                    <DerivLightIcCashierUserIcon height='12.8rem' width='12.8rem' />
                    <Text className='p2p-v2-nickname-modal__body-title' weight='bold'>
                        What’s your nickname?
                    </Text>
                    <Text align='center' className='mt-4 mb-6' size={textSize}>
                        Others will see this on your profile, ads and charts.
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
                </Modal.Body>
                <Modal.Footer className='p-0 min-h-0' hideBorder>
                    <Button
                        className='border-2 mr-[0.8rem]'
                        color='black'
                        onClick={() => {
                            history.push(BUY_SELL_URL);
                            setIsModalOpen(false);
                        }}
                        size='lg'
                        textSize={textSize}
                        type='button'
                        variant='outlined'
                    >
                        Cancel
                    </Button>
                    <Button disabled={!isValid || !isDirty || isError} size='lg' textSize={textSize} type='submit'>
                        Confirm
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default NicknameModal;
