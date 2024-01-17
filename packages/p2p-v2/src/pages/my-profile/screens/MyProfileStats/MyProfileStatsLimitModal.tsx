import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { useAdvertiserUpdate } from '@deriv/api';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { Text } from '@deriv-com/ui/dist/components/Text';
import './MyProfileStatsLimitModal.scss';

type TMyProfileStatsLimitModalProps = {
    currency: string;
    isModalOpen: boolean;
    onRequestClose: () => void;
};

type TCustomStyles = {
    overlay: ReactModal.Styles['overlay'];
};

const customStyles: TCustomStyles = {
    overlay: {
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 9999,
    },
};

const MyProfileStatsLimitModal = ({ currency, isModalOpen, onRequestClose }: TMyProfileStatsLimitModalProps) => {
    const { data, error, isLoading, isSuccess, mutate } = useAdvertiserUpdate();
    const { daily_buy_limit, daily_sell_limit } = data ?? {};
    useEffect(() => {
        Modal.setAppElement('#v2_modal_root');
    }, []);

    const getModalContent = () => {
        //TODO: modal header title to be moved out if needed according to implementation
        if (isLoading) {
            //TODO: replace with @deriv/ui loading component
            return <div className='p2p-v2-my-profile-stats-limit-modal__loader'>loading</div>;
        } else if (isSuccess) {
            return (
                <>
                    <Text className='p2p-v2-my-profile-stats-limit-modal__title' color='prominent' weight='bold'>
                        Success!
                    </Text>
                    <Text as='p' className='p2p-v2-my-profile-stats-limit-modal__text' color='prominent' size='sm'>
                        {`Your daily limits have been increased to ${daily_buy_limit} ${currency} (buy) and ${daily_sell_limit} ${currency} (sell).`}
                    </Text>
                    <div className='p2p-v2-my-profile-stats-limit-modal__footer'>
                        <Button onClick={onRequestClose} size='lg' textSize='sm'>
                            Ok
                        </Button>
                    </div>
                </>
            );
        } else if (error) {
            return (
                <>
                    <Text className='p2p-v2-my-profile-stats-limit-modal__title' color='prominent' weight='bold'>
                        An internal error occured
                    </Text>
                    <Text as='p' className='p2p-v2-my-profile-stats-limit-modal__text' color='prominent' size='sm'>
                        {`Sorry, we're unable to increase your limits right now. Please try again in a few minutes.`}
                    </Text>
                    <div className='p2p-v2-my-profile-stats-limit-modal__footer'>
                        <Button onClick={onRequestClose} size='lg' textSize='sm'>
                            Ok
                        </Button>
                    </div>
                </>
            );
        }
        return (
            <>
                <Text className='p2p-v2-my-profile-stats-limit-modal__title' color='prominent' weight='bold'>
                    Are you sure?
                </Text>
                <Text as='p' className='p2p-v2-my-profile-stats-limit-modal__text' color='prominent' size='sm'>
                    You won’t be able to change your buy and sell limits again after this. Do you want to continue?
                </Text>
                <div className='p2p-v2-my-profile-stats-limit-modal__footer'>
                    <Button onClick={onRequestClose} size='lg' textSize='sm' variant='outlined'>
                        No
                    </Button>
                    <Button onClick={() => mutate({ upgrade_limits: 1 })} size='lg' textSize='sm'>
                        Yes, continue
                    </Button>
                </div>
            </>
        );
    };

    return (
        // TODO: below modal will be rewritten to use @deriv/ui modal
        <Modal
            className='p2p-v2-my-profile-stats-limit-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
        >
            {/* <div className='p2p-v2-my-profile-stats-limit-modal'> */}
            {getModalContent()}
            {/* </div> */}
        </Modal>
    );
};

export default MyProfileStatsLimitModal;
