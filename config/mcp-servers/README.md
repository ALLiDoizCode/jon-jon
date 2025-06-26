# MCP Server Configuration

## Setup Instructions

### 1. Environment Variables
The MCP servers reference environment variables for security. Never put API keys directly in the configuration files.

**Required Environment Variables:**
```bash
# Copy the example file
cp .env.example .env

# Edit with your actual values
GITHUB_PERSONAL_ACCESS_TOKEN=your_actual_token
ANTHROPIC_API_KEY=your_anthropic_key
```

### 2. GitHub Token Setup
Create a GitHub Personal Access Token:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Required scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
   - `admin:org` (Full control of orgs - only if creating org repos)

### 3. MCP Server Configuration
The `servers.json` file uses environment variable references:
```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": ""
  }
}
```

Claude Code will automatically load environment variables from your `.env` file.

### 4. Security Best Practices
- ✅ Use `.env` files for all secrets
- ✅ Add `.env` to `.gitignore` 
- ✅ Use `.env.example` as a template
- ❌ Never commit actual API keys to version control
- ❌ Never put secrets directly in configuration files

### 5. Troubleshooting
If MCP servers fail to connect:
1. Verify environment variables are set: `echo $GITHUB_PERSONAL_ACCESS_TOKEN`
2. Check token permissions and expiration
3. Ensure `.env` file is in the project root
4. Restart Claude Code after environment changes