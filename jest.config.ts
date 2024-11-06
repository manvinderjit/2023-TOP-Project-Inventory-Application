import type { Config } from "jest";
import { createJsWithTsEsmPreset, } from 'ts-jest'

const jestConfig: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/__tests__'],
    maxWorkers: 1,
    detectOpenHandles: true,
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    displayName: 'js-with-ts',
    ...createJsWithTsEsmPreset({
        tsconfig: 'tsconfig-esm.json',
    }),
};

export default jestConfig;
