import classNames from 'classnames';
import Icon from '../icon/icon';
import Text from '../text';
import { Localize } from '@deriv/translations';
import OpenLiveChatLink from '../open-livechat-link';

type TFormSubmitErrorMessage = {
    className?: string;
    message: string;
    error_code?: string;
};

const FormSubmitErrorMessage = ({ className, message, error_code }: TFormSubmitErrorMessage) => {
    const getErrorMessage = () => {
        switch (error_code) {
            case 'PhoneNumberTaken':
                return (
                    <Text as='p' size='xxs' className='dc-form-submit-error-message__phone-number-taken'>
                        <Localize
                            i18n_default_text='Number already exists in our system. Enter a new one or contact us via <0></0> for help'
                            components={[<OpenLiveChatLink text_size='xxs' key={0} />]}
                        />
                    </Text>
                );
            default:
                <Text as='p' size='xxs' weight='bold' color='prominent'>
                    {message}
                </Text>;
        }
    };

    return (
        <div className={classNames('dc-form-submit-error-message', className)}>
            <Icon icon='IcAlertDanger' data_testid='form_submit_error' />
            {getErrorMessage()}
        </div>
    );
};

export default FormSubmitErrorMessage;
