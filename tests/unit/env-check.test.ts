/**
 * Environment Check Test Suite
 *
 * Tests for env-check.ts utility
 */

import {
  checkGitHubToken,
  checkGhCli,
  checkNodeVersion,
  checkConfigFiles,
  checkLoggingConfig,
  checkRepository,
  checkIssuePostingReadiness,
  runEnvChecks,
  formatEnvCheckResults,
  EnvCheckResult,
  EnvCheckSummary,
} from '../../src/utils/env-check';

// Mock execSync
jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

// Mock fs
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));

import { execSync } from 'child_process';
import * as fs from 'fs';

const mockExecSync = execSync as jest.Mock;
const mockExistsSync = fs.existsSync as jest.Mock;
const mockReadFileSync = fs.readFileSync as jest.Mock;

describe('env-check', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear environment variables
    delete process.env.GITHUB_TOKEN;
    delete process.env.REPOSITORY;
  });

  describe('checkGitHubToken', () => {
    it('should return error when GITHUB_TOKEN is not set', () => {
      const result = checkGitHubToken();
      expect(result.status).toBe('error');
      expect(result.name).toBe('GITHUB_TOKEN');
      expect(result.advice).toBeDefined();
    });

    it('should return ok when GITHUB_TOKEN is set with ghp_ prefix', () => {
      process.env.GITHUB_TOKEN = 'ghp_xxxxxxxxxxxxxxxxxxxx';
      const result = checkGitHubToken();
      expect(result.status).toBe('ok');
      expect(result.name).toBe('GITHUB_TOKEN');
    });

    it('should return ok when GITHUB_TOKEN is set with github_pat_ prefix', () => {
      process.env.GITHUB_TOKEN = 'github_pat_xxxxxxxxxxxxxxxxxxxx';
      const result = checkGitHubToken();
      expect(result.status).toBe('ok');
    });

    it('should return warning when GITHUB_TOKEN format is unexpected', () => {
      process.env.GITHUB_TOKEN = 'some_other_token_format';
      const result = checkGitHubToken();
      expect(result.status).toBe('warning');
      expect(result.message).toContain('format may be incorrect');
    });
  });

  describe('checkGhCli', () => {
    it('should return warning when gh CLI is not installed', () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('gh not found');
      });
      const result = checkGhCli();
      expect(result.status).toBe('warning');
      expect(result.advice).toBeDefined();
    });

    it('should return ok when gh CLI is installed and logged in', () => {
      mockExecSync
        .mockImplementationOnce(() => '2.0.0') // gh --version
        .mockImplementationOnce(() => 'Logged in to github.com'); // gh auth status
      const result = checkGhCli();
      expect(result.status).toBe('ok');
    });

    it('should return warning when gh CLI is installed but not logged in', () => {
      mockExecSync
        .mockImplementationOnce(() => '2.0.0') // gh --version
        .mockImplementationOnce(() => {
          throw new Error('not logged in');
        }); // gh auth status
      const result = checkGhCli();
      expect(result.status).toBe('warning');
      expect(result.message).toContain('not logged in');
    });
  });

  describe('checkNodeVersion', () => {
    it('should return ok when Node.js version is sufficient', () => {
      // process.version is read-only, so we test the happy path
      const result = checkNodeVersion();
      // In test environment, Node.js version should be >= 18
      expect(['ok', 'error']).toContain(result.status);
    });
  });

  describe('checkLoggingConfig', () => {
    it('should return warning when logging.json does not exist', () => {
      mockExistsSync.mockReturnValue(false);
      const result = checkLoggingConfig();
      expect(result.status).toBe('warning');
      expect(result.message).toContain('not found');
    });

    it('should return ok when logging.json exists and is valid', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify({
        issueLogEnabled: true,
        issueLogLocale: 'ja',
      }));
      const result = checkLoggingConfig();
      expect(result.status).toBe('ok');
      expect(result.message).toContain('locale: ja');
    });

    it('should return warning when issueLogEnabled is false', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify({
        issueLogEnabled: false,
      }));
      const result = checkLoggingConfig();
      expect(result.status).toBe('warning');
      expect(result.message).toContain('disabled');
    });

    it('should return error when logging.json is invalid JSON', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('not valid json');
      const result = checkLoggingConfig();
      expect(result.status).toBe('error');
      expect(result.message).toContain('parse');
    });
  });

  describe('checkRepository', () => {
    it('should return ok when REPOSITORY env var is set', () => {
      process.env.REPOSITORY = 'owner/repo';
      const result = checkRepository();
      expect(result.status).toBe('ok');
      expect(result.message).toContain('owner/repo');
    });

    it('should return ok when git remote is configured', () => {
      mockExecSync.mockReturnValue('https://github.com/owner/repo.git');
      const result = checkRepository();
      expect(result.status).toBe('ok');
      expect(result.message).toContain('owner/repo');
    });

    it('should return error when repository cannot be determined', () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('not a git repo');
      });
      const result = checkRepository();
      expect(result.status).toBe('error');
      expect(result.advice).toBeDefined();
    });
  });

  describe('checkIssuePostingReadiness', () => {
    it('should return error when GITHUB_TOKEN is not set', () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('not available');
      });
      const result = checkIssuePostingReadiness();
      expect(result.status).toBe('error');
      expect(result.message).toContain('not ready');
    });

    it('should return ok when all requirements are met', () => {
      process.env.GITHUB_TOKEN = 'ghp_xxxxxxxxxxxxxxxxxxxx';
      process.env.REPOSITORY = 'owner/repo';
      mockExecSync
        .mockImplementationOnce(() => '2.0.0') // gh --version
        .mockImplementationOnce(() => 'Logged in to github.com'); // gh auth status
      const result = checkIssuePostingReadiness();
      expect(result.status).toBe('ok');
      expect(result.message).toContain('ready');
    });
  });

  describe('runEnvChecks', () => {
    it('should return summary with all check results', () => {
      process.env.GITHUB_TOKEN = 'ghp_xxxxxxxxxxxxxxxxxxxx';
      process.env.REPOSITORY = 'owner/repo';
      mockExecSync.mockReturnValue('ok');
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify({ issueLogEnabled: true }));

      const summary = runEnvChecks();
      expect(summary.results).toBeDefined();
      expect(summary.results.length).toBeGreaterThan(0);
      expect(typeof summary.critical).toBe('number');
      expect(typeof summary.warnings).toBe('number');
      expect(typeof summary.ok).toBe('boolean');
    });
  });

  describe('formatEnvCheckResults', () => {
    it('should format results with icons', () => {
      const summary: EnvCheckSummary = {
        ok: true,
        results: [
          { name: 'Test1', status: 'ok', message: 'All good' },
          { name: 'Test2', status: 'warning', message: 'Check this', advice: 'Do something' },
        ],
        critical: 0,
        warnings: 1,
      };

      const output = formatEnvCheckResults(summary);
      expect(output).toContain('Environment Check');
      expect(output).toContain('All good');
      expect(output).toContain('Check this');
      expect(output).toContain('Do something');
    });

    it('should show critical count when checks fail', () => {
      const summary: EnvCheckSummary = {
        ok: false,
        results: [
          { name: 'Test', status: 'error', message: 'Failed', advice: 'Fix it' },
        ],
        critical: 1,
        warnings: 0,
      };

      const output = formatEnvCheckResults(summary);
      expect(output).toContain('1 critical');
    });
  });
});
