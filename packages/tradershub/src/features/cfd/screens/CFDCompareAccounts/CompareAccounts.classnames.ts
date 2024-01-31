import { cva, VariantProps } from 'class-variance-authority';
import { ExcludeAllNull } from '@deriv/quill-design';

export const CompareAccountsPlatformLabelClass = cva('bg-system-light-platform-background p-[9px] rounded-t-700', {
    variants: { background: { CTrader: 'bg-[#ffeabf]', MT5: 'bg-[#e6f5ff]', OtherCFDs: 'bg-[#e8fdf8]' } },
});

export const CompareAccountsPlatformLabelTextColorClass = cva('text-center', {
    variants: { label: { CTrader: 'text-[#ff9c13]', MT5: 'text-[#2C9aff]', OtherCFDs: 'text-[#17eabd]' } },
});

export type TCompareAccountsPlatformLabelClassProps = ExcludeAllNull<
    VariantProps<typeof CompareAccountsPlatformLabelClass>
>;

export type TCompareAccountsPlatformLabelTextClassProps = ExcludeAllNull<
    VariantProps<typeof CompareAccountsPlatformLabelTextColorClass>
>;
