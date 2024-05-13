import React from 'react';
import classNames from 'classnames';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';

type FlyoutBlockProps = {
    block_node: Element;
    should_hide_display_name?: boolean;
};

const FlyoutBlock = observer(({ block_node, should_hide_display_name }: FlyoutBlockProps) => {
    const { flyout } = useDBotStore();
    const { initBlockWorkspace } = flyout;

    let el_block_workspace = React.useRef();

    React.useEffect(() => {
        initBlockWorkspace(el_block_workspace, block_node);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            ref={el => (el_block_workspace = el)}
            className={classNames({
                'flyout__block-workspace--center': should_hide_display_name,
                'flyout__block-workspace--top': !should_hide_display_name,
            })}
            data-testid='flyout-block-workspace'
        />
    );
});

export default FlyoutBlock;
