import { useTranslations } from '@deriv-com/translations';
import IconWithMessage from '../icon-with-message';

type TDemoMessage = {
    has_button?: boolean;
};

const DemoMessage = ({ has_button }: TDemoMessage) => {
    const { localize } = useTranslations();
    return (
        <IconWithMessage
            icon='IcPoaLock'
            message={localize('This feature is not available for demo accounts.')}
            has_button={has_button}
        />
    );
};

export default DemoMessage;
