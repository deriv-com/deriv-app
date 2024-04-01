import React, { memo, useEffect } from 'react';
import Modal from 'react-modal';
import { useDevice } from '@/hooks';
import { p2p } from '@deriv/api-v2';
import { Button, Text } from '@deriv-com/ui';
import { customStyles } from '../helpers';
import './MyAdsDeleteModal.scss';

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
                    className='p-[1.6rem] p2p-v2-my-ads-delete-modal'
                    isOpen={isModalOpen}
                    onRequestClose={onRequestClose}
                    shouldCloseOnOverlayClick={false}
                    style={customStyles}
                    testId='dt_p2p_v2_ads_delete_modal'
                >
                    <Text as='div' className='p2p-v2-my-ads-delete-modal__header' color='general' weight='bold'>
                        Do you want to delete this ad?
                    </Text>
                    <Text as='div' className='p2p-v2-my-ads-delete-modal__body' color='prominent' size='sm'>
                        {getModalText()}
                    </Text>
                    {getModalFooter()}
                </Modal>
            )}
        </>
    );
};

export default memo(MyAdsDeleteModal);
