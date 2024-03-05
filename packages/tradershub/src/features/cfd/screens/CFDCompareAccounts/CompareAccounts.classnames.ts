import { cva, VariantProps } from 'class-variance-authority';

export const CompareAccountsPlatformLabelClass = cva('bg-system-light-platform-background p-[9px] rounded-t-xl', {
    variants: { background: { CTrader: 'bg-[#ffeabf]', MT5: 'bg-[#e6f5ff]', DerivX: 'bg-[#e8fdf8]' } },
});

export const CompareAccountsPlatformLabelTextColorClass = cva('text-center', {
    variants: { label: { CTrader: 'text-[#ff9c13]', MT5: 'text-[#2C9aff]', DerivX: 'text-[#17eabd]' } },
});

export type TCompareAccountsPlatformLabelClassProps = NonNullable<
    VariantProps<typeof CompareAccountsPlatformLabelClass>
>;

export type TCompareAccountsPlatformLabelTextClassProps = NonNullable<
    VariantProps<typeof CompareAccountsPlatformLabelTextColorClass>
>;
