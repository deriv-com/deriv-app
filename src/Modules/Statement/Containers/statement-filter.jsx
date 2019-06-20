import moment       from 'moment';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from 'App/i18n';
import DatePicker   from 'App/Components/Form/DatePicker';
import { connect }  from 'Stores/connect';

const Filter = ({
    date_from,
    date_to,
    handleDateChange,
    today,
    use_native_pickers,
}) => (
    <div className='statement__filter'>
        <div className='statement__filter-content'>
            <span className='statement__filter-label'>{localize('Filter by date:')}</span>
            <DatePicker
                name='date_from'
                placeholder={localize('Start date')}
                start_date={date_to || today}
                max_date={date_to || today}
                onChange={handleDateChange}
                value={date_from}
                is_nativepicker={use_native_pickers}
            />
            <span className='statement__filter-dash'>&mdash;</span>
            <DatePicker
                name='date_to'
                placeholder={localize('End date')}
                start_date={today}
                min_date={date_from}
                max_date={today}
                has_today_btn
                onChange={handleDateChange}
                value={date_to}
                is_nativepicker={use_native_pickers}
            />
        </div>
    </div>
);

Filter.propTypes = {
    date_from         : PropTypes.string,
    date_to           : PropTypes.string,
    handleDateChange  : PropTypes.func,
    server_time       : PropTypes.object,
    today             : PropTypes.string,
    use_native_pickers: PropTypes.bool,
};

export default connect(
    ({ common, modules }) => ({
        today           : moment(common.server_time).format('YYYY-MM-DD'),
        date_from       : modules.statement.date_from,
        date_to         : modules.statement.date_to,
        handleDateChange: modules.statement.handleDateChange,
    })
)(Filter);
