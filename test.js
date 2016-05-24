import {size, omit, pickBy, difference, assign, mapValues} from 'lodash'

const calculate = (o, values) => {
  const calculatedKeys = Object.keys(values)
  const unfinished = omit(o, calculatedKeys)
  if(!size(unfinished)) return values

  const canCalculate = pickBy(unfinished, ([keys]) => difference(keys, calculatedKeys).length == 0)
  console.log(calculatedKeys, unfinished, canCalculate)

  if(!size(canCalculate)) throw new Error("could not finish calculation")

  const newValues = assign({}, values, mapValues(canCalculate, ([, calc]) => calc(values)))
  console.log(newValues)
  return calculate(o, newValues)
}

const multiply = (m1, m2) => {
  return [[m1, m2], o => o[m1] * o[m2]]
}

// something like this for algebraic inference?
// if each function is like this, you can just find a way to concatenate all the results together,
// and you'd have all the "facts" from all the different directions
const add(a1, a2, sum) => {
  return {
    [sum] => [[a1, a2], o => o[a1] + o[a2]],
    [a1] => [[a2, sum], o => o[sum] - o[a2]],
    [a2] => [[a1, sum], o => o[sum] - o[a1]]
  }
}

// TODO: to get this working from any direction, we'd have to allow for multiple
// definitions for each term to cover all angles. you probably would only need to define two
// directions for a couple terms to get that working, but it's still a little laborious.
// The alternative is definitely some sort of alebraic system that's smart enough to work back
// from definitions and infer new definitions, but that sounds really tough.
const Discount = {
  start: [['end', 'discountAmount'], ({end, discountAmount}) => end + discountAmount],
  discountRate: [['start', 'discountAmount'], ({start, discountAmount}) => discountAmount / start],
  discountAmount: [['end', 'discountRate'], ({end, discountRate}) => (end / (1 - discountRate)) * discountRate],
  end: [['start', 'discountAmount'], ({start, discountAmount}) => start - discountAmount]
}


console.log("ANSWER --> ", calculate(Discount, {start: 7, discountRate: 0.3}))
console.log("ANSWER --> ", calculate(Discount, {end: 4.9, discountAmount: 2.1}))
console.log("ANSWER --> ", calculate(Discount, {end: 4.9, discountRate: 0.3}))
