import { useState } from 'react';
import { Icon, Text, Popover } from '@deriv/components';
import { Localize } from '@deriv-com/translations';
import ApiTokenClipboard from './api-token-clipboard';

type TApiTokenTableRowTokenCell = {
    token?: string;
    scopes?: string[];
};

const HiddenPasswordDots = () => (
    <div data-testid='dt_hidden_tokens' className='da-api-token__pass-dot-container'>
        {Array.from(Array(15).keys()).map(element => (
            <div key={element} className='da-api-token__pass-dot' />
        ))}
    </div>
);

const ApiTokenTableRowTokenCell = ({ token, scopes }: TApiTokenTableRowTokenCell) => {
    const [should_show_token, setShouldShowToken] = useState(false);

    const toggleTokenVisibility = () => {
        setShouldShowToken(prev_value => !prev_value);
    };

    return (
        <div className='da-api-token__clipboard-wrapper'>
            {should_show_token ? (
                <Text as='p' color='prominent ' size='xs' line_height='m'>
                    {token}
                </Text>
            ) : (
                <HiddenPasswordDots />
            )}
            <ApiTokenClipboard
                info_message={<Localize i18n_default_text='Copy this token' />}
                success_message={<Localize i18n_default_text='Token copied!' />}
                text_copy={token}
                scopes={scopes}
            />
            <Popover
                alignment='bottom'
                classNameBubble='dc-clipboard__popover'
                message={
                    should_show_token ? (
                        <Localize i18n_default_text='Hide this token' />
                    ) : (
                        <Localize i18n_default_text='Show this token' />
                    )
                }
            >
                <Icon
                    icon={should_show_token ? 'IcPasswordEyeVisible' : 'IcPasswordEyeHide'}
                    className='da-api-token__visibility-icon'
                    onClick={toggleTokenVisibility}
                    width={15}
                    custom_color='var(--text-prominent)'
                    data_testid='dt_toggle_visibility_icon'
                />
            </Popover>
        </div>
    );
};

export default ApiTokenTableRowTokenCell;
