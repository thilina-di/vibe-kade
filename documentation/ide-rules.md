# IDE Rules and Development Guidelines

## Overview
This document outlines the IDE rules and development guidelines for the project following the go-vibe methodology.

## IDE Configuration
- Use Cursor as the primary IDE
- Enable AI-assisted development features
- Configure auto-formatting on save

## Code Organization
### Directory Structure
```
project-root/
├── documentation/    # Project documentation
├── src/             # Source code
└── tests/           # Test files
```

## Coding Standards
### General Guidelines
- Follow clean code principles
- Use meaningful variable and function names
- Keep functions small and focused
- Document complex logic with comments

### File Naming Conventions
- Use kebab-case for file names
- Use PascalCase for component names
- Use camelCase for variables and functions

### Code Formatting
- Use consistent indentation (spaces/tabs)
- Maximum line length: 80 characters
- Use trailing commas in multi-line objects/arrays

## Documentation Guidelines
### Markdown Standards
- Use proper heading hierarchy
- Include code examples in code blocks
- Keep documentation up to date with code changes

### Required Documentation
- README.md for each major component
- API documentation for public interfaces
- Architecture decision records (ADRs)

## AI-Assisted Development Guidelines
### Prompt Engineering
- Include relevant documentation context in prompts
- Specify architectural constraints
- Reference existing patterns and conventions

### Code Review Process
- Verify AI-generated code against documentation
- Ensure architectural consistency
- Update documentation for approved changes

## Version Control
### Git Practices
- Use meaningful commit messages
- Follow conventional commits format
- Keep commits focused and atomic

## Security Guidelines
- No sensitive information in code or documentation
- Follow security best practices
- Regular security reviews

## Quality Assurance
- Write unit tests for new features
- Maintain test coverage standards
- Perform code reviews

## Continuous Integration/Deployment
- Automated testing
- Linting checks
- Documentation validation 