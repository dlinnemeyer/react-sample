import {assert} from 'chai'
import {Tax, AbstractTax, TaxSet} from './taxes'

describe('Taxes', () => {
  describe('Tax', () => {

    it('should calculate a basic tax rate', () => {
      assert.deepEqual(Tax({name: 'blah', rate: 7.5, input: 1012}), {
        name: 'blah',
        rate: 7.5,
        input: 1012,
        taxable: 1012,
        amount: 76,
        output: 1088,
      })
    })

    it('should calculate a tax rate where taxable and input are different', () => {
      assert.deepEqual({
        name: 'blah2',
        rate: 8.345,
        input: 1200,
        taxable: 1012,
        amount: 84,
        output: 1284,
      }, Tax({name: 'blah2', rate: 8.345, input: 1200, taxable: 1012}))
    })
  })

  describe('AbstractTax', () => {

    it('should work?', () => {
      assert.deepEqual({
        name: 'blah3',
        rate: 10.12
      }, AbstractTax({name: 'blah3', rate: 10.12}))
    })
  })

  describe('TaxSet', () => {

    it('should handle an empty taxes list', () => {
      assert.deepEqual(TaxSet({taxes: [], input: 1250}), {
        input: 1250,
        taxable: 1250,
        taxes: [],
        amount: 0,
        rate: 0,
        output: 1250
      })
    })

    it('should handle a couple taxes', () => {
      assert.deepEqual({
        input: 1350,
        taxable: 1350,
        taxes: [
          {name: 'first', rate: 8.25, input: 1350, taxable: 1350, amount: 111, output: 1461},
          {name: 'second', rate: 5.35, input: 1461, taxable: 1350, amount: 72, output: 1533},
        ],
        amount: 183,
        output: 1533,
        rate: (183 / 1350) * 100
      },
      TaxSet({
        taxes: [
          {type: 'first', rate: 8.25, name: 'first'},
          {type: 'second', rate: 5.35, name: 'second'}
        ],
        input: 1350
      }))
    })
  })


})


