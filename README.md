# Range Analyzer Library

This library aims to help you dealing with range analysis.

Some use cases:
 - Timetracking applications that creates and manage intervals.
 - TextEditor applications that manage actions based on the area selected.


## Installation
https://www.npmjs.com/package/range-analyzer

```bash

//Using npm
npm install range-analyzer

//Using yarn
yarn add range-analyzer

```
## Using the library
### getAvailableRanges

`getAvailableRanges(lockRanges:Array<IRange>, selection:IRange|null, limit:IRange = {from:undefined, to:undefined}) => Array<IRange>` 

 This function returns `an array of available ranges` based on the analysis of the target selection range, the lock range array and the limit defined. 

 The ranges are defined by the following object:

 ```typescript
 {
     from: number|undefined,
     to: number|undefined
 }
 ```
 
 > You can set the values as `INTEGER` or `undefined`. if you set `from` and/or `to` as `undefined`, it means that it will assume a `negative INFINITY value` in case of `from`, and a `positive INFINITY value` in case of `to`.

> If you set the values using any `NON INTEGER` value, it will behave as `undefined`.

#### Parameter definitions: 

__selection__: It is the target area that you aim to select. 

__lockRanges__: It is the areas that cannot be selected. 

__limit__: It is the upper bound and lower bound cutoff that will be applied after having the **available ranges result**. 


#### Usage example:

```typescript

import { getAvailableRanges } from "range-analyzer"

const selection = {from:undefined, to:undefined};

const lockRanges = [{from: -10, to: -13}, {from: 50, to: 7}, {from: 3, to: -2}, {from: -50, to:-17}];
const limit = {from: -15, to:5 }

const result = getAvailableRanges(lockRanges, selection, limit);
// result: [{from:-15, to:-14}, {from:-9,to:-3},{from:4, to:5}]

```


# CONTRIBUITING

Check out [CONTRIBUTING.md](CONTRIBUTING.md) to understand more about the project internals and how to contribute to it.

# References

To build this typescript library I had support of a free good quality material over the internet. You can check it below:

## Setup a typescript library project

https://www.youtube.com/watch?v=Nh9xW2-ZOEU&t=5s&ab_channel=AdyNgom

https://www.youtube.com/watch?v=m6Jr6w0W1xw&ab_channel=Semmle

## Setup Jest over a typescript project

https://itnext.io/testing-with-jest-in-typescript-cc1cd0095421

https://itnext.io/debug-your-tests-in-typescript-with-visual-studio-code-911a4cada9cd


