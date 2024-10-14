import { Text, CaptionText, Pagination } from '@deriv-com/quill-ui';
import { formatDate, formatMoney, formatTime, TContractStore } from '@deriv/shared';
import CardWrapper from '../CardWrapper';
import Carousel from 'AppV2/Components/Carousel';
import React, { useState } from 'react';
import clsx from 'classnames';
import { localize, Localize } from '@deriv/translations';

type THistory = TContractStore['contract_update_history'];

type TContractHistory = {
    currency?: string;
    history?: [] | THistory;
};

type TPagination = {
    currentPage: number;
    totalPageCount: number;
};

const TakeProfitHistory = ({ history = [], currency }: TContractHistory) => {
    const [current_page, setCurrentPage] = useState(0);
    const items_per_page = 4;
    const total_pages = Math.ceil(history.length / items_per_page);
    const has_tp = history.some(item => item.order_type === 'take_profit' || item.display_name === 'Take profit');
    const has_sl = history.some(item => item.order_type === 'stop_loss' || item.display_name === 'Stop loss');

    const handlePageChange = React.useCallback((pagination: TPagination) => {
        setCurrentPage(pagination.currentPage - 1);
    }, []);

    const getHistoryTitle = () => {
        if (has_tp && has_sl) return <Localize i18n_default_text='TP & SL history' />;
        if (has_tp) return <Localize i18n_default_text='TP history' />;
        if (has_sl) return <Localize i18n_default_text='SL history' />;
    };

    if (!history.length) return null;

    const pages_config = (history as THistory).reduce((result: THistory[], _item: typeof history[0], index: number) => {
        if (!(index % items_per_page)) {
            result.push(history.slice(index, index + items_per_page));
        }
        return result;
    }, []);

    const pages = pages_config.map((array, index) => ({
        id: index,
        component: (
            <React.Fragment>
                {array.map((item, index) => (
                    <div key={`take-profit-history-${index}`} className='take-profit-history__table-row'>
                        <div
                            className={clsx('take-profit-history__table-cell', 'take-profit-history__table-cell--left')}
                        >
                            <CaptionText color='quill-typography__color--subtle' size='sm'>
                                {formatDate(item.order_date, 'DD MMM YYYY')}
                            </CaptionText>
                            <CaptionText color='quill-typography__color--subtle'>
                                {formatTime(Number(item.order_date))}
                            </CaptionText>
                        </div>
                        <div className='take-profit-history__table-cell'>
                            <Text size='sm' color='quill-typography__color--subtle'>
                                {item.display_name}
                            </Text>
                            <Text size='sm'>
                                {Math.abs(Number(item.order_amount)) === 0
                                    ? localize('Cancelled')
                                    : `${formatMoney(String(currency), String(item.order_amount), true)} ${currency}`}
                            </Text>
                        </div>
                    </div>
                ))}
            </React.Fragment>
        ),
    }));

    return (
        <CardWrapper title={getHistoryTitle()} className='take-profit-history'>
            <div
                className={clsx('take-profit-history__table', {
                    'take-profit-history__table--fixed-height': history.length > items_per_page,
                })}
            >
                <Carousel
                    classname='take-profit-history__carousel'
                    current_index={current_page}
                    is_swipeable
                    pages={pages}
                    setCurrentIndex={setCurrentPage}
                />
            </div>
            {total_pages > 1 && (
                <Pagination
                    contentLength={history.length}
                    contentPerPage={items_per_page}
                    hideChevron
                    onClickPagination={handlePageChange}
                    variant='bullet'
                />
            )}
        </CardWrapper>
    );
};

export default TakeProfitHistory;
