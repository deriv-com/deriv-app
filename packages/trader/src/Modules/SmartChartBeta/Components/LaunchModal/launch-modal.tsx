import { Button, DesktopWrapper, MobileWrapper, Modal, PageOverlay, UILoader } from '@deriv/components';
import { LocalStore, getUrlBase } from '@deriv/shared';

import { Localize } from '@deriv/translations';
import React, { useState } from 'react';
import './launch-modal.scss';
import { observer } from 'mobx-react';
import { useStore } from '@deriv/stores';

const ContinueButton: React.FC<{ handleOpen: () => void }> = ({ handleOpen }) => (
    <Modal.Footer>
        <Button has_effect onClick={handleOpen} primary large>
            <Localize i18n_default_text='Continue' />
        </Button>
    </Modal.Footer>
);

const InfoDisplay: React.FC = () => (
    <div className='info' data-testid='launch-modal'>
        <img src={getUrlBase('/public/images/common/chart-launch.png')} alt='Chart Image' />
        <h1 className='title'>Deriv Trader Chart v2.0</h1>
        <p className='sub-title'>
            <Localize i18n_default_text='Smoother charts. Smarter insights.' />
        </p>
    </div>
);

const LaunchModal = () => {
    const [open, setOpen] = useState(true);
    const {
        client: { is_logged_in },
    } = useStore();

    const handleOpen = () => {
        setOpen(!open);
        LocalStore.set('launchModalShown', JSON.stringify(true));
    };

    const is_already_shown: boolean = JSON.parse(LocalStore.get('launchModalShown') || 'false');

    return (
        <React.Suspense fallback={<UILoader />}>
            <DesktopWrapper>
                <Modal
                    has_close_icon={false}
                    is_open={is_logged_in && open && !is_already_shown}
                    className='launch_modal_root'
                    height='464px'
                    portalId='modal_root'
                    header={'  '}
                >
                    <Modal.Body>
                        <InfoDisplay />
                    </Modal.Body>
                    <ContinueButton handleOpen={handleOpen} />
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <PageOverlay
                    is_open={is_logged_in && open && !is_already_shown}
                    portal_id='launch_modal_root'
                    onClickClose={handleOpen}
                >
                    <InfoDisplay />
                    <ContinueButton handleOpen={handleOpen} />
                </PageOverlay>
            </MobileWrapper>
        </React.Suspense>
    );
};

export default observer(LaunchModal);
