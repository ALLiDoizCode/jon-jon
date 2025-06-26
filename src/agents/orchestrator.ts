import { Agent, AugmentedLLM, OpenAIProvider } from 'mcp-agent-typescript';
import chalk from 'chalk';
import 'dotenv/config';

export class DevelopmentOrchestrator {
  private llm: AugmentedLLM;
  private agents: Map<string, Agent> = new Map();

  constructor() {
    const provider = new OpenAIProvider({
      apiKey: process.env.OPENAI_API_KEY!,
      model: 'gpt-4',
      temperature: 0.7,
    });

    this.llm = new AugmentedLLM(provider);
    this.printWelcome();
    this.initializeAgents();
  }

  private printWelcome() {
    console.log(chalk.blue("🤖 Hey there! Development team is starting up!"));
    console.log(chalk.green("👋 I'm going to be your friendly AI wallet assistant"));
    console.log(chalk.yellow("🚀 Let's build something amazing together!\n"));
  }

  private initializeAgents() {
    const setupAgent = new Agent({
      name: "setup_agent",
      instructions: `
      You are an autonomous development assistant! You have these tools:
      
      TOOL USAGE - Use these exact formats:
      - To run shell commands: Call shell_command tool
      - To create files: Call write_file tool  
      - To read files: Call read_file tool
      - To list directories: Call list_directory tool
      
      DO NOT use JSON format or describe the tools - just USE them directly!
      
      Your job: Actually build projects by using the tools to create real files and directories.
    `,
      llm: this.llm,
      tools: ["write_file", "read_file", "list_directory", "shell_command"],
      maxIterations: 15
    });

    this.agents.set("setup", setupAgent);
  }

  async testTools() {
    console.log(chalk.blue("🧪 Testing tool execution...\n"));

    const result = await this.agents.get("setup")?.run(`
      Test that tools actually work by executing these steps:
      
      1. Create a test directory called "tool-test" using shell_command
      2. Create a test file "tool-test/test.txt" with content "This is a test!" using write_file
      3. List the tool-test contents using list_directory
      4. Read the file back using read_file to verify it exists
      
      Actually execute each step and show me the results!
    `);

    console.log(chalk.cyan("\n📋 AGENT RESPONSE:"));
    console.log(chalk.white(result || "No response"));

    console.log(chalk.green("\n✅ Tool test complete!"));

    // Manual verification
    console.log(chalk.cyan("\n🔍 Manual verification:"));
    try {
      const fs = await import('fs/promises');

      // Check if directory exists
      try {
        const stats = await fs.stat('tool-test');
        console.log(chalk.green("✅ tool-test directory exists"));

        // Check directory contents
        const files = await fs.readdir('tool-test');
        console.log(chalk.blue(`📁 tool-test contains: ${files.join(', ')}`));

        // Check if test.txt exists
        if (files.includes('test.txt')) {
          const content = await fs.readFile('tool-test/test.txt', 'utf-8');
          console.log(chalk.green(`✅ test.txt exists with content: "${content}"`));
        } else {
          console.log(chalk.red("❌ test.txt not found"));
        }

      } catch (error) {
        console.log(chalk.red("❌ tool-test directory not found"));
      }

    } catch (error) {
      console.log(chalk.red("Error during verification:", error));
    }

    return result;
  }

  async bootstrap() {
    console.log(chalk.blue("🚀 Bootstrap process starting!\n"));

    const setupResult = await this.agents.get("setup")?.run(`
      Initialize basic development environment:
      1. List current directory contents using list_directory
      2. Create a simple test file called "bootstrap-test.txt" using write_file
      3. Show me what was created using list_directory again
      
      Actually execute these steps!
    `);

    console.log(chalk.cyan("\n📋 BOOTSTRAP RESPONSE:"));
    console.log(chalk.white(setupResult || "No response"));

    console.log(chalk.green("\n✅ Bootstrap complete!"));
    return { setupResult };
  }

  async buildProject(description: string) {
    console.log(chalk.blue(`🚀 Starting autonomous build: ${description}\n`));

    const result = await this.agents.get("setup")?.run(`
      Build this project: ${description}
      
      STEP-BY-STEP EXECUTION:
      1. Create project directory using shell_command
      2. Create package.json using write_file
      3. Create tsconfig.json using write_file  
      4. Create source files using write_file
      5. Use list_directory to show what was created
      
      ACTUALLY EXECUTE EACH STEP - don't just plan it!
      
      Start building: ${description}
    `);

    console.log(chalk.cyan("\n📋 AGENT RESPONSE:"));
    console.log(chalk.white(result || "No response"));

    console.log(chalk.green("\n✅ Agent finished!"));
    return result;
  }
}