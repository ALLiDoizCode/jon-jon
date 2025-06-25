import { FastMCP } from "fastmcp";
import { z } from "zod";
import simpleGit from 'simple-git';
import chalk from 'chalk';

const git = simpleGit();
const gitServer = new FastMCP({
  name: "Jon Jon Git Operations Server", 
  version: "1.0.0",
  //@ts-ignore
  description: "Jon Jon's friendly git management"
});

gitServer.addTool({
  name: "commit",
  description: "Jon Jon commits changes with a friendly message",
  parameters: z.object({
    message: z.string(),
    files: z.array(z.string()).optional()
  }),
  execute: async ({ message, files }) => {
    try {
      if (files && files.length > 0) {
        await git.add(files);
      } else {
        await git.add('.');
      }
      
      const result = await git.commit(`🤖 Jon Jon: ${message}`);
      console.log(chalk.green(`🎉 Jon Jon committed: ${message}`));
      return `Awesome! Jon Jon committed your changes: "${message}" (${result.commit})`;
    } catch (error) {
      console.log(chalk.red(`❌ Jon Jon git commit failed: ${error}`));
      throw new Error(`Oops! Jon Jon couldn't commit that: ${error}`);
    }
  }
});

export { gitServer };