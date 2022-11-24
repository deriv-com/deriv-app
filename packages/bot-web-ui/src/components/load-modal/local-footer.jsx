import React from 'react';
import { PropTypes } from 'prop-types';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { isMobile } from '@deriv/shared';

const LocalFooter = ({
    is_open_button_loading,
    loadFileFromLocal,
    setLoadedLocalFile,
    toggleLoadModal,
    setPreviewOnPopup,
}) => {
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

LocalFooter.propTypes = {
    is_open_button_loading: PropTypes.bool,
    loadFileFromLocal: PropTypes.func,
    setLoadedLocalFile: PropTypes.bool,
    setPreviewOnPopup: PropTypes.func,
};

export default connect(({ load_modal, dashboard }) => ({
    is_open_button_loading: load_modal.is_open_button_loading,
    loadFileFromLocal: load_modal.loadFileFromLocal,
    setLoadedLocalFile: load_modal.setLoadedLocalFile,
    toggleLoadModal: load_modal.toggleLoadModal,
    setPreviewOnPopup: dashboard.setPreviewOnPopup,
}))(LocalFooter);
