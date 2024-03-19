declare global {
    type DeepNonNullable<T> = NonNullable<
        T extends object
            ? {
                  [K in keyof T]-?: DeepNonNullable<T[K]>;
              }
            : NonNullable<T>
    >;
}

export {};
