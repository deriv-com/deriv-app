import React from 'react';
import { Modal, DesktopWrapper, MobileDialog, MobileWrapper } from '@deriv/components';
import { getDefaultFields } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { trading_assessment_form_config, trading_assessment_questions } from 'Configs/trading-assessment-config';
import TradingAssessmentForm from './trading-assessment-form';

const TradingAssessmentExistingUser = ({
    real_account_signup_target,
    is_trade_assessment_incomplete,
    realAccountSignup,
}) => {
    const [form_values, setStateItems] = React.useState({});

    React.useEffect(() => {
        const initial_fields = getDefaultFields(real_account_signup_target, trading_assessment_form_config);
        setStateItems(initial_fields);
    }, []);

    const handleSubmit = async values => {
        try {
            const response = await realAccountSignup(values);
        } catch (error) {
            if (error.code === 'AppropriatenessTestFailed') {
                //pass
            }
        }
    };

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal is_open={is_trade_assessment_incomplete} title={localize('Trading Experience Assessment')}>
                    <TradingAssessmentForm
                        assessment_questions={trading_assessment_questions}
                        form_values={form_values}
                        onSubmit={handleSubmit}
                    />
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    visible={is_trade_assessment_incomplete}
                    title={localize('Trading Experience Assessment')}
                >
                    <TradingAssessmentForm
                        assessment_questions={trading_assessment_questions}
                        value={form_values}
                        onSubmit={handleSubmit}
                    />
                </MobileDialog>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default connect(({ client, ui }) => ({
    is_trade_assessment_incomplete: client.is_trading_experience_incomplete,
    real_account_signup_target: ui.real_account_signup_target,
    realAccountSignup: client.realAccountSignup,
}))(TradingAssessmentExistingUser);
