import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from '_common/localize';
import { Icon }          from 'Assets/Common';
import { IconStatement } from 'Assets/Header/NavBar';
import { routes }        from 'Constants/index';
import { ButtonLink }    from 'App/Components/Routes';

const EmptyStatementMessage = ({ has_selected_date }) => (
    <React.Fragment>
        <div className='statement-empty'>
            <Icon icon={IconStatement} className='statement-empty__icon' />
            <span className='statement-empty__text'>
                {
                    !has_selected_date ?
                        localize('Your account has no trading activity.')
                        :
                        localize('Your account has no trading activity for the selected period.')
                }
            </span>
            {
                !has_selected_date &&
                <ButtonLink
                    className='btn--secondary btn--secondary--orange'
                    to={routes.trade}
                >
                    <span>{localize('Trade now')}</span>
                </ButtonLink>
            }
        </div>
    </React.Fragment>
);

EmptyStatementMessage.propTypes = {
    has_selected_date: PropTypes.bool,
};

export default EmptyStatementMessage;
