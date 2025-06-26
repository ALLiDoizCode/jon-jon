import { DevelopmentOrchestrator } from './agents/orchestrator.js';
import { filesystemServer } from './servers/filesystem.js';
import { gitServer } from './servers/git.js';
import chalk from 'chalk';

// Make orchestrator globally available
let globalOrchestrator: DevelopmentOrchestrator;

async function main() {
  console.log(chalk.blue.bold("\n🤖 ==============================="));
  console.log(chalk.blue.bold("      Jon Jon is Waking Up!"));
  console.log(chalk.blue.bold("🤖 ==============================="));
  
  console.log(chalk.cyan("🔧 Starting capabilities..."));
  
  // Start MCP servers
  filesystemServer.start({ 
    transportType: "stdio" 
  });
  console.log(chalk.green("✅ File management ready!"));
  
  gitServer.start({
    transportType: "stdio"
  });
  console.log(chalk.green("✅ Version control ready!"));

  // Initialize orchestrator
  console.log(chalk.cyan("🎬 Initializing brain..."));
  globalOrchestrator = new DevelopmentOrchestrator();
  
  console.log(chalk.blue("🎉 Ready to build projects!"));
  console.log(chalk.yellow("💡 Try asking to build something!"));
  console.log(chalk.gray("Example commands:"));
  console.log(chalk.gray("• await buildProject('a simple todo app')"));
  console.log(chalk.gray("• await testGitHubSetup()"));
  console.log(chalk.gray("• await buildProjectWithGitHub('AI chat interface', 'my-chat-app')"));
  await globalOrchestrator.buildProject('create just a single file called test.txt with hello world content');
  // Make functions globally available
  (global as any).buildProject = async (description: string) => {
    return await globalOrchestrator.buildProject(description);
  };

  (global as any).buildProjectWithGitHub = async (description: string, projectName: string) => {
    return await globalOrchestrator.buildProjectWithGitHub(description, projectName);
  };

  (global as any).testGitHubSetup = async () => {
    return await globalOrchestrator.testGitHubSetup();
  };
  
  (global as any).bootstrap = async () => {
    return await globalOrchestrator.bootstrap();
  };

  (global as any).testTools = async () => {
    return await globalOrchestrator.testTools();
  };
  
  console.log(chalk.green("\n🚀 Ready! Try: await testGitHubSetup()"));
}

main().catch(error => {
  console.log(chalk.red("❌ Oops! Encountered an error:"), error);
});