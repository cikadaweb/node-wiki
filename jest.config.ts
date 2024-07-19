import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node', // Для юнит-тестов
    testMatch: ['**/__tests__/**/*.test.ts', '**/integration-tests/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    setupFilesAfterEnv: ['./jest.setup.ts'],
};

export default config;
