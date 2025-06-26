import { BaseTool, ToolResult } from 'mcp-agent-typescript';
import { z } from 'zod';
import { Octokit } from '@octokit/rest';
import simpleGit from 'simple-git';
import chalk from 'chalk';

const git = simpleGit();

export class CreateGitHubRepoTool extends BaseTool {
  name = 'create_github_repo';
  description = 'Create a new GitHub repository';
  parameters = z.object({
    name: z.string(),
    description: z.string(),
    private: z.boolean().default(false),
    autoInit: z.boolean().default(false),
  });

  async execute(params: any): Promise<ToolResult> {
    const { name, description, private: isPrivate, autoInit } = this.validateParams(params);
    
    try {
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
      });

      console.log(chalk.blue(`🐙 Creating GitHub repository: ${name}`));
      
      const response = await octokit.rest.repos.createForAuthenticatedUser({
        name,
        description,
        private: isPrivate,
        auto_init: autoInit,
      });

      console.log(chalk.green(`✅ Repository created: ${response.data.html_url}`));
      
      return {
        success: true,
        data: {
          url: response.data.html_url,
          cloneUrl: response.data.clone_url,
          sshUrl: response.data.ssh_url,
          name: response.data.name,
        },
        metadata: { repositoryCreated: true }
      };
    } catch (error) {
      console.log(chalk.red(`❌ Failed to create repository: ${error}`));
      return {
        success: false,
        error: `Failed to create GitHub repository: ${this.getErrorMessage(error)}`,
        metadata: { name }
      };
    }
  }
}

export class InitGitRepoTool extends BaseTool {
  name = 'init_git_repo';
  description = 'Initialize git repository and set remote origin';
  parameters = z.object({
    projectPath: z.string(),
    remoteUrl: z.string(),
    initialCommit: z.string().default('Initial commit'),
  });

  async execute(params: any): Promise<ToolResult> {
    const { projectPath, remoteUrl, initialCommit } = this.validateParams(params);
    
    try {
      console.log(chalk.blue(`🔧 Initializing git in: ${projectPath}`));
      
      const projectGit = simpleGit(projectPath);
      
      // Initialize git
      await projectGit.init();
      console.log(chalk.cyan('✅ Git initialized'));
      
      // Add remote origin
      await projectGit.addRemote('origin', remoteUrl);
      console.log(chalk.cyan('✅ Remote origin added'));
      
      // Add all files
      await projectGit.add('.');
      console.log(chalk.cyan('✅ Files staged'));
      
      // Initial commit
      await projectGit.commit(initialCommit);
      console.log(chalk.cyan('✅ Initial commit created'));
      
      // Push to main
      await projectGit.push('origin', 'main', { '--set-upstream': null });
      console.log(chalk.green('✅ Code pushed to GitHub'));
      
      return {
        success: true,
        data: {
          projectPath,
          remoteUrl,
          commit: initialCommit,
        },
        metadata: { gitInitialized: true, pushed: true }
      };
    } catch (error) {
      console.log(chalk.red(`❌ Git setup failed: ${error}`));
      return {
        success: false,
        error: `Failed to setup git: ${this.getErrorMessage(error)}`,
        metadata: { projectPath, remoteUrl }
      };
    }
  }
}

export class CreateGitHubWorkflowTool extends BaseTool {
  name = 'create_github_workflow';
  description = 'Create GitHub Actions workflow file';
  parameters = z.object({
    projectPath: z.string(),
    workflowName: z.string(),
    workflowType: z.enum(['node', 'react', 'python', 'custom']),
    customWorkflow: z.string().optional(),
  });

  async execute(params: any): Promise<ToolResult> {
    const { projectPath, workflowName, workflowType, customWorkflow } = this.validateParams(params);
    
    try {
      console.log(chalk.blue(`⚙️ Creating GitHub workflow: ${workflowName}`));
      
      let workflowContent = '';
      
      switch (workflowType) {
        case 'node':
          workflowContent = this.getNodeWorkflow(workflowName);
          break;
        case 'react':
          workflowContent = this.getReactWorkflow(workflowName);
          break;
        case 'python':
          workflowContent = this.getPythonWorkflow(workflowName);
          break;
        case 'custom':
          workflowContent = customWorkflow || this.getNodeWorkflow(workflowName);
          break;
      }
      
      const workflowPath = `${projectPath}/.github/workflows/${workflowName}.yml`;
      
      // Create .github/workflows directory
      const fs = await import('fs/promises');
      await fs.mkdir(`${projectPath}/.github/workflows`, { recursive: true });
      
      // Write workflow file
      await fs.writeFile(workflowPath, workflowContent, 'utf-8');
      
      console.log(chalk.green(`✅ Workflow created: ${workflowPath}`));
      
      return {
        success: true,
        data: {
          workflowPath,
          workflowName,
          workflowType,
        },
        metadata: { workflowCreated: true }
      };
    } catch (error) {
      console.log(chalk.red(`❌ Failed to create workflow: ${error}`));
      return {
        success: false,
        error: `Failed to create GitHub workflow: ${this.getErrorMessage(error)}`,
        metadata: { projectPath, workflowName }
      };
    }
  }

  private getNodeWorkflow(name: string): string {
    return `name: ${name}

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build project
      run: npm run build
`;
  }

  private getReactWorkflow(name: string): string {
    return `name: ${name}

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    
    - name: Build for production
      run: npm run build
    
    - name: Deploy to GitHub Pages
      if: github.ref == 'refs/heads/main'
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
`;
  }

  private getPythonWorkflow(name: string): string {
    return `name: ${name}

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        python-version: [3.9, 3.10, 3.11]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Python \${{ matrix.python-version }}
      uses: actions/setup-python@v4
      with:
        python-version: \${{ matrix.python-version }}
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    
    - name: Run tests
      run: |
        python -m pytest
`;
  }
}