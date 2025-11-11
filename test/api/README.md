# API Integration Tests

This directory contains comprehensive integration and end-to-end tests for the Saving Grains API endpoints.

## Test Files

### `wallet-topup-request.post.test.ts`

**Task**: Task 0.4 - POST /api/wallet-topup-request - Auto-approve for admin/paymaster

**Test Coverage**: 29 tests covering all aspects of wallet top-up request creation

#### Test Categories:

1. **Regular User Flow (4 tests)**

   - Creates pending requests without wallet deduction
   - Validates optional fields (reason)
   - Verifies reviewed_by/reviewed_at are not set

2. **Admin Auto-Approval (4 tests)**

   - Creates approved requests with automatic wallet deduction
   - Verifies wallet transactions (app wallet → user balance)
   - Sets reviewed_by and reviewed_at automatically
   - Handles multiple concurrent admin requests

3. **Paymaster Auto-Approval (3 tests)**

   - Same auto-approval behavior as admin
   - Verifies wallet crediting and deduction

4. **Insufficient Funds Handling (4 tests)**

   - Returns 201 with pending status (NOT 400 error)
   - Leaves request in pending state for manual approval later
   - No wallet modifications on failure
   - Includes informational note about auto-approval failure

5. **Validation Errors (6 tests)**

   - Missing amount field
   - Zero amount
   - Negative amount
   - Non-numeric amount
   - Missing auth token (401)
   - Non-existent user (404)

6. **Payment Method Behavior (3 tests)**

   - payment_method is null at creation
   - Applies to both regular and admin/paymaster requests
   - Ignores payment_method if provided in request body

7. **End-to-End Scenarios (3 tests)**

   - Mixed user types creating requests
   - Multiple admins/paymasters with concurrent requests
   - Failed auto-approval followed by successful retry after funding

8. **Atomicity & Transaction Integrity (2 tests)**
   - Ensures atomic wallet updates on success
   - Verifies pending state preservation on failure

## Running Tests

```bash
# Run all tests
npm test

# Run wallet-topup-request tests only
npm test -- wallet-topup-request.post.test.ts

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test:watch
```

## Test Database

Tests use a separate MongoDB test database configured in `test/setup.ts`:

- Connection URI: `mongodb://localhost:27017/saving-grains-test`
- Database is cleaned between each test
- Global setup/teardown handles connection lifecycle

## Key Design Decisions Tested

### 1. Graceful Auto-Approval Failure

When admin/paymaster auto-approval fails (e.g., insufficient funds):

- ✅ Request remains in "pending" state (not deleted)
- ✅ Returns 201 (success) with informational note
- ✅ Allows manual approval later via PUT endpoint
- ✅ Better audit trail and data preservation

### 2. Payment Method Optional at Creation

- ✅ payment_method is null at request creation
- ✅ Set later during manual approval (PUT endpoint)
- ✅ Not required for admin/paymaster auto-approval

### 3. Reason Field Optional

- ✅ Users can create requests without providing a reason
- ✅ Reason field is completely optional

## Test Results

```
Test Suites: 1 passed, 1 total
Tests:       29 passed, 29 total
Snapshots:   0 total
Time:        ~1.3s
```

All tests passing ✅

## Factory Functions

Test utilities in `../factories.ts`:

- `createTestUser()` - Creates regular user
- `createAdminUser()` - Creates admin user
- `createPaymasterUser()` - Creates paymaster user
- `createAppWallet(balance)` - Creates system app wallet
- `createTestWalletRequest()` - Creates wallet request

## Authentication

Tests use JWT tokens generated via `signToken()` helper:

```typescript
const token = signToken({
  id: userId,
  phone_number: "+233501234567",
})
```

## Next Steps

Additional test files to be added:

- `wallet-topup-request.get.test.ts` - List and filter requests (Task 0.X)
- `wallet-topup-request.put.test.ts` - Manual approval/decline (Task 0.5)
- `wallet-topup-request.confirm.test.ts` - Receipt confirmation (Task 0.X)

