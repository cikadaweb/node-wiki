export const getUniqueValues = (mas: number[]): number[] => {
    const uniqueValues = new Set(mas);
    return [...uniqueValues];
};