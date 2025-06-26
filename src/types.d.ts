declare module 'mcp-agent' {
  export class Agent {
    constructor(config: {
      name: string;
      instruction: string;
      serverNames: string[];
    });
    run(task: string): Promise<any>;
  }
  
  export class MCPApp {
    constructor(config: {
      name: string;
      version: string;
    });
  }
  
  export class ParallelWorkflow {
    constructor(agents: any[]);
  }
  
  export class OrchestrationWorkflow {
    constructor(config: any);
  }
}

declare module 'simple-git' {
  const simpleGit: any;
  export default simpleGit;
}