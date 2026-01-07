/**
 * GitHub Issue Posting Test Suite
 *
 * Tests for supervisor/github.ts
 */

import {
  isGhAvailable,
  getDefaultRepo,
  createRunlogIssue,
  createApprovalIssue,
  addIssueComment,
  closeIssue,
  checkApproval,
} from '../../src/proxy-mcp/supervisor/github';
import { SupervisorState, ExecutionPlan } from '../../src/proxy-mcp/supervisor/types';

// Mock execSync
jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

import { execSync } from 'child_process';

const mockExecSync = execSync as jest.Mock;

describe('GitHub Issue Posting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isGhAvailable', () => {
    it('should return true when gh CLI is available', () => {
      mockExecSync.mockReturnValue('gh version 2.0.0');
      expect(isGhAvailable()).toBe(true);
    });

    it('should return false when gh CLI is not available', () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('gh not found');
      });
      expect(isGhAvailable()).toBe(false);
    });
  });

  describe('getDefaultRepo', () => {
    it('should return repo from git remote URL (HTTPS)', () => {
      mockExecSync.mockReturnValue('https://github.com/owner/repo.git\n');
      expect(getDefaultRepo()).toBe('owner/repo');
    });

    it('should return repo from git remote URL (SSH)', () => {
      mockExecSync.mockReturnValue('git@github.com:owner/repo.git\n');
      expect(getDefaultRepo()).toBe('owner/repo');
    });

    it('should return null when not in a git repo', () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('not a git repo');
      });
      expect(getDefaultRepo()).toBeNull();
    });

    it('should return null when remote URL is not GitHub', () => {
      mockExecSync.mockReturnValue('https://gitlab.com/owner/repo.git\n');
      expect(getDefaultRepo()).toBeNull();
    });
  });

  describe('createRunlogIssue', () => {
    const mockState: SupervisorState = {
      runId: 'run-test-123',
      input: 'Test input for supervisor',
      step: 'ingest',
      requiresApproval: false,
      refIds: [],
      timestamps: {
        started: '2024-01-01T00:00:00Z',
      },
    };

    it('should return null when gh CLI is not available', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('gh not found');
      });
      const result = await createRunlogIssue(mockState);
      expect(result).toBeNull();
    });

    it('should create issue and return issue number', async () => {
      mockExecSync
        .mockReturnValueOnce('gh version 2.0.0') // isGhAvailable
        .mockReturnValueOnce('https://github.com/owner/repo.git') // getDefaultRepo
        .mockReturnValueOnce('https://github.com/owner/repo/issues/42'); // gh issue create

      const result = await createRunlogIssue(mockState);
      expect(result).toBe(42);
    });

    it('should use provided repo instead of detecting', async () => {
      mockExecSync
        .mockReturnValueOnce('gh version 2.0.0') // isGhAvailable
        .mockReturnValueOnce('https://github.com/custom/repo/issues/100'); // gh issue create

      const result = await createRunlogIssue(mockState, 'custom/repo');
      expect(result).toBe(100);
      // Verify gh issue create was called with custom repo
      const calls = mockExecSync.mock.calls;
      const createCall = calls.find(call => call[0].includes('gh issue create'));
      expect(createCall[0]).toContain('--repo custom/repo');
    });
  });

  describe('createApprovalIssue', () => {
    const mockState: SupervisorState = {
      runId: 'run-approval-456',
      input: 'Dangerous operation requiring approval',
      step: 'approval',
      requiresApproval: true,
      refIds: [],
      timestamps: {
        started: '2024-01-01T00:00:00Z',
      },
    };

    const mockPlan: ExecutionPlan = {
      steps: [
        { id: '1', action: 'delete', target: '/important/file.txt', risk: 'high' },
      ],
      estimatedRisk: 'high',
      requiresApproval: true,
      approvalReason: 'Dangerous file deletion',
    };

    it('should return null when gh CLI is not available', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('gh not found');
      });
      const result = await createApprovalIssue(mockState, mockPlan);
      expect(result).toBeNull();
    });

    it('should create approval issue with approval-required label', async () => {
      mockExecSync
        .mockReturnValueOnce('gh version 2.0.0') // isGhAvailable
        .mockReturnValueOnce('https://github.com/owner/repo.git') // getDefaultRepo
        .mockReturnValueOnce('https://github.com/owner/repo/issues/99'); // gh issue create

      const result = await createApprovalIssue(mockState, mockPlan);
      expect(result).toBe(99);

      // Verify label was added
      const calls = mockExecSync.mock.calls;
      const createCall = calls.find(call => call[0].includes('gh issue create'));
      expect(createCall[0]).toContain('--label');
      expect(createCall[0]).toContain('approval-required');
    });
  });

  describe('addIssueComment', () => {
    it('should return false when gh CLI is not available', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('gh not found');
      });
      const result = await addIssueComment(42, 'Test comment');
      expect(result).toBe(false);
    });

    it('should add comment and return true', async () => {
      mockExecSync
        .mockReturnValueOnce('gh version 2.0.0') // isGhAvailable
        .mockReturnValueOnce('https://github.com/owner/repo.git') // getDefaultRepo
        .mockReturnValueOnce(''); // gh issue comment

      const result = await addIssueComment(42, 'Test comment');
      expect(result).toBe(true);
    });
  });

  describe('closeIssue', () => {
    it('should return false when gh CLI is not available', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('gh not found');
      });
      const result = await closeIssue(42);
      expect(result).toBe(false);
    });

    it('should close issue and return true', async () => {
      mockExecSync
        .mockReturnValueOnce('gh version 2.0.0') // isGhAvailable
        .mockReturnValueOnce('https://github.com/owner/repo.git') // getDefaultRepo
        .mockReturnValueOnce(''); // gh issue close

      const result = await closeIssue(42);
      expect(result).toBe(true);
    });

    it('should add comment before closing when provided', async () => {
      mockExecSync
        .mockReturnValueOnce('gh version 2.0.0') // isGhAvailable - for closeIssue
        .mockReturnValueOnce('https://github.com/owner/repo.git') // getDefaultRepo - for closeIssue
        .mockReturnValueOnce('gh version 2.0.0') // isGhAvailable - for addIssueComment
        .mockReturnValueOnce('https://github.com/owner/repo.git') // getDefaultRepo - for addIssueComment
        .mockReturnValueOnce('') // gh issue comment
        .mockReturnValueOnce(''); // gh issue close

      const result = await closeIssue(42, 'Closing comment');
      expect(result).toBe(true);

      // Verify comment was added
      const calls = mockExecSync.mock.calls;
      const commentCall = calls.find(call => call[0].includes('gh issue comment'));
      expect(commentCall).toBeDefined();
    });
  });

  describe('checkApproval', () => {
    it('should return not approved when gh CLI is not available', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('gh not found');
      });
      const result = await checkApproval(42);
      expect(result.approved).toBe(false);
    });

    it('should return approved when issue has approved label', async () => {
      mockExecSync
        .mockReturnValueOnce('gh version 2.0.0') // isGhAvailable
        .mockReturnValueOnce('https://github.com/owner/repo.git') // getDefaultRepo
        .mockReturnValueOnce('approved\nbug'); // gh issue view --json labels

      const result = await checkApproval(42);
      expect(result.approved).toBe(true);
    });

    it('should return approved with approver when APPROVE comment found', async () => {
      mockExecSync
        .mockReturnValueOnce('gh version 2.0.0') // isGhAvailable
        .mockReturnValueOnce('https://github.com/owner/repo.git') // getDefaultRepo
        .mockReturnValueOnce('bug\nenhancement') // gh issue view --json labels (no approved)
        .mockReturnValueOnce('reviewer: APPROVE'); // gh issue view --json comments

      const result = await checkApproval(42);
      expect(result.approved).toBe(true);
      expect(result.approvedBy).toBe('reviewer');
    });

    it('should return rejected when REJECT comment found', async () => {
      mockExecSync
        .mockReturnValueOnce('gh version 2.0.0') // isGhAvailable
        .mockReturnValueOnce('https://github.com/owner/repo.git') // getDefaultRepo
        .mockReturnValueOnce('bug') // gh issue view --json labels
        .mockReturnValueOnce('manager: REJECT'); // gh issue view --json comments

      const result = await checkApproval(42);
      expect(result.approved).toBe(false);
      expect(result.rejectedBy).toBe('manager');
    });
  });
});

describe('i18n Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.TAISUN_LOCALE;
  });

  it('should use Japanese by default', async () => {
    mockExecSync
      .mockReturnValueOnce('gh version 2.0.0')
      .mockReturnValueOnce('https://github.com/owner/repo.git')
      .mockReturnValueOnce('https://github.com/owner/repo/issues/1');

    const mockState: SupervisorState = {
      runId: 'run-i18n-test',
      input: 'Test',
      step: 'ingest',
      requiresApproval: false,
      refIds: [],
      timestamps: { started: '2024-01-01T00:00:00Z' },
    };

    await createRunlogIssue(mockState);

    // Verify Japanese template was used
    const calls = mockExecSync.mock.calls;
    const createCall = calls.find(call => call[0].includes('gh issue create'));
    // The body should contain Japanese text (from i18n template)
    expect(createCall[0]).toContain('[SUPERVISOR]');
  });

  it('should use English when TAISUN_LOCALE=en', async () => {
    process.env.TAISUN_LOCALE = 'en';

    mockExecSync
      .mockReturnValueOnce('gh version 2.0.0')
      .mockReturnValueOnce('https://github.com/owner/repo.git')
      .mockReturnValueOnce('https://github.com/owner/repo/issues/1');

    const mockState: SupervisorState = {
      runId: 'run-i18n-test-en',
      input: 'Test',
      step: 'ingest',
      requiresApproval: false,
      refIds: [],
      timestamps: { started: '2024-01-01T00:00:00Z' },
    };

    await createRunlogIssue(mockState);

    const calls = mockExecSync.mock.calls;
    const createCall = calls.find(call => call[0].includes('gh issue create'));
    expect(createCall[0]).toContain('[SUPERVISOR]');
  });
});
