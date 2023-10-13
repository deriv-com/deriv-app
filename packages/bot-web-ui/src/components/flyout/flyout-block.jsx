import React from 'react';
import classNames from 'classnames';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';

const FlyoutBlock = observer(({ block_node, should_center_block, should_hide_display_name }) => {
    const { flyout } = useDBotStore();
    const { initBlockWorkspace } = flyout;

    let el_block_workspace = React.useRef();

    React.useEffect(() => {
        initBlockWorkspace(el_block_workspace, block_node, should_center_block);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            ref={el => (el_block_workspace = el)}
            className={classNames({
                'flyout__block-workspace--center': should_hide_display_name,
                'flyout__block-workspace--top': !should_hide_display_name,
            })}
        />
    );
});

export default FlyoutBlock;
