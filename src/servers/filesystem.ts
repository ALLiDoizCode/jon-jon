import { FastMCP } from "fastmcp";
import { z } from "zod";
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

const filesystemServer = new FastMCP({
  name: "Jon Jon Filesystem Server",
  version: "1.0.0",
  //@ts-ignore
  description: "Jon Jon's file management capabilities"
});

filesystemServer.addTool({
  name: "create_file",
  description: "Create a file with content",
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
      return `Successfully created ${filepath}! 👍`;
    } catch (error) {
      console.log(chalk.red(`❌ Error creating file: ${error}`));
      throw new Error(`Failed to create file: ${error}`);
    }
  }
});

filesystemServer.addTool({
  name: "read_file",
  description: "Read file contents",
  parameters: z.object({
    filepath: z.string()
  }),
  execute: async ({ filepath }) => {
    try {
      const content = await fs.readFile(filepath, 'utf8');
      console.log(chalk.blue(`📖 Jon Jon read: ${filepath}`));
      return content;
    } catch (error) {
      throw new Error(`Could not read file: ${error}`);
    }
  }
});

export { filesystemServer };