# Typescript Guidelines

## General

### Use tuples for fixed length arrays

```typescript jsx
let marks: number[] = [1, 2, 3];
```

You can use the above ‘marks’ array to store different number of items in different places of the same script. TS is not gonna restrict you as long as you provide all the values with the correct defined data type.

```typescript jsx
let marks: number[] = [1, 2, 3];
marks = []; // success
marks = [1]; // success
marks = [1, 2, 3, 4, 5]; // success
```

However this can lead to nasty logical errors in cases where the array length is a constant. To avoid these you should use array as a tuple, whenever the size should be a fixed size. Tuple is a properly defined array with each of the expecting value’s data type.

```typescript jsx
let marks: [number, number] = [1, 2]; // tuple of 2 number values
marks = [10, 20]; // success
marks = [1]; // syntax error
marks = [1, 2, 3, 4, 5]; // syntax error
```

### Use correct data type annotation ( avoid ‘any’ )

Data type annotation is one of the advantages you have when coding in TS, while JS defines data types in the run time. defining data types in TS saves you from weird run time errors that can occur by mistakes. Do not use ‘any’ keyword when you know what type of data your variable’s gonna hold. It is recommended that you always define the data type whenever you declare a new variable.

```typescript jsx
name: string = 'Hello';
value: number = 50;
isCorrect: boolean = false;
```

### Use type aliases in repetitive data types

Assume that you have multiple variables/ objects in your script which all follow the same structure of data types.

```typescript jsx
let man: { name: string; age: number } = { name = 'john', age = 30 };
let woman: { name: string; age: number } = { name = 'Anne', age = 32 };
```

to avoid this redundant chunks of type declarations and to re-use types, you can use type aliases.

```typescript jsx
type Details = { name: string; age: number }; // defining type alias
let man: Details = { name = 'john', age = 30 }; // using type alias
let woman: Details = { name = 'Anne', age = 32 };
```

The additional benefit of using a type alias is, your intention of defining the data is now clearly visible.
