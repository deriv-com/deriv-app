import React from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/root-store';

type TRecentFooterProps = {
    is_open_button_loading: boolean;
    loadFileFromRecent: () => void;
    toggleLoadModal: () => void;
    setShowToast: (param: boolean) => void;
    setToastMessage: (param: string) => void;
};

const RecentFooter = ({
    is_open_button_loading,
    loadFileFromRecent,
    toggleLoadModal,
    setShowToast,
    setToastMessage,
}: TRecentFooterProps) => {
    return (
        <Button
            text={localize('Open')}
            onClick={() => {
                loadFileFromRecent();
                toggleLoadModal();
                setToastMessage('import');
                setShowToast(true);
            }}
            is_loading={is_open_button_loading}
            has_effect
            primary
            large
        />
    );
};

export default connect(({ load_modal, dashboard }: RootStore) => ({
    is_open_button_loading: load_modal.is_open_button_loading,
    loadFileFromRecent: load_modal.loadFileFromRecent,
    setShowToast: dashboard.setShowToast,
    setToastMessage: dashboard.setToastMessage,
    toggleLoadModal: load_modal.toggleLoadModal,
}))(RecentFooter);
