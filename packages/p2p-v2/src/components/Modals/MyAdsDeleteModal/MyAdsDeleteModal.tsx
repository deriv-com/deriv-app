import React, { memo, useEffect } from 'react';
import clsx from 'clsx';
import Modal from 'react-modal';
import { useDevice } from '@/hooks';
import { p2p } from '@deriv/api';
import { Button, Text } from '@deriv-com/ui';
import { customStyles } from '../helpers';

type TMyAdsDeleteModalProps = {
    error?: string;
    id: string;
    isModalOpen: boolean;
    onClickDelete: () => void;
    onRequestClose: () => void;
};

const MyAdsDeleteModal = ({ error, id, isModalOpen, onClickDelete, onRequestClose }: TMyAdsDeleteModalProps) => {
    const { data: advertInfo, isLoading: isLoadingInfo } = p2p.advert.useGet({ id });
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';

    const hasActiveOrders = advertInfo?.active_orders && advertInfo?.active_orders > 0;

    useEffect(() => {
        Modal.setAppElement('#v2_modal_root');
    }, []);

    const getModalText = () => {
        if (hasActiveOrders && !error) {
            return 'You have open orders for this ad. Complete all open orders before deleting this ad.';
        } else if (error) {
            return error;
        }
        return 'You will NOT be able to restore it.';
    };

    const getModalFooter = () => {
        if (hasActiveOrders || error) {
            return (
                <div className='flex justify-end'>
                    <Button onClick={onRequestClose} size='lg' textSize={textSize}>
                        Ok
                    </Button>
                </div>
            );
        }

        return (
            <div className='flex justify-end gap-[1rem] pt-[1.6rem]'>
                <Button onClick={onRequestClose} size='lg' textSize={textSize} variant='outlined'>
                    Cancel
                </Button>
                <Button onClick={onClickDelete} size='lg' textSize={textSize}>
                    Delete
                </Button>
            </div>
        );
    };
    return (
        <>
            {!isLoadingInfo && (
                <Modal
                    className={clsx('p2p-v2-modal-styles w-[44rem] p-[1.6rem]', {
                        'w-[32.8rem]': isMobile,
                    })}
                    isOpen={isModalOpen}
                    onRequestClose={onRequestClose}
                    shouldCloseOnOverlayClick={false}
                    style={customStyles}
                    testId='dt_p2p_v2_ads_delete_modal'
                >
                    <Text
                        as='div'
                        className={clsx('mx-[0.8rem] pb-[1.2rem]', { 'mx-0': isMobile })}
                        color='general'
                        weight='bold'
                    >
                        Do you want to delete this ad?
                    </Text>
                    <Text
                        as='div'
                        className={clsx('my-[2.4rem] mx-[0.8rem]', { 'my-0 mx-0': isMobile })}
                        color='prominent'
                        size='sm'
                    >
                        {getModalText()}
                    </Text>
                    {getModalFooter()}
                </Modal>
            )}
        </>
    );
};

export default memo(MyAdsDeleteModal);
