import { FastMCP } from "fastmcp";
import { z } from "zod";
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

const filesystemServer = new FastMCP({
  name: "Jon Jon Filesystem Server",
  version: "1.0.0",
  //@ts-ignore
  description: "Jon Jon's friendly file management system"
});

filesystemServer.addTool({
  name: "create_file",
  description: "Jon Jon creates a file with content",
  parameters: z.object({
    filepath: z.string(),
    content: z.string(),
    createDirs: z.boolean().optional()
  }),
  execute: async ({ filepath, content, createDirs = true }) => {
    try {
      if (createDirs) {
        await fs.mkdir(path.dirname(filepath), { recursive: true });
      }
      await fs.writeFile(filepath, content, 'utf8');
      console.log(chalk.green(`📝 Jon Jon created: ${filepath}`));
      return `Hey! Jon Jon created ${filepath} for you. Looking good! 👍`;
    } catch (error) {
      console.log(chalk.red(`❌ Jon Jon couldn't create file: ${error}`));
      throw new Error(`Oops! Jon Jon couldn't create that file: ${error}`);
    }
  }
});

export { filesystemServer };