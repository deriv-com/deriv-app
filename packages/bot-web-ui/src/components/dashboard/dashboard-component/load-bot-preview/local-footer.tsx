import React from 'react';
import { Button } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import './index.scss';

type Nullable<T> = T | null;
type TLocalFooter = {
    is_open_button_loading: boolean;
    loadFileFromLocal: () => void;
    setLoadedLocalFile: (data: Nullable<string>) => void;
    setPreviewOnPopup: (param: boolean) => boolean;
    toggleLoadModal: () => void;
};

const LocalFooter = ({
    is_open_button_loading,
    loadFileFromLocal,
    setLoadedLocalFile,
    setPreviewOnPopup,
    toggleLoadModal,
}: TLocalFooter) => {
    const is_mobile = isMobile();
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
                    setPreviewOnPopup(false);
                    toggleLoadModal();
                }}
                is_loading={is_open_button_loading}
                has_effect
                primary
                large
            />
        </Wrapper>
    );
};

export default connect(({ load_modal, dashboard }: RootStore) => ({
    is_open_button_loading: load_modal.is_open_button_loading,
    loadFileFromLocal: load_modal.loadFileFromLocal,
    setLoadedLocalFile: load_modal.setLoadedLocalFile,
    setPreviewOnPopup: dashboard.setPreviewOnPopup,
    toggleLoadModal: load_modal.toggleLoadModal,
}))(LocalFooter);
