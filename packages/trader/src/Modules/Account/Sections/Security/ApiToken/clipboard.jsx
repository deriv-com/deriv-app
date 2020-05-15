import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Icon } from '@deriv/components';
import { copyToClipboard } from '_common/utility';
import { localize } from '@deriv/translations';

const Clipboard = ({ token }) => {
    const [is_copied, setIsCopied] = React.useState(false);

    const onClick = () => {
        copyToClipboard(token);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    return (
        <>
            {!is_copied && (
                <Popover
                    alignment='top'
                    classNameBubble='api-token__popover'
                    is_bubble_hover_enabled
                    message={localize('Click here to copy your token.')}
                >
                    <Icon icon='IcClipboard' className='api-token__clipboard' onClick={onClick} />
                </Popover>
            )}
            {is_copied && (
                <Popover
                    alignment='top'
                    classNameBubble='api-token__popover'
                    is_bubble_hover_enabled
                    message={localize('Token copied!')}
                    relative_render
                >
                    <Icon icon='IcInfoOutline' className='api-token__clipboard' />
                </Popover>
            )}
        </>
    );
};

Clipboard.propTypes = {
    token: PropTypes.string,
};

export default Clipboard;
