import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getUrlBase } from '@deriv/shared';

const AcuitySocialBanner = () => (
    <div className='cfd-dashboard__social-banner'>
        <Icon icon='IcCross' className='cfd-dashboard__social-banner--close-icon' />
        <div className='cfd-dashboard__social-banner--wrapper'>
            <div className='cfd-dashboard__social-banner--wrapper__image'>
                <img src={getUrlBase('/public/images/common/acuity_software.png')} />
            </div>
            <div>
                <Text as='p' line_height='xxl' size='s' color='prominent' weight='bold'>
                    <Localize i18n_default_text='Power up your trades with Acuity' />
                </Text>
                <Text as='p' line_height='xl' size='xs' color='prominent' weight='normal'>
                    <Localize
                        i18n_default_text='Download intuitive trading tools to keep track of market events. The Acuity suite is only available for<0/> Windows, and is most recommended for financial assets.'
                        components={<br key={0} />}
                    />
                </Text>
                <div className='cfd-dashboard__social-banner--wrapper__button'>
                    <Button small={true} type='button' secondary={true}>
                        <span>
                            <Localize i18n_default_text='Download Acuity' />
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    </div>
);

export default AcuitySocialBanner;
