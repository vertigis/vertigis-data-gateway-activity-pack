[![CI/CD](https://github.com/vertigis/vertigis-data-gateway-activity-pack/workflows/CI/CD/badge.svg)](https://github.com/vertigis/vertigis-data-gateway-activities)
[![npm](https://img.shields.io/npm/v/@vertigis/vertigis-data-gateway-activity-pack)](https://www.npmjs.com/package/@vertigis/vertigis-data-gateway-activity-pack)

# VertiGIS Data Gateway Workflow Activities

A VertiGIS Studio Workflow Activity Pack that provides activities for interacting with the VertiGIS Data Gateway REST API.

## Overview

This activity pack extends VertiGIS Studio Workflow with activities for working with:

- Assignments
- Submissions
- Submission Inputs
- Submission Parameters
- Specification Metadata
- Users

The pack uses OpenAPI-generated TypeScript definitions to provide strongly typed integrations with the VertiGIS Data Gateway API.

---

## Requirements

### Supported Workflow Version

| Package | Version |
|----------|----------|
| @vertigis/workflow | 5.53.0 |
| @vertigis/workflow-sdk | 6.1.1 |

### Development Requirements

- Node.js 20+
- npm 10+
- TypeScript 5+

---

## Installation

Install project dependencies:

```bash
npm install
```

---

## Development

### Start Local Development Server

```bash
npm run start
```

### Build

```bash
npm run build
```

### Generate Activity Metadata

```bash
npm run generate
```

### Lint

```bash
npm run lint
```

### Format

```bash
npm run prettier
```

---

## OpenAPI Type Generation

The project uses openapi-typescript to generate API contracts from the VertiGIS Data Gateway OpenAPI specification.

Generate the latest types:

```bash
npm run generate:api:remote
```

Generated file:

```text
src/api/generated/types.ts
```

Do not manually edit the generated file.

---

## Activity Categories

### VertiGIS Data Gateway- Assignments

- Get Assignment
- Get My Assignments

### VertiGIS Data Gateway- Submissions

- Create Submission
- Create Data Gateway Service
- Get Submission
- Get Submissions
- Start Submission
- Close Submission
- Cancel Submission
- Patch Submission
- Describe Inputs
- Patch Input Parameters
- Upload Input Submission
- Download Submission Output

### VertiGIS Data Gateway- Specifications

- Fetch Specification Fields

### VertiGIS Data Gateway- Users

## Authentication

Data Gateway Service require:

| Input | Description |
|---------|---------|
| baseUrl | Base URL of the VertiGIS Data Gateway environment |
| bearerToken | OAuth bearer token |

---

## Design Principles

### Shared HTTP Client

All activities use:

```ts
DataGatewayClient
```

to centralize:

- Authentication
- Request construction
- Parameter serialization
- Endpoint management

### Generated Types

All API contracts originate from:

```ts
src/api/generated/types.ts
```

Activities should use:

```ts
components["schemas"]
```

and

```ts
operations
```

instead of creating duplicate DTOs.

Example:

```ts
type Submission =
    components["schemas"]["SubmissionDetail"];
```

---

## Building for Deployment

Build the activity pack:

```bash
npm run build
```

Generated output is placed in the build artifacts produced by the Workflow SDK.

Deploy according to your organization's VertiGIS Studio Workflow deployment process.

---

## Contributing

When adding activities:

1. Regenerate OpenAPI types if needed.
2. Use generated contracts from `types.ts`.
3. Add Workflow metadata:
   - `@category`
   - `@defaultName`
   - `@description`
4. Validate required inputs.
5. Keep business logic inside `DataGatewayClient`.
6. Keep activities as thin wrappers.

---

## Versioning

Versioning is managed manually through `package.json`.

If Semantic Release is adopted in the future, updates should be made to:

- package.json
- CI/CD pipeline
- CHANGELOG generation
