/**
 * Environment Check Utility
 *
 * Checks for common configuration issues and provides helpful advice.
 * P20: Auto-advice feature for beginners
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { t } from '../i18n';

export interface EnvCheckResult {
  name: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
  advice?: string;
}

export interface EnvCheckSummary {
  ok: boolean;
  results: EnvCheckResult[];
  critical: number;
  warnings: number;
}

const MIN_NODE_VERSION = '18.0.0';

/**
 * Compare semver versions
 */
function compareVersions(a: string, b: string): number {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const aVal = aParts[i] || 0;
    const bVal = bParts[i] || 0;
    if (aVal > bVal) return 1;
    if (aVal < bVal) return -1;
  }
  return 0;
}

/**
 * Check if GITHUB_TOKEN is set
 */
export function checkGitHubToken(): EnvCheckResult {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return {
      name: 'GITHUB_TOKEN',
      status: 'error',
      message: 'GITHUB_TOKEN is not set',
      advice: t('env.missing.github_token'),
    };
  }

  // Basic validation
  if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
    return {
      name: 'GITHUB_TOKEN',
      status: 'warning',
      message: 'GITHUB_TOKEN format may be incorrect',
      advice: 'Expected format: ghp_xxxx or github_pat_xxxx',
    };
  }

  return {
    name: 'GITHUB_TOKEN',
    status: 'ok',
    message: 'GITHUB_TOKEN is configured',
  };
}

/**
 * Check if gh CLI is available
 */
export function checkGhCli(): EnvCheckResult {
  try {
    execSync('gh --version', { stdio: 'pipe' });
  } catch {
    return {
      name: 'GitHub CLI',
      status: 'warning',
      message: 'GitHub CLI (gh) is not installed',
      advice: t('env.missing.gh_cli'),
    };
  }

  // Check if logged in
  try {
    const result = execSync('gh auth status 2>&1', { encoding: 'utf8', stdio: 'pipe' });
    if (result.includes('Logged in')) {
      return {
        name: 'GitHub CLI',
        status: 'ok',
        message: 'GitHub CLI is installed and logged in',
      };
    }
  } catch {
    // gh auth status returns non-zero when not logged in
  }

  return {
    name: 'GitHub CLI',
    status: 'warning',
    message: 'GitHub CLI is installed but not logged in',
    advice: t('env.missing.gh_login'),
  };
}

/**
 * Check Node.js version
 */
export function checkNodeVersion(): EnvCheckResult {
  const currentVersion = process.version.replace(/^v/, '');

  if (compareVersions(currentVersion, MIN_NODE_VERSION) < 0) {
    return {
      name: 'Node.js',
      status: 'error',
      message: `Node.js version ${currentVersion} is too old`,
      advice: t('env.missing.node_version', {
        current: currentVersion,
        required: MIN_NODE_VERSION,
      }),
    };
  }

  return {
    name: 'Node.js',
    status: 'ok',
    message: `Node.js ${currentVersion} is installed`,
  };
}

/**
 * Check if required config files exist
 */
export function checkConfigFiles(): EnvCheckResult {
  const configDir = path.join(process.cwd(), 'config', 'proxy-mcp');
  const requiredFiles = ['internal-mcps.json'];
  const missingFiles: string[] = [];

  for (const file of requiredFiles) {
    const filePath = path.join(configDir, file);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file);
    }
  }

  if (missingFiles.length > 0) {
    return {
      name: 'Config Files',
      status: 'warning',
      message: `Missing config files: ${missingFiles.join(', ')}`,
      advice: `Run 'npm run setup' or create the missing files manually.`,
    };
  }

  return {
    name: 'Config Files',
    status: 'ok',
    message: 'All required config files exist',
  };
}

/**
 * Check logging.json configuration for Issue posting
 */
export function checkLoggingConfig(): EnvCheckResult {
  const configPath = path.join(process.cwd(), 'config', 'proxy-mcp', 'logging.json');

  if (!fs.existsSync(configPath)) {
    return {
      name: 'Issue Log Config',
      status: 'warning',
      message: 'logging.json not found',
      advice: t('env.missing.logging_config'),
    };
  }

  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    if (config.issueLogEnabled === false) {
      return {
        name: 'Issue Log Config',
        status: 'warning',
        message: 'Issue logging is disabled in config',
        advice: 'Set "issueLogEnabled": true in config/proxy-mcp/logging.json to enable Issue logging.',
      };
    }

    return {
      name: 'Issue Log Config',
      status: 'ok',
      message: `Issue logging enabled (locale: ${config.issueLogLocale || 'ja'})`,
    };
  } catch (error) {
    return {
      name: 'Issue Log Config',
      status: 'error',
      message: 'Failed to parse logging.json',
      advice: 'Check config/proxy-mcp/logging.json for JSON syntax errors.',
    };
  }
}

/**
 * Check if repository can be identified
 */
export function checkRepository(): EnvCheckResult {
  // Check environment variable first
  const envRepo = process.env.REPOSITORY;
  if (envRepo && envRepo.includes('/')) {
    return {
      name: 'Repository',
      status: 'ok',
      message: `Repository configured: ${envRepo}`,
    };
  }

  // Try to get from git remote
  try {
    const remote = execSync('git remote get-url origin', { encoding: 'utf8', stdio: 'pipe' }).trim();
    const match = remote.match(/github\.com[/:]([\w-]+\/[\w-]+)/);
    if (match) {
      const repo = match[1].replace(/\.git$/, '');
      return {
        name: 'Repository',
        status: 'ok',
        message: `Repository detected from git: ${repo}`,
      };
    }
  } catch {
    // Git command failed
  }

  return {
    name: 'Repository',
    status: 'error',
    message: 'Could not determine repository',
    advice: t('env.missing.repository'),
  };
}

/**
 * Comprehensive Issue posting readiness check
 */
export function checkIssuePostingReadiness(): EnvCheckResult {
  const issues: string[] = [];

  // Check GITHUB_TOKEN
  const tokenResult = checkGitHubToken();
  if (tokenResult.status === 'error') {
    issues.push('GITHUB_TOKEN not set');
  }

  // Check gh CLI
  const ghResult = checkGhCli();
  if (ghResult.status === 'error') {
    issues.push('gh CLI not available');
  } else if (ghResult.status === 'warning' && ghResult.message.includes('not logged in')) {
    issues.push('gh CLI not logged in');
  }

  // Check repository
  const repoResult = checkRepository();
  if (repoResult.status === 'error') {
    issues.push('Repository not identified');
  }

  if (issues.length > 0) {
    return {
      name: 'Issue Posting',
      status: 'error',
      message: `Issue posting not ready: ${issues.join(', ')}`,
      advice: t('env.issue_posting.not_ready'),
    };
  }

  return {
    name: 'Issue Posting',
    status: 'ok',
    message: 'Issue posting is ready',
  };
}

/**
 * Check if .env file exists
 */
export function checkEnvFile(): EnvCheckResult {
  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), '.env.example');

  if (!fs.existsSync(envPath)) {
    const advice = fs.existsSync(envExamplePath)
      ? 'Copy .env.example to .env and fill in the values:\n  cp .env.example .env'
      : 'Create a .env file with required environment variables.';

    return {
      name: '.env File',
      status: 'warning',
      message: '.env file not found',
      advice,
    };
  }

  return {
    name: '.env File',
    status: 'ok',
    message: '.env file exists',
  };
}

/**
 * Check Git configuration
 */
export function checkGitConfig(): EnvCheckResult {
  try {
    // Check if in a git repository
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'pipe' });
  } catch {
    return {
      name: 'Git',
      status: 'error',
      message: 'Not in a Git repository',
      advice: 'Initialize a Git repository with: git init',
    };
  }

  // Check for user configuration
  try {
    execSync('git config user.email', { stdio: 'pipe' });
    execSync('git config user.name', { stdio: 'pipe' });
  } catch {
    return {
      name: 'Git',
      status: 'warning',
      message: 'Git user not configured',
      advice: 'Configure Git user:\n  git config --global user.name "Your Name"\n  git config --global user.email "your@email.com"',
    };
  }

  return {
    name: 'Git',
    status: 'ok',
    message: 'Git is configured',
  };
}

/**
 * Run all environment checks
 */
export function runEnvChecks(): EnvCheckSummary {
  const results: EnvCheckResult[] = [
    checkNodeVersion(),
    checkGitConfig(),
    checkEnvFile(),
    checkGitHubToken(),
    checkGhCli(),
    checkRepository(),
    checkConfigFiles(),
    checkLoggingConfig(),
    checkIssuePostingReadiness(),
  ];

  const critical = results.filter((r) => r.status === 'error').length;
  const warnings = results.filter((r) => r.status === 'warning').length;

  return {
    ok: critical === 0,
    results,
    critical,
    warnings,
  };
}

/**
 * Format environment check results for console output
 */
export function formatEnvCheckResults(summary: EnvCheckSummary): string {
  const lines: string[] = [];

  lines.push('=== Environment Check ===\n');

  for (const result of summary.results) {
    const icon =
      result.status === 'ok' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';

    lines.push(`${icon} ${result.name}: ${result.message}`);

    if (result.advice) {
      lines.push('');
      lines.push(result.advice);
      lines.push('');
    }
  }

  lines.push('\n--- Summary ---');
  if (summary.ok) {
    lines.push('✅ All critical checks passed');
  } else {
    lines.push(`❌ ${summary.critical} critical issue(s) found`);
  }
  if (summary.warnings > 0) {
    lines.push(`⚠️ ${summary.warnings} warning(s)`);
  }

  return lines.join('\n');
}

/**
 * CLI entry point for environment check
 */
export function runDoctor(): void {
  const summary = runEnvChecks();
  console.log(formatEnvCheckResults(summary));
  process.exit(summary.ok ? 0 : 1);
}

// Export for direct execution
if (require.main === module) {
  runDoctor();
}
