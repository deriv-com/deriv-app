import { ReactNode } from 'react';
import { Icon, Text } from '@deriv/components';

type TClosingAccountPendingContentProps = {
    currency_icon: string;
    loginid?: string;
    title?: ReactNode;
    value: ReactNode;
};

const ClosingAccountPendingContent = ({ currency_icon, loginid, title, value }: TClosingAccountPendingContentProps) => (
    <div className='closing-account-error__container'>
        <div className='closing-account-error__account-details'>
            <Icon icon={currency_icon} size={24} />
            <div className='closing-account-error__account'>
                <Text line_height='s' color='prominent' size='xs'>
                    {title}
                </Text>
                <Text color='prominent' size='xxxs' line_height='xs'>
                    {loginid}
                </Text>
            </div>
        </div>
        <Text className='closing-account-error__details' color='prominent' size='xs' line_height='s' align='right'>
            {value}
        </Text>
    </div>
);

export default ClosingAccountPendingContent;
