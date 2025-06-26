import { FastMCP } from "fastmcp";
import { z } from "zod";
import simpleGit from 'simple-git';
import chalk from 'chalk';

const git = simpleGit();
const gitServer = new FastMCP({
  name: "Jon Jon Git Server", 
  version: "1.0.0",
  //@ts-ignore
  description: "Jon Jon's version control capabilities"
});

gitServer.addTool({
  name: "commit",
  description: "Commit changes with a message",
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
      console.log(chalk.green(`🎉 Committed: ${message}`));
      return `Committed successfully: "${message}" (${result.commit})`;
    } catch (error) {
      throw new Error(`Git commit failed: ${error}`);
    }
  }
});

export { gitServer };