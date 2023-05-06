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

    type DeepRequired<Type> = Type extends Error
        ? Required<Type>
        : Type extends Map<infer Keys, infer Values>
        ? Map<DeepRequired<Keys>, DeepRequired<Values>>
        : Type extends ReadonlyMap<infer Keys, infer Values>
        ? ReadonlyMap<DeepRequired<Keys>, DeepRequired<Values>>
        : Type extends WeakMap<infer Keys, infer Values>
        ? WeakMap<DeepRequired<Keys>, DeepRequired<Values>>
        : Type extends Set<infer Values>
        ? Set<DeepRequired<Values>>
        : Type extends ReadonlySet<infer Values>
        ? ReadonlySet<DeepRequired<Values>>
        : Type extends WeakSet<infer Values>
        ? WeakSet<DeepRequired<Values>>
        : Type extends Promise<infer Value>
        ? Promise<DeepRequired<Value>>
        : // eslint-disable-next-line
        Type extends {}
        ? { [Key in keyof Type]-?: DeepRequired<Type[Key]> }
        : Required<Type>;
}

export {};
