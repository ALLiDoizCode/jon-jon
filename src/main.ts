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
  
  console.log(chalk.cyan("🔧 Starting Jon Jon's capabilities..."));
  
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
  console.log(chalk.cyan("🎬 Initializing Jon Jon's brain..."));
  globalOrchestrator = new DevelopmentOrchestrator();
  
  // Bootstrap the project
  console.log(chalk.blue("🎉 Jon Jon is ready to build projects!"));
  console.log(chalk.yellow("💡 Try asking Jon Jon to build something!"));
  console.log(chalk.gray("Example commands:"));
  console.log(chalk.gray("• await buildProject('a simple todo app')"));
  console.log(chalk.gray("• await buildProject('an AI chat interface')"));
  console.log(chalk.gray("• await buildProject('a crypto wallet assistant')"));
  await globalOrchestrator.buildProject('create a simple hello world project');
  // Make functions globally available
  (global as any).buildProject = async (description: string) => {
    return await globalOrchestrator.buildProject(description);
  };
  
  (global as any).bootstrap = async () => {
    return await globalOrchestrator.bootstrap();
  };
  
  console.log(chalk.green("\n🚀 Ready! Try: await buildProject('your project description')"));
}

main().catch(error => {
  console.log(chalk.red("❌ Oops! Encountered an error:"), error);
});