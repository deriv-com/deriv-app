import { Link } from 'react-router-dom';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv-com/translations';
import { Button, StaticUrl, Text } from '@deriv/components';

type TClosingAccountStepsProps = {
    redirectToReasons: () => void;
};
const CloseButton = ({ redirectToReasons }: TClosingAccountStepsProps) => (
    <Button className='closing-account__button--close-account' large onClick={() => redirectToReasons()} primary>
        <Localize i18n_default_text='Close my account' />
    </Button>
);

const ClosingAccountSteps = observer(({ redirectToReasons }: TClosingAccountStepsProps) => {
    const { common } = useStore();
    const { is_from_derivgo } = common;

    return (
        <div>
            <div className='closing-account__information'>
                <Text size='xs' weight='bold' className='closing-account__information--bold' as='p'>
                    <Localize i18n_default_text='Are you sure?' />
                </Text>
            </div>
            <div className='closing-account__steps'>
                <Text size='xs' as='p' className='closing-account__title'>
                    <Localize i18n_default_text='If you close your account:' />
                </Text>
                <ul>
                    <li>
                        <Localize i18n_default_text="You can't trade on Deriv." />
                    </li>
                    <li>
                        <Localize i18n_default_text="You can't make transactions." />
                    </li>
                </ul>
            </div>
            <div className='closing-account__steps'>
                <Text size='xs' as='p' line_height='s' className='closing-account__title'>
                    <Localize i18n_default_text='Before closing your account:' />
                </Text>
                <ul>
                    <li>
                        <Localize i18n_default_text='Close all your positions.' />
                    </li>
                    <li>
                        <Localize i18n_default_text='Withdraw your funds.' />
                    </li>
                </ul>
            </div>
            <div className='closing-account__steps'>
                <Text size='xs' as='p' line_height='s'>
                    <Localize
                        i18n_default_text='We shall delete your personal information as soon as our legal obligations are met, as mentioned in the section on Data Retention in our <0>Security and privacy policy</0>'
                        components={[
                            <StaticUrl key={0} className='link' href='tnc/security-and-privacy.pdf' is_document />,
                        ]}
                    />
                </Text>
            </div>
            {is_from_derivgo ? (
                <div className='closing-account__buttons-container'>
                    <CloseButton redirectToReasons={redirectToReasons} />
                </div>
            ) : (
                <div className='closing-account__buttons-container'>
                    <Link to='/'>
                        <Button className='closing-account__button--cancel' large secondary>
                            <Localize i18n_default_text='Cancel' />
                        </Button>
                    </Link>
                    <CloseButton redirectToReasons={redirectToReasons} />
                </div>
            )}
        </div>
    );
});
export default ClosingAccountSteps;
