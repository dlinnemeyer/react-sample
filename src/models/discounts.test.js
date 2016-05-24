import {assert} from 'chai'
import {Discount, AbstractDiscount, DiscountSet} from './discounts'

describe('Discounts', () => {
  describe('Discount', () => {

    it('should calculate a fixed discount', () => {
      assert.deepEqual({
        type: 'fixed',
        value: 500,
        note: 'blah',
        isFixed: true,
        isPercent: false,
        input: 1300,
        amount: 500,
        output: 800
      }, Discount()({type: 'fixed', value: 500, note: 'blah', input: 1300}))
    })

    it('should calculate a percentage discount', () => {
      assert.deepEqual({
        type: 'percent',
        value: 10,
        note: 'blah',
        isFixed: false,
        isPercent: true,
        input: 1300,
        amount: 130,
        output: 1170
      }, Discount()({type: 'percent', value: 10, note: 'blah', input: 1300}))
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
      }, AbstractDiscount()({type: 'percent', value: 10, note: 'blah'}))
    })
  })

  describe('DiscountSet', () => {

    it('should handle a couple discounts', () => {
      assert.deepEqual({
        input: 1700,
        discounts: [
          {type: 'percent', value: 10, note: 'blah', isFixed: false, isPercent: true,
            input: 1700, amount: 170, output: 1530},
          {type: 'fixed', value: 500, note: 'blah2', isFixed: true, isPercent: false,
            input: 1530, amount: 500, output: 1030}
        ],
        amount: 670,
        output: 1030
      },
      DiscountSet()({
        discounts: [
          {type: 'percent', value: 10, note: 'blah'},
          {type: 'fixed', value: 500, note: 'blah2'}
        ],
        input: 1700
      }))
    })
  })


})

