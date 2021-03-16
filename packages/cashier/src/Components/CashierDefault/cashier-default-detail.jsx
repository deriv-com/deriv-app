import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';

const CashierDefaultDetail = ({ detail_click, detail_contents, detail_description, detail_header }) => {
    return (
        <div className='cashier-default-detail'>
            <Text size='sm' weight='bold'>
                <Localize i18n_default_text={localize(detail_header)} />
            </Text>
            <div className='cashier-default-detail__div' onClick={detail_click}>
                <div className='cashier-default-detail__content'>
                    <Text size='xs' className='cashier-default-detail__text'>
                        <Localize i18n_default_text={detail_description} />
                    </Text>
                    <Icon icon='IcChevronRight' size={16} />
                </div>
                <div>
                    {detail_contents.map(content => (
                        <div key={content.title} className='cashier-default-detail__array'>
                            <Text size='xxs' weight='bold' color='less-prominent'>
                                {localize(content.title)}
                            </Text>
                            {content.icons?.map(icon => (
                                <div key={icon} className='cashier-default-detail__icons'>
                                    <Icon icon={icon} size={35} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

CashierDefaultDetail.propTypes = {
    detail_click: PropTypes.func,
    detail_contents: PropTypes.array,
    detail_description: PropTypes.string,
    detail_header: PropTypes.string,
};

export default CashierDefaultDetail;
