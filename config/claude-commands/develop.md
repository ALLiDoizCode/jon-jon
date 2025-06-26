# Development & Deployment Workflow

You are entering **Development & Deployment** mode. Implement features through test-driven development cycles.

## TDD Cycle: Red → Green → Refactor

### Red Phase
- Write failing tests first
- Confirm tests fail as expected
- Define clear acceptance criteria

### Green Phase
- Implement minimal code to pass tests
- Focus on functionality over optimization
- Verify all tests pass

### Refactor Phase
- Optimize and clean up code
- Maintain test coverage
- Update documentation

## Deployment Pipeline
1. **Development**: Feature branches with continuous testing
2. **Staging**: Integration testing and QA validation
3. **Production**: Automated deployment with rollback capability

## Key Actions
1. Analyze existing codebase and tests
2. Write comprehensive test cases
3. Implement features incrementally
4. Run full test suite and linting
5. Deploy to staging environment
6. Validate and deploy to production

## Commands Available
- `npm test` or `pytest` - Run test suite
- `npm run lint` - Code linting and formatting
- `npm run build` - Build for production
- `npm run deploy:staging` - Deploy to staging
- `npm run deploy:prod` - Deploy to production

Focus on incremental, tested, and documented changes.