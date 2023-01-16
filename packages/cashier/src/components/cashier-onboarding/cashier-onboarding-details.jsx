import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, NewsTicker, Text } from '@deriv/components';
import './cashier-onboarding.scss';

const CashierOnboardingDetails = ({
    detail_click,
    detail_contents,
    detail_description,
    detail_header,
    is_dark_mode_on,
    is_mobile,
}) => {
    return (
        <div className='cashier-onboarding-detail'>
            <Text size='sm' weight='bold' color='prominent'>
                {detail_header}
            </Text>
            <div
                className='cashier-onboarding-detail__div'
                data-testid='dt_cashier_onboarding_detail_div'
                onClick={detail_click}
            >
                <div className='cashier-onboarding-detail__content'>
                    <Text size='xs' className='cashier-onboarding-detail__text'>
                        {detail_description}
                    </Text>
                    <Icon icon={is_dark_mode_on ? 'IcChevronRightBoldDark' : 'IcChevronRightBold'} size={16} />
                </div>
                {detail_contents?.map((content, id) => (
                    <div key={id} className='cashier-onboarding-detail__array'>
                        <div className='cashier-onboarding-detail__icons'>
                            <NewsTicker speed={10}>
                                <div className={classNames({ 'cashier-onboarding-detail__icons-array': !is_mobile })}>
                                    {content.icons?.map((icon, index) => {
                                        return (
                                            <div key={`${icon}${index}`} className='cashier-onboarding-detail__icon'>
                                                <Icon
                                                    icon={is_dark_mode_on ? icon.dark : icon.light}
                                                    width={72}
                                                    height={45}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </NewsTicker>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

CashierOnboardingDetails.propTypes = {
    detail_click: PropTypes.func,
    detail_contents: PropTypes.array,
    detail_description: PropTypes.string,
    detail_header: PropTypes.string,
    is_dark_mode_on: PropTypes.bool,
    is_mobile: PropTypes.bool,
};

export default CashierOnboardingDetails;
