import {assert} from 'chai'
import {Payment, PaymentSet} from './payments'

describe('Payments', () => {
  describe('Payment', () => {

    it('should keep meta info', () => {
      assert.deepEqual(Payment({type: 'check', amount: 1753, checkNumber: '178341'}), {
        type: 'check',
        amount: 1753,
        checkNumber: '178341'
      })
    })

  })

  describe('PaymentSet', () => {

    it('should sum up the amounts of the payments', () => {
      assert.deepEqual(PaymentSet({
        payments: [{type: 'credit card', amount: 1700}, {type: 'check', amount: 350}]
      }), {
        payments: [
          {type: 'credit card', amount: 1700},
          {type: 'check', amount: 350}
        ],
        amount: 2050
      })
    })

  })

})
