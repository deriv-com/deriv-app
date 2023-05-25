declare global {
    type KeysMatching<T, V> = {
        [K in keyof T]-?: T[K] extends V ? K : never;
    }[keyof T];

    type DeepPartial<T> = T extends string | number | bigint | boolean | null | undefined | symbol | Date
        ? T | undefined
        : T extends Array<infer ArrayType>
        ? Array<DeepPartial<ArrayType>>
        : T extends ReadonlyArray<infer ArrayType>
        ? ReadonlyArray<ArrayType>
        : T extends Set<infer SetType>
        ? Set<DeepPartial<SetType>>
        : T extends ReadonlySet<infer SetType>
        ? ReadonlySet<SetType>
        : T extends Map<infer KeyType, infer ValueType>
        ? Map<DeepPartial<KeyType>, DeepPartial<ValueType>>
        : T extends ReadonlyMap<infer KeyType, infer ValueType>
        ? ReadonlyMap<DeepPartial<KeyType>, DeepPartial<ValueType>>
        : { [K in keyof T]?: DeepPartial<T[K]> };

    type DeepRequired<T> = T extends Error
        ? Required<T>
        : T extends Map<infer Keys, infer Values>
        ? Map<DeepRequired<Keys>, DeepRequired<Values>>
        : T extends ReadonlyMap<infer Keys, infer Values>
        ? ReadonlyMap<DeepRequired<Keys>, DeepRequired<Values>>
        : T extends WeakMap<infer Keys, infer Values>
        ? WeakMap<DeepRequired<Keys>, DeepRequired<Values>>
        : T extends Set<infer Values>
        ? Set<DeepRequired<Values>>
        : T extends ReadonlySet<infer Values>
        ? ReadonlySet<DeepRequired<Values>>
        : T extends WeakSet<infer Values>
        ? WeakSet<DeepRequired<Values>>
        : T extends Promise<infer Value>
        ? Promise<DeepRequired<Value>>
        : // eslint-disable-next-line
        T extends {}
        ? { [Key in keyof T]-?: DeepRequired<T[Key]> }
        : Required<T>;

    type NoStringIndex<T> = { [K in keyof T as string extends K ? never : K]: T[K] };
}

export {};
