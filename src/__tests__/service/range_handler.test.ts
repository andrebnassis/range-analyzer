import { getAvailableRanges } from "../../service/range_handler";
describe("test getAvailableRanges", () => {
  
  describe("when lock-ranges does NOT intercept selection", () => {
    
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

        const limitLowerBoundCutSample0 = {from: -7,  to: undefined};
        const limitLowerBoundCutSample1 = {from: 8, to: undefined};
      
        const limitUpperBoundSample0 = {from: undefined, to: 7};
        const limitUpperBoundSample1 = {from: undefined, to: -8};
        
        const limitUpperAndLowerBoundSample0 = {from: -5, to:5};
      
        
        expect(getAvailableRanges(lockRanges, selection, limitLowerBoundCutSample0)).toEqual([{from: limitLowerBoundCutSample0.from, to:selection.to}]);
        expect(getAvailableRanges(lockRanges, selection, limitLowerBoundCutSample1)).toEqual([{from: limitLowerBoundCutSample1.from, to:selection.to}]);
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

  describe("when a lock-range intercepts", () => {

    describe("the head of a selection", () => {

      describe("and limit completely excludes selection", () => {

        it("should return no elements as result of the array", () => {


          const selection = {from: -8, to: 8};
          const limit = {from:-10, to: -9};

          const lockRangesLowerBoundSample0 = [{from:undefined, to:-8}];
          const lockRangesLowerBoundSample1 = [{from:undefined, to:-10}, {from: -11, to:-8}, {from: -12, to: -7}];
          const lockRangesLowerBoundSample2 = [{from:undefined, to:-10}, {from: -12, to: -6}, {from: -11, to:-8}];

          expect(getAvailableRanges(lockRangesLowerBoundSample0, selection, limit)).toEqual([]);
          expect(getAvailableRanges(lockRangesLowerBoundSample1, selection, limit)).toEqual([]);
          expect(getAvailableRanges(lockRangesLowerBoundSample2, selection, limit)).toEqual([]);

        });

      })

      describe("and there is no limit defined", () => {

        it("should make a lowerbound cut on the selection", () => {

          const selection = {from: -8, to: 8};
          const limit = {from:undefined, to: undefined};

          const lockRangesLowerBoundSample0 = [{from:undefined, to:-8}];
          const lockRangesLowerBoundSample1 = [{from:undefined, to:-10}, {from: -11, to:-8}, {from: -12, to: -7}];
          const lockRangesLowerBoundSample2 = [{from:undefined, to:-10}, {from: -12, to: -6}, {from: -11, to:-8}];

          expect(getAvailableRanges(lockRangesLowerBoundSample0, selection, limit)).toEqual([{from:-7, to:selection.to}]);
          expect(getAvailableRanges(lockRangesLowerBoundSample1, selection, limit)).toEqual([{from:-6, to:selection.to}]);
          expect(getAvailableRanges(lockRangesLowerBoundSample2, selection, limit)).toEqual([{from:-5, to:selection.to}]);

        })
      })

      describe("and limit cross selection", () => {

        it("should apply a limit cutoff on the result", () => {

          const selection = {from: -8, to: 8};

          const limitSample0 = {from:-9, to: -8};
          const limitSample1 = {from:-6, to: 6};
          const limitSample2 = {from:8, to: 9};
          

          const lockRangesLowerBoundSample0 = [{from:undefined, to:-8}];
          const lockRangesLowerBoundSample1 = [{from:undefined, to:-10}, {from: -11, to:-8}, {from: -12, to: -7}];
          const lockRangesLowerBoundSample2 = [{from:undefined, to:-10}, {from: -12, to: -6}, {from: -11, to:-8}];

          expect(getAvailableRanges(lockRangesLowerBoundSample0, selection, limitSample0)).toEqual([]);
          expect(getAvailableRanges(lockRangesLowerBoundSample0, selection, limitSample1)).toEqual([{from:-6, to:6}]);
          expect(getAvailableRanges(lockRangesLowerBoundSample0, selection, limitSample2)).toEqual([{from:8, to:8}]);
          
          expect(getAvailableRanges(lockRangesLowerBoundSample1, selection, limitSample0)).toEqual([]);
          expect(getAvailableRanges(lockRangesLowerBoundSample1, selection, limitSample1)).toEqual([{from:-6, to:6}]);
          expect(getAvailableRanges(lockRangesLowerBoundSample1, selection, limitSample2)).toEqual([{from:8, to:8}]);
          
          
          expect(getAvailableRanges(lockRangesLowerBoundSample2, selection, limitSample0)).toEqual([]);
          expect(getAvailableRanges(lockRangesLowerBoundSample2, selection, limitSample1)).toEqual([{from:-5, to:6}]);
          expect(getAvailableRanges(lockRangesLowerBoundSample2, selection, limitSample2)).toEqual([{from:8, to:8}]);
          
        })

      })

    })

    describe("the tail of a selection", () => {

      describe("and limit completely excludes selection", () => {

        it("should return no elements as result of the array", () => {

          const selection = {from: -8, to: 8};
          const limit = {from:-10, to: -9};

          const lockRangesUpperBoundSample0 = [{from:8, to:undefined}];
          const lockRangesUpperBoundSample1 = [{from:10, to:undefined}, {from: 8, to:11}, {from: 7, to: 12}];
          const lockRangesUpperBoundSample2 = [{from:10, to:undefined}, {from: 8, to:11}, {from: 7, to: 11}, {from: 7, to: 12},{from: 7, to: 13}];
          const lockRangesUpperBoundSample3 = [{from:10, to:undefined}, {from: 6, to: 12}, {from: 8, to:11}];

          
          expect(getAvailableRanges(lockRangesUpperBoundSample0, selection, limit)).toEqual([]);

          expect(getAvailableRanges(lockRangesUpperBoundSample1, selection, limit)).toEqual([]);
          
          expect(getAvailableRanges(lockRangesUpperBoundSample2, selection, limit)).toEqual([]);

          expect(getAvailableRanges(lockRangesUpperBoundSample3, selection, limit)).toEqual([]);

        });

      })

      })

      describe("and there is no limit defined", () => {

        it("should make a upperbound cut on the selection", () => {

          const selection = {from: -8, to: 8};
          const limit = {from:undefined, to: undefined};

          const lockRangesUpperBoundSample0 = [{from:8, to:undefined}];
          const lockRangesUpperBoundSample1 = [{from:10, to:undefined}, {from: 8, to:11}, {from: 7, to: 12}];
          const lockRangesUpperBoundSample2 = [{from:10, to:undefined}, {from: 8, to:11}, {from: 7, to: 11}, {from: 7, to: 12},{from: 7, to: 13}];
          const lockRangesUpperBoundSample3 = [{from:10, to:undefined}, {from: 6, to: 12}, {from: 8, to:11}];

          
          expect(getAvailableRanges(lockRangesUpperBoundSample0, selection, limit)).toEqual([{from:selection.from, to:7}]);

          expect(getAvailableRanges(lockRangesUpperBoundSample1, selection, limit)).toEqual([{from:selection.from, to:6}]);
          
          expect(getAvailableRanges(lockRangesUpperBoundSample2, selection, limit)).toEqual([{from:selection.from, to:6}]);

          expect(getAvailableRanges(lockRangesUpperBoundSample3, selection, limit)).toEqual([{from:selection.from, to:5}]);

        })

      })



      describe("and limit cross selection", () => {

        it("should apply a limit cutoff on the result", () => {

          const selection = {from: -8, to: 8};

          const limitSample0 = {from:-9, to: -8};
          const limitSample1 = {from:-6, to: 6};
          const limitSample2 = {from:8, to: 9};

          const lockRangesUpperBoundSample0 = [{from:8, to:undefined}];
          const lockRangesUpperBoundSample1 = [{from:10, to:undefined}, {from: 8, to:11}, {from: 7, to: 12}];
          const lockRangesUpperBoundSample2 = [{from:10, to:undefined}, {from: 8, to:11}, {from: 7, to: 11}, {from: 7, to: 12},{from: 7, to: 13}];
          const lockRangesUpperBoundSample3 = [{from:10, to:undefined}, {from: 6, to: 12}, {from: 8, to:11}];

          
          expect(getAvailableRanges(lockRangesUpperBoundSample0, selection, limitSample0)).toEqual([{from:-8, to:-8}]);
          expect(getAvailableRanges(lockRangesUpperBoundSample0, selection, limitSample1)).toEqual([{from:-6, to:6}]);
          expect(getAvailableRanges(lockRangesUpperBoundSample0, selection, limitSample2)).toEqual([]);

          expect(getAvailableRanges(lockRangesUpperBoundSample1, selection, limitSample0)).toEqual([{from:-8, to:-8}]);
          expect(getAvailableRanges(lockRangesUpperBoundSample1, selection, limitSample1)).toEqual([{from:-6, to:6}]);
          expect(getAvailableRanges(lockRangesUpperBoundSample1, selection, limitSample2)).toEqual([]);
          
          expect(getAvailableRanges(lockRangesUpperBoundSample2, selection, limitSample0)).toEqual([{from:-8, to:-8}]);
          expect(getAvailableRanges(lockRangesUpperBoundSample2, selection, limitSample1)).toEqual([{from:-6, to:6}]);
          expect(getAvailableRanges(lockRangesUpperBoundSample2, selection, limitSample2)).toEqual([]);

          expect(getAvailableRanges(lockRangesUpperBoundSample3, selection, limitSample0)).toEqual([{from:-8, to:-8}]);
          expect(getAvailableRanges(lockRangesUpperBoundSample3, selection, limitSample1)).toEqual([{from:-6, to:5}]);
          expect(getAvailableRanges(lockRangesUpperBoundSample3, selection, limitSample2)).toEqual([]);

        }) 
      
      })
    
    describe("the middle of a selection", () => {
      
      describe("and limit completely excludes selection", () => {

        it("should return no elements as result of the array", () => {

          const selection = {from: -8, to: 8};
          const limit = {from:-10, to: -9};

          const lockRanges = [{from:-5, to:5}];
                    
          expect(getAvailableRanges(lockRanges, selection, limit)).toEqual([]);

        });

      })

      describe("and there is no limit defined", () => {

        it("should return two new selections as available ranges result", () => {

          const selection = {from: -8, to: 8};
          const limit = {from:undefined, to: undefined};

          const lockRanges = [{from:-5, to:5}];
                    
          expect(getAvailableRanges(lockRanges, selection, limit)).toEqual([{from:selection.from, to:-6},{from: 6, to: selection.to}]);

        })

      })

      describe("and limit cross selection", () => {

        it("should apply a limit cutoff on the result", () => {

          const selection = {from: -8, to: 8};

          const limitSample0 = {from:-9, to: -8};
          const limitSample1 = {from:-6, to: 6};
          const limitSample2 = {from:8, to: 9};

          const lockRanges = [{from:-5, to:5}];
                    
          expect(getAvailableRanges(lockRanges, selection, limitSample0)).toEqual([{from:-8, to:-8}]);
          expect(getAvailableRanges(lockRanges, selection, limitSample1)).toEqual([{from:-6, to:-6},{from: 6, to: 6}]);
          expect(getAvailableRanges(lockRanges, selection, limitSample2)).toEqual([{from: 8, to: 8}]);

        })

      })

    })

  });

});


describe("Complex cases", () => {

  it("Infinity selection", () => {

    const selection = {from:undefined, to:undefined};

    const lockRanges = [{from: -10, to: -13}, {from: 50, to: 7}, {from: 3, to: -2}, {from: -50, to:-17}];
    const limit = {from: -15, to:5 }


    expect(getAvailableRanges(lockRanges, selection)).toEqual([{from:undefined, to:-51}, {from:-16, to:-14}, {from:-9,to:-3},{from:4, to:6},{from:51, to:undefined}]);
    expect(getAvailableRanges(lockRanges, selection, limit)).toEqual([{from:-15, to:-14}, {from:-9,to:-3},{from:4, to:5}]);

  })

  it("algorithm improvement: cut inner ranges", () => {

    const selection = {from: 2, to: 4};
    const limit = {from:-5, to: 5};
    const lockRanges = [{from:-7, to: 1},{from:-7, to: 2},{from:-7, to: 3}, {from:-7, to:7}]

    expect(getAvailableRanges(lockRanges, selection, limit)).toEqual([]);

  })

})