import { useContext, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { FormikValues, useFormikContext } from 'formik';
import { Button, Text } from '@deriv/components';
import { Localize } from '@deriv-com/translations';
import SelfExclusionContext from './self-exclusion-context';

const SelfExclusionFooter = () => {
    const { footer_ref, goToConfirm, toggleArticle } = useContext(SelfExclusionContext);
    const { dirty, isSubmitting, isValid, values } = useFormikContext<FormikValues>();

    if (footer_ref) {
        return createPortal(
            <Fragment>
                <a className='link link--prominent' onClick={toggleArticle}>
                    <Text size='xxs' line_height='m' weight='bold'>
                        <Localize i18n_default_text='Learn more about trading limits' />
                    </Text>
                </a>
                <Button
                    disabled={!dirty || !isValid || isSubmitting}
                    primary
                    className='da-self-exclusion__button'
                    large
                    onClick={() => goToConfirm?.(values)}
                    type='button'
                >
                    <Localize i18n_default_text='Next' />
                </Button>
            </Fragment>,
            footer_ref
        );
    }

    return null;
};

export default SelfExclusionFooter;
