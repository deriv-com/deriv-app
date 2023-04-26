import React from 'react';
import { PropTypes } from 'prop-types';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const LocalFooter = ({ is_mobile, is_open_button_loading, loadFileFromLocal, setLoadedLocalFile }) => {
    const Wrapper = is_mobile ? Button.Group : React.Fragment;
    return (
        <Wrapper>
            {is_mobile && (
                <Button text={localize('Cancel')} onClick={() => setLoadedLocalFile(null)} has_effect secondary large />
            )}
            <Button
                text={localize('Open')}
                onClick={loadFileFromLocal}
                is_loading={is_open_button_loading}
                has_effect
                primary
                large
            />
        </Wrapper>
    );
};

LocalFooter.propTypes = {
    is_mobile: PropTypes.bool,
    is_open_button_loading: PropTypes.bool,
    loadFileFromLocal: PropTypes.func,
    setLoadedLocalFile: PropTypes.bool,
};

export default connect(({ load_modal, ui }) => ({
    is_mobile: ui.is_mobile,
    is_open_button_loading: load_modal.is_open_button_loading,
    loadFileFromLocal: load_modal.loadFileFromLocal,
    setLoadedLocalFile: load_modal.setLoadedLocalFile,
}))(LocalFooter);
