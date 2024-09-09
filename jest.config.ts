import type { Config } from "jest";
import { createDefaultEsmPreset } from 'ts-jest'

const jestConfig: Config = {
        preset: 'ts-jest',
        testEnvironment: 'node',
        roots: ['<rootDir>/__tests__'],
        maxWorkers: 1,
        detectOpenHandles: true,
        displayName: 'type-module',
    ...createDefaultEsmPreset({
        tsconfig: 'tsconfig-esm.json',
    }),
};

export default jestConfig;
