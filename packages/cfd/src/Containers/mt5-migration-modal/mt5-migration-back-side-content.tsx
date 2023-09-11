import React from 'react';

import { Checkbox, Text, StaticUrl } from '@deriv/components';
import { Localize } from '@deriv/translations';
import getMigrationModalDetails from '../../Constants/mt5-migration-modal-content';

const MT5MigrationBackSideContent = ({ to_account }: { to_account: string }) => {
    const [is_checked, setIsChecked] = React.useState(false);
    const content = getMigrationModalDetails(to_account);
    return (
        <React.Fragment>
            <div>
                <div className='mt5-migration-modal__description'>
                    <Text as='p' color='general' size='s' align='center' weight='bold'>
                        <Localize i18n_default_text='What will happen to the funds in my existing account(s)?' />
                    </Text>
                </div>
                <div className='mt5-migration-modal__existing-accounts'>
                    {content.map(item => (
                        <React.Fragment key={item.key}>
                            <div className='mt5-migration-modal__existing-accounts-card'>
                                <div className='mt5-migration-modal__existing-accounts-card-content'>
                                    <Text as='div' weight='bold'>
                                        {item.title}
                                    </Text>
                                    {item.description.map((desc, idx) => (
                                        <Text key={idx} as='div' size='xs'>
                                            {desc}
                                        </Text>
                                    ))}
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                <div>
                    <div className='mt5-migration-modal__existing-accounts-card-content'>
                        <Checkbox
                            value={is_checked}
                            onChange={() => setIsChecked(true)}
                            label={
                                <Text as='p' size={'xs'} line_height='xs'>
                                    <Localize
                                        i18n_default_text='I agree to move my MT5 account(s) and agree to Deriv BVI Ltd’s <0>terms and conditions</0>'
                                        components={[
                                            <StaticUrl key={0} className='link' href={'tnc/deriv-(bvi)-ltd.pdf'} />,
                                        ]}
                                    />
                                </Text>
                            }
                            defaultChecked={!!is_checked}
                        />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default MT5MigrationBackSideContent;
