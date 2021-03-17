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

    const CopyButton = () => {
        const [icon, setIcon] = React.useState('IcClipboard');

        const success = () => {
            setIcon('IcCheckmarkCircle');
            setTimeout(() => {
                setIcon('IcClipboard');
            }, 1000);
        };

        const copyText = event => {
            event.stopPropagation();
            navigator.clipboard
                .writeText(replace.message)
                .then(() => {
                    success();
                })
                .catch(e => {
                    console.error('Could not copy text: ', e);
                });
        };

        return <Icon icon={icon} onClick={event => copyText(event)} />;
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
                            <Text as='p' size='xs' className='statement__row--detail-text'>
                                {replace.message}
                                <CopyButton />
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
