# 🔧 Fix: Duplicate Entry Error in Ticket Creation

## Problem
When creating a support ticket, you get the error:
```
🚨 API Error [/entities/ticket]: Error: Duplicate entry
❌ Ticket mutation failed: Error: Duplicate entry
```

## Root Cause
The ticket number generation was happening in **two places**:
1. ❌ In the API route handler (`/entities.js`) - generating and assigning ticket_number
2. ❌ In the Ticket model pre-save hook (`Ticket.js`) - also trying to generate ticket_number

This caused:
- Race conditions when creating tickets
- Multiple simultaneous ticket number generations
- MongoDB unique constraint violations on `ticket_number`

## Solution Applied

### 1. **Removed Duplicate Generation from Route** ✅
**File**: `server/src/routes/entities.js`

```javascript
// BEFORE (❌ Creating race condition)
if (modelName === 'Ticket' && !data.ticket_number) {
  const count = await Model.countDocuments();
  data.ticket_number = `TKT-${ticketNum}`;
}

// AFTER (✅ Removed)
// Do NOT generate ticket number here - let the model's pre-save hook handle it
```

### 2. **Improved Model Pre-Save Hook** ✅
**File**: `server/src/models/Ticket.js`

Added:
- ✅ Uniqueness check before assigning ticket_number
- ✅ Randomness to prevent collisions
- ✅ Multiple retry attempts (up to 5)
- ✅ Fallback to timestamp-based ticket numbers
- ✅ Better error logging and handling

```javascript
// Single source of truth for ticket number generation
ticketSchema.pre('save', async function(next) {
  if (!this.ticket_number) {
    // Generate with uniqueness check
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 5) {
      const count = await Ticket.countDocuments();
      const randomSuffix = Math.floor(Math.random() * 100);
      const candidateTicket = `TKT-${String(...).padStart(5, '0')}`;
      
      // Check if already exists
      const existing = await Ticket.findOne({ ticket_number: candidateTicket });
      if (!existing) {
        this.ticket_number = candidateTicket;
        isUnique = true;
      }
      attempts++;
    }
  }
});
```

### 3. **Better Error Handling** ✅
**File**: `server/src/routes/entities.js`

```javascript
// Handle MongoDB duplicate key error (code 11000)
if (error.code === 11000) {
  const field = Object.keys(error.keyPattern)[0];
  return res.status(400).json({ 
    error: `Duplicate entry for ${field}`,
    details: error.message
  });
}
```

### 4. **User-Friendly Frontend Error Messages** ✅
**File**: `src/components/livechat/CreateTicketFromChatDialog.jsx`

```javascript
if (error.message?.includes('Duplicate')) {
  errorMessage = 'A ticket with this information already exists. ' +
                 'Please check if you already created a ticket for this customer.';
}
```

## How to Fix Existing Duplicate Entries

If you still have duplicate entries in your database, run:

```bash
cd server
node fix-duplicate-entry.js
```

This script will:
1. ✅ Find tickets with null/missing ticket_number
2. ✅ Assign unique ticket numbers to them
3. ✅ Fix any existing duplicate ticket_number values
4. ✅ Display database health report
5. ✅ Verify indexes are properly set

## Testing the Fix

### 1. **Test Creating a New Ticket**
   - Go to Live Chat
   - Click "Create Ticket" button
   - Fill in the form
   - Click "Create Ticket"
   - ✅ Should succeed with unique ticket number

### 2. **Verify Ticket Number is Unique**
   - Create multiple tickets
   - Each should have a different ticket_number (TKT-00001, TKT-00002, etc.)
   - No "Duplicate entry" errors

### 3. **Track Your Ticket**
   - Go to "Track Your Support Ticket"
   - Enter the ticket number and email
   - ✅ Should find and display the ticket with timeline and resolution notes

## Technical Changes Summary

| File | Change | Impact |
|------|--------|--------|
| `server/src/routes/entities.js` | Removed duplicate ticket generation | ✅ Single source of truth |
| `server/src/models/Ticket.js` | Improved pre-save hook with uniqueness check | ✅ No race conditions |
| `server/src/routes/entities.js` | Better error handling for code 11000 | ✅ Better debugging |
| `src/components/livechat/CreateTicketFromChatDialog.jsx` | Friendly error messages | ✅ Better UX |
| `server/fix-duplicate-entry.js` | New cleanup script | ✅ Fix existing issues |

## Troubleshooting

### Still Getting "Duplicate entry" Error?

1. **Check server logs**:
   ```
   Look for: 🎫 Generated unique ticket number: TKT-XXXXX
   Or:       ⚠️ Could not generate sequential ticket number, using timestamp
   ```

2. **Run the cleanup script**:
   ```bash
   node server/fix-duplicate-entry.js
   ```

3. **Drop and recreate the Ticket collection** (last resort):
   ```bash
   # In MongoDB shell:
   use supportai
   db.tickets.drop()
   ```
   Then restart the server

4. **Check MongoDB logs** for index errors:
   ```
   db.tickets.dropIndex('ticket_number_1')  # Drop bad index
   db.tickets.createIndex({ ticket_number: 1 }, { unique: true, sparse: true })
   ```

## Prevention Going Forward

The single pre-save hook approach ensures:
- ✅ One atomic operation to generate ticket_number
- ✅ Built-in uniqueness validation
- ✅ Automatic retry with randomness
- ✅ No race conditions from multiple processes
- ✅ Clean error messages

## Timeline Display Fix

Previously tickets showed incomplete timeline. Now displays:
- ✅ 🎫 Ticket Created (with correct date)
- ✅ ⏱️ First Response (if available)
- ✅ 🔄 Being Worked On (if in progress)
- ✅ ✅ Resolved/Closed (with proper end formatting)
- ✅ 💬 Resolution Notes (new!)

## Questions?

Check:
- Browser DevTools → Console for detailed error
- Server logs for generation attempts
- MongoDB indexes: `db.tickets.getIndexes()`
- Run: `node server/fix-duplicate-entry.js` for diagnostics
