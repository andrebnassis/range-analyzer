import { IRange } from "../model/IRange";
import { isNumber } from "./number_utils";


/*
      Sample result:

      lockRangesProcessed: [
        { from: 7, to: 13 },
        { from: 7, to: 12 },
        { from: 7, to: 11 },
        { from: 8, to: 11 },
        { from: 10, to: 14 }
      ]
 
*/
const sortRanges = (ranges:Array<{from:number, to:number}>) => {
  return ranges.slice().sort((a, b) => {
    const aLength = a.to - a.from;
    const bLength = b.to - b.from;

    //lower from comes first
    if(a.from > b.from){
      return 1;
    }

    if(a.from === b.from){

      // bigger ranges comes first
      if((a.from + aLength) > (b.from + bLength)){
        return -1;
      }

      if((a.from + aLength) === (b.from + bLength)){
        return 0;
      }

      if((a.from + aLength) < (b.from + bLength)){
        return +1;
      }
    }

    return -1;

    
  })
};

const getAvailableRanges = (
  lockRanges:Array<IRange>, 
  selection:IRange|null, 
  limit:IRange = {from:undefined, to:undefined}
  ):Array<IRange> => {
    
    //pre-process
    
    //Step 1: Guarantee only numbers || undefined
    let lockRangesProcessed:Array<IRange> = lockRanges.map(lockRange => {

      lockRange.from = !isNumber(lockRange.from) ? undefined : lockRange.from;
      lockRange.to = !isNumber(lockRange.to) ? undefined : lockRange.to;

      // Step 2: Guarantee Ranges Direction: From <= To
      if(isNumber(lockRange.from) && isNumber(lockRange.to)){
        const tmpLockRange = {...lockRange};
        lockRange.from = Math.min(tmpLockRange.from as number, tmpLockRange.to as number);
        lockRange.to = Math.max(tmpLockRange.from as number, tmpLockRange.to as number);
      }
      
      return lockRange;

    })

    //Step 1: Guarantee only numbers || undefined
    let selectionProcessed = {
        from: !isNumber(selection?.from) ? undefined : selection?.from,
        to: !isNumber(selection?.to) ? undefined : selection?.to
    }

    // Step 2: Guarantee Ranges Direction: From <= To
    if(isNumber(selectionProcessed.from) && isNumber(selectionProcessed.to)){
      const tmpSelectionProcessed = {...selectionProcessed};
      selectionProcessed.from = Math.min(tmpSelectionProcessed.from as number, tmpSelectionProcessed.to as number);
      selectionProcessed.to = Math.max(tmpSelectionProcessed.from as number, tmpSelectionProcessed.to as number);
    }
    
    //Step 1: Guarantee only numbers || undefined
    let limitProcessed = {
        from: !isNumber(limit?.from) ? undefined : limit?.from,
        to: !isNumber(limit?.to) ? undefined : limit?.to
    }
    // Step 2: Guarantee Ranges Direction: From <= To
    if(isNumber(limitProcessed.from) && isNumber(limitProcessed.to)){
      const tmpLimitProcessed = {...limitProcessed};
      limitProcessed.from = Math.min(tmpLimitProcessed.from as number, tmpLimitProcessed.to as number);
      limitProcessed.to = Math.max(tmpLimitProcessed.from as number, tmpLimitProcessed.to as number);
    }

    //Step 3: Extract infinity values representation
    const allFromLockRangesArr = lockRangesProcessed.map(lockRange => lockRange.from);
    const allFromNumbers = [...allFromLockRangesArr, selectionProcessed?.from, limitProcessed?.from].filter(value => value !== undefined) as Array<number>;

    const allToLockRangesArr = lockRangesProcessed.map(lockRange => lockRange.to);
    const allToNumbers = [...allToLockRangesArr, selectionProcessed?.to, limitProcessed?.to].filter(value => value !== undefined) as Array<number>;
    
    const allNumbers = [...allFromNumbers, ...allToNumbers];
    let max = 0;
    let min = 0;

    if(allNumbers.length > 0){
      max = Math.max(...allNumbers);
      min = Math.min(...allNumbers);
    }

    const absMax = Math.abs(max);
    const absMin = Math.abs(min);

    const PositiveInfinity = Math.max(absMax, absMin) + 1;
    const NegativeInfinity = -PositiveInfinity;
    
    // console.log({PositiveInfinity});
    // console.log({NegativeInfinity});
    //Step 4: Replace undefined for its infinity representation

    lockRangesProcessed = lockRangesProcessed.map(lockRange => {
      lockRange.from = !isNumber(lockRange.from) ? NegativeInfinity : lockRange.from;
      lockRange.to = !isNumber(lockRange.to) ? PositiveInfinity : lockRange.to;

      return lockRange;
    })

    selectionProcessed = {
      from: !isNumber(selectionProcessed.from) ? NegativeInfinity : selectionProcessed.from,
      to: !isNumber(selectionProcessed.to) ? PositiveInfinity : selectionProcessed.to
  }
    
    limitProcessed = {
    from: !isNumber(limitProcessed.from) ? NegativeInfinity : limitProcessed.from,
    to: !isNumber(limitProcessed.to) ? PositiveInfinity : limitProcessed.to
}

//Step 5: Sanitize and Sort LockRanges

//Step 5.1: [ALGORITHM IMPROVEMENT] Remove all lockRanges that are inner other lock ranges
lockRangesProcessed = lockRangesProcessed.filter((current,_, arr) => {
  
  const completelyReplaceCurrentRangeSearch = arr.filter(range => ((range.from as number) <= (current.from as number)) && ((range.to as number) >= (current.to as number)) );
  const isInnerFromAnotherRange = completelyReplaceCurrentRangeSearch.length > 1;

  return !isInnerFromAnotherRange
})

//Step 5.2: Sort LockRanges
lockRangesProcessed = sortRanges(lockRangesProcessed as any);

// console.log({selectionProcessed});
// console.log({limitProcessed});
// console.log({lockRangesProcessed});

// Step 6: Call processFreeRangesFromSelection 
const result = processFreeRangesFromSelection(lockRangesProcessed as any, selectionProcessed  as any, [], limitProcessed  as any);

// Step 7: Replace Infinity representations with undefined
const resultProcessed = result.map(unprocessedRange => {

  const range = {
    from: unprocessedRange.from === NegativeInfinity ? undefined : unprocessedRange.from,
    to: unprocessedRange.to === PositiveInfinity ? undefined : unprocessedRange.to,
  }
  
  // Step 8: return processed result
  return range;
})

// console.log({resultProcessed});

    return resultProcessed;
  }

 
  const cutRangeByLimit = (range:{from:number, to:number}, limit:{from:number, to:number}) => {
    const cutResult = {
      from: range.from < limit.from ? limit.from : range.from,
      to: range.to > limit.to ? limit.to : range.to,
    }
  
    return cutResult;
  }

const processFreeRangesFromSelection = (
lockRanges:Array<{from:number, to:number}>, 
selection:{from:number, to:number}|null, 
resultFreeRanges:Array<{from:number, to:number}>,
limit:{from:number, to:number}
):Array<{from:number, to:number}> => {

let result = resultFreeRanges;
  
if(selection === null || lockRanges.length === 0)
{
  if(selection !== null && !resultFreeRanges.some(range => range.from === selection?.from && range.to === selection?.to)){
       result.push(selection);
  }
  
  //filter all results that cross limit area
  result = result.filter(range => range.from <= limit.to && range.to >= limit.from);
  
  //cut them by its limit
  result = result.map((range) => cutRangeByLimit(range, limit));
    
  return result;
}
  
  const selectionRangeSize = selection.to - selection.from;
  
  // if selection starts within a lock range
  if(selection.from >= lockRanges[0].from
    && selection.from <=  lockRanges[0].to) {
      
      //if selection is completely inside of a readonly area
      if(selection.from + selectionRangeSize <= lockRanges[0].to){
        selection = null;
      }
      else{
      selection.from = lockRanges[0].to + 1;
    }
      
    }

    //if selection doesn't start within a lockrange but cross the lockrange
    else if(selection.from < lockRanges[0].from && (selection.from + selectionRangeSize) >= lockRanges[0].from){
      
      const selectionTo = selection.to;
      
      //cut selection:: selectionRange.to = readOnlyRanges[0].from-1;
      const partialResult = {
        from: selection.from,
        to: lockRanges[0].from-1
      }
      
      // save the valid selection
      resultFreeRanges.push(partialResult);
      
      // if there is some selection leftover to evaluate
      if(selectionTo > lockRanges[0].to){
        selection.from = lockRanges[0].to+1;
      }
      else{
        selection = null;
      }
      
      }

      lockRanges.shift();
      return processFreeRangesFromSelection(lockRanges, selection, resultFreeRanges, limit);

}

export { getAvailableRanges }