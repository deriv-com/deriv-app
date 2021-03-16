import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ThemedScrollbars from '../themed-scrollbars';
import Text from '../text';
import Icon from '../icon';

const TableRowInfo = ({ replace, is_footer, cells, className }) => {
    const [show_details, setShowDetails] = React.useState(false);

    const toggleDetails = () => {
        if (replace) {
            setShowDetails(!show_details);
        }
    };

    const ReportsClipboard = ({ text_copy }) => {
        const [is_copied, setIsCopied] = React.useState(false);
        let timeout_clipboard = null;

        const copyToClipboard = text => {
            const textField = document.createElement('textarea');
            textField.innerText = text;
            document.body.appendChild(textField);
            textField.select();
            document.execCommand('copy');
            textField.remove();
        };

        const onClick = event => {
            copyToClipboard(text_copy);
            setIsCopied(true);
            event.stopPropagation();
            timeout_clipboard = setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        };

        React.useEffect(() => {
            return () => clearTimeout(timeout_clipboard);
        }, []);

        return (
            <>
                {is_copied && (
                    <Icon
                        icon='IcCheckmarkCircle'
                        custom_color='var(--status-success)'
                        className={classNames('dc-clipboard', className)}
                        onClick={event => {
                            event.stopPropagation();
                        }}
                    />
                )}
                {!is_copied && (
                    <Icon
                        icon='IcClipboard'
                        custom_color='var(--text-less-prominent)'
                        className={classNames('dc-clipboard', className)}
                        onClick={onClick}
                    />
                )}
            </>
        );
    };
    ReportsClipboard.propTypes = {
        text_copy: PropTypes.string,
        info_message: PropTypes.string,
        success_message: PropTypes.string,
        className: PropTypes.string,
    };

    return (
        <div
            onClick={is_footer || !replace ? undefined : toggleDetails}
            className={classNames(className, { 'statement__row--detail': show_details })}
        >
            {show_details ? (
                <ThemedScrollbars height='80px'>
                    <div>
                        {replace?.component ?? (
                            <div className='reports-copy'>
                                <Text as='p' size='xs' className='statement__row--detail-text'>
                                    {replace.message}
                                </Text>
                                <ReportsClipboard
                                    text_copy={replace.message}
                                    info_message={'Copy to clipboard'}
                                    success_message={'Copied!'}
                                />
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
