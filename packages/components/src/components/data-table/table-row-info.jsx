import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import ThemedScrollbars from '../themed-scrollbars';
import Text from '../text';
import Icon from '../icon/icon.jsx';

const TableRowInfo = ({ replace, is_footer, cells, className }) => {
    const [show_details, setShowDetails] = React.useState(false);
    const [is_copied, setIsCopied] = React.useState(false);

    const toggleDetails = () => {
        if (replace) {
            setShowDetails(!show_details);
        }
    };

    const onCopySuccess = () => {
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 300);
    };

    const onClickCopy = event => {
        event.stopPropagation();
        navigator.clipboard.writeText(replace.message.match(/(([a-zA-Z0-9]{44}))/g)[0]).then(() => {
            onCopySuccess();
        });
    };

    const copy_to_clipboard = (
        <Icon
            icon={is_copied ? 'IcCheckmarkCircle' : 'IcCopy'}
            className='table__row--icon'
            onClick={event => onClickCopy(event)}
        />
    );

    return (
        <div
            onClick={is_footer || !replace ? undefined : toggleDetails}
            className={classNames(className, { 'statement__row--detail': show_details })}
        >
            {show_details ? (
                <ThemedScrollbars height='80px'>
                    <div>
                        {replace?.component ?? (
                            <div className='table__row--info'>
                                <Text as='p' size='xs' className='statement__row--detail-text'>
                                    {replace.message}
                                    {replace.message.includes(localize('Address')) ? copy_to_clipboard : null}
                                </Text>
                            </div>
                        )}
                    </div>
                </ThemedScrollbars>
            ) : (
                cells
            )}
        </div>
    );
};

TableRowInfo.propTypes = {
    cells: PropTypes.arrayOf(PropTypes.node),
    className: PropTypes.string,
    replace: PropTypes.shape({
        component: PropTypes.func,
        message: PropTypes.string,
    }),
    is_footer: PropTypes.bool,
};

export default TableRowInfo;
