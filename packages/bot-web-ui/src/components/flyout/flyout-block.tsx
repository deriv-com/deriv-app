import React from 'react';
import classNames from 'classnames';
import { connect } from 'Stores/connect';

type FlyoutBlockProps = {
    block_node: unknown;
    initBlockWorkspace: () => void;
    should_center_block: boolean;
    should_hide_display_name: boolean;
};

const FlyoutBlock = ({
    initBlockWorkspace,
    block_node,
    should_center_block,
    should_hide_display_name,
}: FlyoutBlockProps) => {
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
};

export default connect(({ flyout }) => ({
    initBlockWorkspace: flyout.initBlockWorkspace,
}))(FlyoutBlock);
