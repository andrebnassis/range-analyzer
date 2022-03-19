import { getAvailableRanges } from "../../src/service/range_handler";
describe("test getAvailableRanges", () => {
  describe("when selection is complete out of any lock-range", () => {
    
    describe("if defined limit completely includes selection", () => {

      it("should return the selection itself", () => {

        const selection = {from: -8, to: 8};
        const lockRanges = [{from:undefined, to:-10}, {from: -11, to:-9}, {from: 9, to: 12}, {from:10, to: undefined}];

        const limitAsInfinite = {from:undefined, to:undefined};
        const limitMatchesSelection = {from:-8, to:8};
        const limitBiggerThanSelection = {from:-9, to:9};

        expect(getAvailableRanges(lockRanges, selection)).toEqual([selection]);
        expect(getAvailableRanges(lockRanges, selection, limitAsInfinite)).toEqual([selection]);
        expect(getAvailableRanges(lockRanges, selection, limitMatchesSelection)).toEqual([selection]);
        expect(getAvailableRanges(lockRanges, selection, limitBiggerThanSelection)).toEqual([selection]);

        
      });

    });

    describe("if defined limit cut selection", () => {
    
      it("should return selection cutted by its defined limit", () => {


        const selection = {from: -8, to: 8};
        const lockRanges = [{from:undefined, to:-10}, {from: -11, to:-9}, {from: 9, to: 12}, {from:10, to: undefined}];

        const limitLowerCutSample0 = {from: -7,  to: undefined};
        const limitLowerCutSample1 = {from: 8, to: undefined};
      
        const limitUpperBoundSample0 = {from: undefined, to: 7};
        const limitUpperBoundSample1 = {from: undefined, to: -8};
        
        const limitUpperAndLowerBoundSample0 = {from: -5, to:5};
      
        
        expect(getAvailableRanges(lockRanges, selection, limitLowerCutSample0)).toEqual([{from: limitLowerCutSample0.from, to:selection.to}]);
        expect(getAvailableRanges(lockRanges, selection, limitLowerCutSample1)).toEqual([{from: limitLowerCutSample1.from, to:selection.to}]);
        expect(getAvailableRanges(lockRanges, selection, limitUpperBoundSample0)).toEqual([{from: selection.from, to: limitUpperBoundSample0.to}]);
        expect(getAvailableRanges(lockRanges, selection, limitUpperBoundSample1)).toEqual([{from: selection.from, to:limitUpperBoundSample1.to}]);
        expect(getAvailableRanges(lockRanges, selection, limitUpperAndLowerBoundSample0)).toEqual([limitUpperAndLowerBoundSample0]);
        
      });

    });

    describe("if defined limit completely excludes selection", () => {
    
      it("should return no elements as result of the array", () => {


        const selection = {from: -8, to: 8};
        const lockRanges = [{from:undefined, to:-10}, {from: -11, to:-9}, {from: 9, to: 12}, {from:10, to: undefined}];

        const limitSample0 = {from:undefined, to:-9};
        const limitSample1 = {from:-10, to:-9};
        const limitSample2 = {from:9, to:10};
        const limitSample3 = {from:9, to:undefined};

        expect(getAvailableRanges(lockRanges, selection, limitSample0)).toEqual([]);
        expect(getAvailableRanges(lockRanges, selection, limitSample1)).toEqual([]);
        expect(getAvailableRanges(lockRanges, selection, limitSample2)).toEqual([]);
        expect(getAvailableRanges(lockRanges, selection, limitSample3)).toEqual([]);
      });

    });

  });
    
});