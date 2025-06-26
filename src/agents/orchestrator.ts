import { Agent, AugmentedLLM, OpenAIProvider } from 'mcp-agent-typescript';
import chalk from 'chalk';
import 'dotenv/config';

export class DevelopmentOrchestrator {
  private llm: AugmentedLLM;
  private agents: Map<string, Agent> = new Map();

  constructor() {
    // Fix the environment variable type checking
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required. Please add it to your .env file.');
    }

    const provider = new OpenAIProvider({
      apiKey: apiKey,  // Now TypeScript knows it's a string
      model: 'gpt-4',
      temperature: 0.7,
    });
    
    this.llm = new AugmentedLLM(provider);
    this.printWelcome();
    this.initializeAgents();
  }

  private printWelcome() {
    console.log(chalk.blue("🤖 Hey there! Development team is starting up!"));
    console.log(chalk.green("👋 Ready to build projects with GitHub integration"));
    console.log(chalk.yellow("🚀 Let's build something amazing together!\n"));
  }

  private initializeAgents() {
    const setupAgent = new Agent({
      name: "setup_agent",
      instructions: `
        You are an autonomous development assistant!
        
        Your tools:
        - write_file: Create files with content
        - read_file: Read existing files  
        - list_directory: List directory contents
        - shell_command: Run shell commands
        
        For GitHub integration, use shell commands:
        - Create repos with: gh repo create <name> --public/--private
        - Initialize git with: git init, git add ., git commit, git push
        - Use the gh CLI tool for GitHub operations
        
        Your job: Build complete projects and use git/GitHub via shell commands!
      `,
      llm: this.llm,
      tools: ["write_file", "read_file", "list_directory", "shell_command"],
      maxIterations: 20
    });

    this.agents.set("setup", setupAgent);
  }

  async testGitHubSetup() {
    console.log(chalk.blue("🧪 Testing GitHub setup...\n"));
    
    const result = await this.agents.get("setup")?.run(`
      Test GitHub integration by checking what's available:
      
      1. Check if git is installed: shell_command with "git --version"
      2. Check if GitHub CLI is installed: shell_command with "gh --version"
      3. Check if GITHUB_TOKEN works: shell_command with "gh auth status"
      4. List current directory: list_directory
      
      Execute each step and tell me what's available!
    `);

    console.log(chalk.cyan("\n📋 GITHUB SETUP TEST:"));
    console.log(chalk.white(result || "No response"));
    
    console.log(chalk.green("\n✅ GitHub setup test complete!"));
    return result;
  }

  async buildProjectWithGitHub(description: string, projectName: string) {
    console.log(chalk.blue(`🚀 Building project with GitHub: ${description}\n`));
    
    const result = await this.agents.get("setup")?.run(`
      Build this project with GitHub integration: ${description}
      Project name: ${projectName}
      
      STEP BY STEP:
      1. Create project directory: shell_command "mkdir ${projectName}"
      2. Create all project files using write_file
      3. Initialize git: shell_command "cd ${projectName} && git init"
      4. Create GitHub repo: shell_command "cd ${projectName} && gh repo create ${projectName} --public --source=. --remote=origin --push"
      5. Add files and commit: shell_command "cd ${projectName} && git add . && git commit -m 'Initial commit'"
      6. Push to GitHub: shell_command "cd ${projectName} && git push -u origin main"
      
      Use actual shell commands to do GitHub operations!
      Project: ${description}
    `);

    console.log(chalk.cyan("\n📋 AGENT RESPONSE:"));
    console.log(chalk.white(result || "No response"));
    
    console.log(chalk.green("\n✅ Project with GitHub complete!"));
    return result;
  }

  async buildProject(description: string) {
    console.log(chalk.blue(`🚀 Starting autonomous build: ${description}\n`));
    
    const result = await this.agents.get("setup")?.run(`
      Build this project: ${description}
      
      Create a complete project with proper structure and code.
      Use your tools to actually create all files and directories.
    `);

    console.log(chalk.cyan("\n📋 AGENT RESPONSE:"));
    console.log(chalk.white(result || "No response"));
    
    console.log(chalk.green("\n✅ Project complete!"));
    return result;
  }

  async testTools() {
    console.log(chalk.blue("🧪 Testing basic tools...\n"));
    
    const result = await this.agents.get("setup")?.run(`
      Test basic tools:
      1. Create a test directory called "tool-test"
      2. Create a test file "tool-test/hello.txt" with content "Hello World!"
      3. List the directory contents
      4. Read the file back
      
      Execute each step!
    `);

    console.log(chalk.cyan("\n📋 AGENT RESPONSE:"));
    console.log(chalk.white(result || "No response"));
    
    console.log(chalk.green("\n✅ Tool test complete!"));
    return result;
  }

  async bootstrap() {
    console.log(chalk.blue("🚀 Bootstrap process...\n"));
    
    const setupResult = await this.agents.get("setup")?.run(`
      Initialize development environment:
      1. List current directory
      2. Create bootstrap test file
      3. Check git and GitHub CLI availability
      
      Execute these steps!
    `);

    console.log(chalk.cyan("\n📋 BOOTSTRAP RESPONSE:"));
    console.log(chalk.white(setupResult || "No response"));
    
    console.log(chalk.green("\n✅ Bootstrap complete!"));
    return { setupResult };
  }
}