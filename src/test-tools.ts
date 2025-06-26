import { ToolRegistry } from 'mcp-agent-typescript';

async function testDirectToolExecution() {
  console.log('🧪 Testing tools directly...');
  
  const toolRegistry = new ToolRegistry();
  
  try {
    // Test write_file tool directly
    console.log('Testing write_file...');
    const result = await toolRegistry.executeTool('write_file', {
      filepath: 'direct-test.txt',
      content: 'This was created by direct tool execution!'
    });
    
    console.log('Write result:', result);
    
    // Test list_directory tool
    console.log('Testing list_directory...');
    const listResult = await toolRegistry.executeTool('list_directory', {
      dirpath: '.'
    });
    
    console.log('List result:', listResult);
    
  } catch (error) {
    console.error('Tool test failed:', error);
  }
}

testDirectToolExecution();