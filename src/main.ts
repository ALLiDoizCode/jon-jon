import { DevelopmentOrchestrator } from './agents/orchestrator.js';
import { filesystemServer } from './servers/filesystem.js';
import { gitServer } from './servers/git.js';
import chalk from 'chalk';

async function main() {
  console.log(chalk.blue.bold("\n🤖 ==============================="));
  console.log(chalk.blue.bold("   Welcome to Jon Jon's World!"));
  console.log(chalk.blue.bold("🤖 ===============================\n"));
  
  console.log(chalk.green("👋 Hey there! Jon Jon's development team is booting up..."));
  console.log(chalk.yellow("🚀 Getting ready to build your friendly AI wallet assistant!\n"));
  
  // Start MCP servers
  console.log(chalk.cyan("🔧 Starting Jon Jon's MCP servers..."));
  
  filesystemServer.start({ 
    transportType: "stdio" 
  });
  console.log(chalk.green("✅ Jon Jon's filesystem server is ready!"));
  
  gitServer.start({
    transportType: "stdio"
  });
  console.log(chalk.green("✅ Jon Jon's git server is ready!"));

  // Initialize orchestrator
  console.log(chalk.cyan("\n🎬 Initializing Jon Jon's development orchestrator..."));
  const orchestrator = new DevelopmentOrchestrator();
  
  // Bootstrap the project
  console.log(chalk.blue("\n🚀 Jon Jon is starting his autonomous development workflow!\n"));
  await orchestrator.bootstrap();
  
  console.log(chalk.green.bold("\n🎉 Jon Jon is coming to life!"));
}

main().catch(error => {
  console.log(chalk.red("❌ Oops! Jon Jon encountered an error:"), error);
});