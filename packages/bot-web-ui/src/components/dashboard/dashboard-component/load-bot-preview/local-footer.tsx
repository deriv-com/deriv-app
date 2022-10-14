import React from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import './index.scss';

type Nullable<T> = T | null;
type TLocalFooter = {
    is_mobile: boolean;
    is_open_button_loading: boolean;
    loadFileFromLocal: () => void;
    setLoadedLocalFile: (data: Nullable<string>) => void;
};

const LocalFooter = ({ is_mobile, is_open_button_loading, loadFileFromLocal, setLoadedLocalFile }: TLocalFooter) => {
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

export default connect(({ load_modal, ui }: RootStore) => ({
    is_mobile: ui.is_mobile,
    is_open_button_loading: load_modal.is_open_button_loading,
    loadFileFromLocal: load_modal.loadFileFromLocal,
    setLoadedLocalFile: load_modal.setLoadedLocalFile,
}))(LocalFooter);
