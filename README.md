# Purchase Return Process Flow

## Overview
The purchase return system follows a structured workflow with proper status tracking and validation. Each stage has specific requirements and transitions.

## Process Flow States

### 1. Draft (DRAFT)
- **Description**: Initial state when creating a purchase return
- **Allowed Actions**: Update, Approve, Cancel
- **Requirements**:
  - Valid purchase ID (must be received)
  - Valid supplier ID
  - Valid warehouse ID
  - Return items with quantities
  - Cannot exceed original purchase quantities

### 2. Approved (APPROVED)
- **Description**: Purchase return has been approved for processing
- **Allowed Actions**: Process, Cancel
- **Requirements**:
  - Must be approved by authorized user
  - Approval notes (optional)
  - Supplier must have a valid chart of account

### 3. Processed (PROCESSED)
- **Description**: Purchase return has been fully processed
- **Allowed Actions**: None (Final state)
- **Requirements**:
  - Inventory quantities adjusted
  - Accounting entries posted
  - Supplier payable reduced

### 4. Cancelled (CANCELLED)
- **Description**: Purchase return has been cancelled
- **Allowed Actions**: None (Final state)
- **Requirements**:
  - Can only be cancelled from Draft or Approved states

## API Endpoints

### Create Purchase Return
```
POST /purchase-returns
```
- Creates a new purchase return in DRAFT status
- Validates against original purchase quantities
- Generates unique return number if not provided

### Get Purchase Returns
```
GET /purchase-returns
GET /purchase-returns/:id
```
- Returns purchase returns with all relations
- Includes status and timestamps for each stage

### Update Purchase Return
```
PATCH /purchase-returns/:id
```
- Only allowed for DRAFT status returns
- Can modify all fields except status

### Approve Purchase Return
```
PATCH /purchase-returns/:id/approve
Body: {
  "approval_notes": "Optional approval notes"
}
```
- Transitions from DRAFT to APPROVED
- Records approver ID and timestamp
- Validates supplier has chart of account

### Process Purchase Return
```
PATCH /purchase-returns/:id/process
Body: {
  "processing_notes": "Optional processing notes"
}
```
- Transitions from APPROVED to PROCESSED
- Updates inventory quantities
- Posts accounting entries
- Records processor ID and timestamp

### Cancel Purchase Return
```
PATCH /purchase-returns/:id/cancel
```
- Transitions from DRAFT or APPROVED to CANCELLED
- Cannot cancel processed returns

## Status Transition Matrix

| From → To     | DRAFT | APPROVED | PROCESSED | CANCELLED |
|---------------|-------|----------|-----------|-----------|
| **DRAFT**     | -     | ✅       | ❌         | ✅         |
| **APPROVED**  | ❌     | -        | ✅         | ✅         |
| **PROCESSED** | ❌     | ❌       | -         | ❌         |
| **CANCELLED** | ❌     | ❌       | ❌         | -         |

## Validation Rules

### Quantity Validation
- Cannot return more items than originally purchased
- Checks against all previously processed returns for the same purchase

### Inventory Validation
- Sufficient inventory must exist before processing
- Inventory is reduced by returned quantities

### Accounting Validation
- Supplier must have an assigned chart of account
- Inventory account is created if not exists

### Permission Validation
- Each endpoint requires specific permissions
- User ID is tracked for audit purposes

## Database Schema Updates

### New Fields Added
- `approved_at`: Timestamp when return was approved
- `approved_by`: User ID who approved the return
- `processed_at`: Timestamp when return was processed
- `processed_by`: User ID who processed the return
- `approval_notes`: Optional notes about approval decision

### Status Enum
Replaced string status with proper enum:
```typescript
enum PurchaseReturnStatus {
  DRAFT = 'draft',
  APPROVED = 'approved',
  PROCESSED = 'processed',
  CANCELLED = 'cancelled',
}
```

## Error Handling

Common error scenarios:
- **Invalid Status Transition**: Attempting to process without approval
- **Insufficient Inventory**: Not enough items to return
- **Missing Supplier Account**: Supplier lacks chart of account
- **Exceeded Return Quantity**: Returning more than purchased
- **Unauthorized Actions**: Insufficient permissions

## Audit Trail

The system tracks:
- User ID for each status change
- Timestamps for approval and processing
- Optional notes for approval decisions
- All changes are immutable after processing