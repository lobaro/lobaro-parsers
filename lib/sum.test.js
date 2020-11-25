/**
 * Unit test for minimal lib to demonstrate testing.
 */

const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
    expect(sum.sum(1, 2)).toBe(3);
});
