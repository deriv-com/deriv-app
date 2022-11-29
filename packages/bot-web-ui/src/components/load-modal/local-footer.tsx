import React from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/root-store';

type TLocalFooterProps = {
    is_mobile: boolean;
    is_open_button_loading: boolean;
    loadFileFromLocal: () => void;
    setLoadedLocalFile: (loaded_local_file: boolean | null) => void;
    setPreviewOnPopup: (show: boolean) => void;
    toggleLoadModal: () => void;
};

const LocalFooter = ({
    is_mobile,
    is_open_button_loading,
    loadFileFromLocal,
    setLoadedLocalFile,
    setPreviewOnPopup,
    toggleLoadModal,
}: TLocalFooterProps) => {
    const Wrapper = is_mobile ? Button.Group : React.Fragment;

    return (
        <Wrapper>
            {is_mobile && (
                <Button text={localize('Cancel')} onClick={() => setLoadedLocalFile(null)} has_effect secondary large />
            )}
            <Button
                text={localize('Open')}
                onClick={() => {
                    loadFileFromLocal();
                    toggleLoadModal();
                    setPreviewOnPopup(false);
                }}
                is_loading={is_open_button_loading}
                has_effect
                primary
                large
            />
        </Wrapper>
    );
};

export default connect(({ load_modal, ui, dashboard }: RootStore) => ({
    is_mobile: ui.is_mobile,
    is_open_button_loading: load_modal.is_open_button_loading,
    loadFileFromLocal: load_modal.loadFileFromLocal,
    setLoadedLocalFile: load_modal.setLoadedLocalFile,
    toggleLoadModal: load_modal.toggleLoadModal,
    setPreviewOnPopup: dashboard.setPreviewOnPopup,
}))(LocalFooter);
