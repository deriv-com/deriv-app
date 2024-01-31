import React, { ComponentType, useEffect } from 'react';
import { debounce } from 'lodash';
import { Controller, useForm, useWatch } from 'react-hook-form';
import Modal from 'react-modal';
import { p2p } from '@deriv/api';
import { Button, Text } from '@deriv-com/ui';
import { useDevice } from '../../../hooks';
import { useSwitchTab } from '../../../hooks/useSwitchTab';
import P2PUserIcon from '../../../public/ic-cashier-p2p-user.svg';
import { Input } from '../../Input';
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
        formState: { errors },
        getValues,
        handleSubmit,
    } = useForm({
        defaultValues: {
            nickname: '',
        },
        mode: 'onChange',
    });

    const switchTab = useSwitchTab();
    const { error, isError, isSuccess, mutate, reset } = p2p.advertiser.useCreate();
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';
    const debouncedReset = debounce(reset, 3000);

    const onSubmit = () => {
        mutate({ name: getValues('nickname') });
    };

    const errorMessage = error?.error?.message || 'Can only contain letters, numbers, and special characters .-_@.';
    const hasError = errors?.nickname?.type === 'pattern' || isError;
    const watchNickname = useWatch({ control, defaultValue: '', name: 'nickname' });

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
                <P2PUserIcon />
                <Text className='p2p-v2-nickname-modal__form-title' weight='bold'>
                    Choose your nickname
                </Text>
                <Text align='center' className='p2p-v2-nickname-modal__form-text' size={textSize}>
                    This nickname will be visible to other Deriv P2P users.
                </Text>
                <Controller
                    control={control}
                    name='nickname'
                    render={({ field }) => (
                        <Input errorMessage={errorMessage} hasError={hasError} placeholder='Your nickname' {...field} />
                    )}
                    rules={{ pattern: /^[a-zA-Z0-9.@_-]*$/ }}
                />
                <Text className='p2p-v2-nickname-modal__form-text' size={textSize}>
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
                    <Button disabled={watchNickname === '' || hasError} size='lg' type='submit'>
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
