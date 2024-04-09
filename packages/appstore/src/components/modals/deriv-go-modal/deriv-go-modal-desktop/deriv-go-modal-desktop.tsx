import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { Modal, Text } from '@deriv/components';
import { getUrlBase } from '@deriv/shared';
import TradingPlatformIconProps from 'Assets/svgs/trading-platform';
import './deriv-go-modal-desktop.scss';

export const DerivGoModalDesktop = observer(() => {
    const { traders_hub } = useStore();
    const { is_deriv_go_modal_visible, setIsDerivGoModalVisible } = traders_hub;

    const handleModalClose = () => {
        setIsDerivGoModalVisible(false);
    };

    // const defineWidth = () => {
    //     return 316;
    // };

    return (
        <Modal
            is_open={is_deriv_go_modal_visible}
            toggleModal={handleModalClose}
            width='701px'
            should_header_stick_body={false}
            has_close_icon
            title={localize('Trade with Deriv GO')}
        >
            <React.Fragment>
                <div className='deriv-go-modal-desktop'>
                    <div className='deriv-go-modal-desktop__logo'>
                        <TradingPlatformIconProps icon='DerivGo' size={24} />
                        <Text as='h5' weight='bold'>
                            Deriv GO
                        </Text>
                    </div>
                    <div className='deriv-go-modal-desktop__content'>
                        <img
                            alt='mt5 download qr'
                            src={getUrlBase('/public/images/common/appstore/deriv_go_image.png')}
                            // width={defineWidth()}
                            width={316}
                        />
                    </div>
                </div>
            </React.Fragment>
        </Modal>
    );
});
