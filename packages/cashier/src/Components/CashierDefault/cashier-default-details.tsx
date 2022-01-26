import classNames from 'classnames';
import React from 'react';
import { Icon, NewsTicker, Text } from '@deriv/components';
import 'Sass/cashier-default.scss';

type CashierDefaultDetailsProps = {
    detail_click: () => void;
    detail_contents: unknown;
    detail_description: string;
    detail_header: string;
    is_mobile: boolean;
};

const CashierDefaultDetails = ({
    detail_click,
    detail_contents,
    detail_description,
    detail_header,
    is_dark_mode_on,
    is_mobile,
}: CashierDefaultDetailsProps) => {
    return (
        <div className='cashier-default-detail'>
            <Text size='sm' weight='bold' color='prominent'>
                {detail_header}
            </Text>
            <div className='cashier-default-detail__div' onClick={detail_click}>
                <div className='cashier-default-detail__content'>
                    <Text size='xs' className='cashier-default-detail__text'>
                        {detail_description}
                    </Text>
                    <Icon icon={is_dark_mode_on ? 'IcChevronRightBoldDark' : 'IcChevronRightBold'} size={16} />
                </div>
                {detail_contents?.map((content, id) => (
                    <div key={id} className='cashier-default-detail__array'>
                        <div className='cashier-default-detail__icons'>
                            <NewsTicker speed={10}>
                                <div className={classNames({ 'cashier-default-detail__icons-array': !is_mobile })}>
                                    {content.icons?.map((icon, index) => {
                                        return (
                                            <div key={`${icon}${index}`} className='cashier-default-detail__icon'>
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

export default CashierDefaultDetails;
