import {assert} from 'chai'
import {Discount, AbstractDiscount, DiscountSet} from '../src/models/discounts'

describe('Discounts', () => {
  describe('Discount', () => {

    it('should calculate a fixed discount', () => {
      assert.deepEqual({
        type: 'fixed',
        value: 5,
        note: 'blah',
        isFixed: true,
        isPercent: false,
        input: 13,
        amount: 5,
        output: 8
      }, Discount({type: 'fixed', value: 5, note: 'blah', input: 13}))
    })

    it('should calculate a percentage discount', () => {
      assert.deepEqual({
        type: 'percent',
        value: 10,
        note: 'blah',
        isFixed: false,
        isPercent: true,
        input: 13,
        amount: 1.3,
        output: 11.7
      }, Discount({type: 'percent', value: 10, note: 'blah', input: 13}))
    })
  })

  describe('AbstractDiscount', () => {

    it('should work?', () => {
      assert.deepEqual({
        type: 'percent',
        value: 10,
        note: 'blah',
        isFixed: false,
        isPercent: true,
      }, AbstractDiscount({type: 'percent', value: 10, note: 'blah'}))
    })
  })

  describe('DiscountSet', () => {

    it('should handle a couple discounts', () => {
      assert.deepEqual({
        input: 17,
        discounts: [
          {type: 'percent', value: 10, note: 'blah', isFixed: false, isPercent: true,
            input: 17, amount: 1.7, output: 15.3},
          {type: 'fixed', value: 5, note: 'blah2', isFixed: true, isPercent: false,
            input: 15.3, amount: 5, output: 10.3}
        ],
        amount: 6.7,
        output: 10.3
      },
      DiscountSet({
        discounts: [
          {type: 'percent', value: 10, note: 'blah'},
          {type: 'fixed', value: 5, note: 'blah2'}
        ],
        input: 17
      }))
    })
  })


})
