import { Button, DesktopWrapper, MobileWrapper, Modal, Text, UILoader } from '@deriv/components';
import { Localize } from '@deriv/translations';
import React from 'react';
import './launch-modal.scss';
import { observer } from '@deriv/stores';
import LaunchModalChartImage from 'Assets/SvgComponents/launch/ic-chart-launch.svg';

type LaunchModalProps = {
    handleChange: () => void;
    open: boolean;
};

const ContinueButton = ({ handleOpen }: { handleOpen: () => void }) => (
    <Modal.Footer>
        <Button className='continue-button' has_effect onClick={handleOpen} primary large>
            <Localize i18n_default_text='Continue' />
        </Button>
    </Modal.Footer>
);

const InfoDisplay = () => (
    <div className='modal-content' data-testid='launch-modal'>
        <LaunchModalChartImage className='chart-image' />
        <Text as='h1' weight='bold' align='center' size='sm'>
            <Localize i18n_default_text='Deriv Trader Chart v2.0.' />
        </Text>
        <Text as='p' align='center'>
            <Localize i18n_default_text='Smoother charts. Smarter insights.' />
        </Text>
    </div>
);

const LaunchModal = ({ handleChange, open }: LaunchModalProps) => (
    <React.Suspense fallback={<UILoader />}>
        <DesktopWrapper>
            <Modal has_close_icon={false} is_open={open} className='modal_root' height='440px' width='440px'>
                <Modal.Body>
                    <InfoDisplay />
                </Modal.Body>
                <ContinueButton handleOpen={handleChange} />
            </Modal>
        </DesktopWrapper>
        <MobileWrapper>
            <div className='launch-page-mobile'>
                <InfoDisplay />
                <ContinueButton handleOpen={handleChange} />
            </div>
        </MobileWrapper>
    </React.Suspense>
);

export default observer(LaunchModal);
