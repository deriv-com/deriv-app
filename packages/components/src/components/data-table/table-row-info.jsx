import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ThemedScrollbars from '../themed-scrollbars';
import Text from '../text';
import Icon from '../icon/icon.jsx';

const TableRowInfo = ({ replace, is_footer, cells, className }) => {
    const [show_details, setShowDetails] = React.useState(false);
    const [has_copy_icon, setHasCopyIcon] = React.useState(false);
    const [is_copied, setIsCopied] = React.useState(false);

    const toggleDetails = () => {
        if (replace) {
            setShowDetails(!show_details);
            if (/^[0-9a-zA-Z]+.{25,34}/gm.test(replace.message.split(/,| /)[1])) {
                setHasCopyIcon(true);
            }
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
        navigator.clipboard.writeText(replace.message.split(/,| /)[1]).then(() => {
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
                            <Text as='p' size='xs' className='statement__row--detail-text' align='center'>
                                {replace.message}
                                {has_copy_icon ? copy_to_clipboard : null}
                            </Text>
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
