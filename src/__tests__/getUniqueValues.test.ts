import { getUniqueValues } from '../helpers/getUniqueValues'
describe('getUniqueValues', () => {
    it('should return an array with unique values', () => {
        const input = [1, 2, 2, 3, 4, 4, 5]
        const output = getUniqueValues(input)
        expect(output).toEqual([1, 2, 3, 4, 5])
    })

    it('should return an empty array if input is empty', () => {
        const input: number[] = []
        const output = getUniqueValues(input)
        expect(output).toEqual([])
    })

    it('should handle arrays with one element', () => {
        const input = [1]
        const output = getUniqueValues(input)
        expect(output).toEqual([1])
    })

    it('should handle arrays with all identical elements', () => {
        const input = [1, 1, 1, 1, 1]
        const output = getUniqueValues(input)
        expect(output).toEqual([1])
    })

    it('should handle large arrays', () => {
        const input = Array.from({ length: 10000 }, (_, i) => i % 100)
        const output = getUniqueValues(input)
        expect(output.length).toBe(100)
    })
})
