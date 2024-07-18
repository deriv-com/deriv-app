import { Text, CaptionText, Pagination } from '@deriv-com/quill-ui';
import { formatDate, formatTime, TContractStore } from '@deriv/shared';
import { FormatUtils } from '@deriv-com/utils';
import CardWrapper from '../CardWrapper';
import React, { useState } from 'react';
import clsx from 'classnames';
import { Localize } from '@deriv/translations';

type TContractHistory = {
    currency?: string;
    history?: [] | TContractStore['contract_update_history'];
};

type TPagination = {
    currentPage: number;
    totalPageCount: number;
};

const TakeProfitHistory = ({ history = [], currency }: TContractHistory) => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4;
    const totalPages = Math.ceil(history.length / itemsPerPage);

    const handlePageChange = (pagination: TPagination) => {
        setCurrentPage(pagination.currentPage - 1);
    };

    const currentItems = history.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <CardWrapper title={<Localize i18n_default_text='TP & SL history' />} className='take-profit-history'>
            <div
                className={clsx('take-profit-history__table', {
                    'take-profit-history__table--fixed-height': history.length > itemsPerPage,
                })}
            >
                {currentItems.map((item, index) => (
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
                            <Text size='sm'>{`${FormatUtils.formatMoney(Number(item.order_amount))} ${currency}`}</Text>
                        </div>
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <Pagination
                    contentLength={history.length}
                    contentPerPage={itemsPerPage}
                    hideChevron
                    onClickPagination={handlePageChange}
                    variant='bullet'
                />
            )}
        </CardWrapper>
    );
};

export default TakeProfitHistory;
