// https://stackoverflow.com/a/68699273
export type DeepPartial<T> = T extends string | number | bigint | boolean | null | undefined | symbol | Date
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

// https://stackoverflow.com/a/57044690
export type KeysMatching<T, V> = {
    [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
