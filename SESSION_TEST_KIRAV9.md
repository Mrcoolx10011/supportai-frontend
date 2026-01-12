# Session Testing Guide - kirav9 (kiran1@gmail.com) 🧪

## Test Scenario

Testing session management with:
- **User**: kirav9
- **Email**: kiran1@gmail.com

## What Should Happen

### First Chat (Session 1 - Day 1)
```
kirav9 starts chat:
Customer View: Empty chat (new customer)
Agent View: No history (first time)
Result: ✅ Fresh conversation starts
```

### Return Chat (Session 2 - After 24+ Hours)
```
kirav9 returns to chat:
System: "More than 24 hours inactive"
        ↓
Action: Create NEW session
        Archive old one
        ↓
Customer View: Empty chat (FRESH START!)
Agent View: "📋 Conversation History"
           - Session 1: Previous conversation
           - Session 2: Current (active)
           
Result: ✅ kirav9 sees new/fresh chat
        ✅ Agent sees all history
```

## Step-by-Step Test

### Step 1: kirav9 Creates First Conversation
```
1. Open live chat as customer
2. Name: kirav9
3. Email: kiran1@gmail.com
4. Start chatting
5. Verify: ChatConversation created with:
   - customer_name: "kirav9"
   - customer_email: "kiran1@gmail.com"
   - session_id: "SESSION-..."
   - is_new_session: true
```

### Step 2: kirav9 Chats with Agent
```
1. Send messages
2. Agent responds
3. Continue conversation
4. Database stores with:
   - conversation_id: [ID]
   - session_id: [Same session ID]
   - All messages tagged with current session_id
```

### Step 3: Wait >24 Hours (or Test with Time Jump)
```
Option A: Actually wait 24+ hours ⏳
Option B: Manually test by:
   - Checking database timestamps
   - Modifying last_message_at to be 25 hours old
   - Creating new conversation
```

### Step 4: kirav9 Returns
```
1. kirav9 opens chat again with same email
2. System detects: kiran1@gmail.com
3. Finds: Previous conversation
4. Checks: last_message_at
5. Decision: >24hrs? → YES
6. Action: Create NEW session
```

### Step 5: Verify Results

#### For kirav9 (Customer)
```
What they see:
✅ Empty chat (fresh start)
✅ No old messages visible
✅ Feels like new conversation
✅ Only current session messages visible

What's happening:
- getMessagesForUser(conversationId, isAgent=false, sessionId=NEW_SESSION_ID)
- Returns: Only messages where session_id = NEW_SESSION_ID
- Result: Clean slate!
```

#### For Agent
```
What they see:
✅ Current chat with kirav9
✅ ConversationHistory panel shows:
   - Session 1: Jan 12, 6:41 PM, 5 messages, ✅ RESOLVED
   - Session 2: Jan 13, 2:15 PM, [current], 0+ messages
✅ Full context of customer

What's happening:
- getMessagesForUser(conversationId, isAgent=true)
- Returns: ALL messages for this customer
- Result: Complete history across all sessions!
```

## Database Verification

### Check Conversations for kirav9

```javascript
// Query
db.chatconversations.find({
  customer_email: "kiran1@gmail.com"
})

// Expected Result (after 2 sessions)
[
  {
    _id: ObjectId(...),
    session_id: "SESSION-1704067200000-abc123",
    customer_name: "kirav9",
    customer_email: "kiran1@gmail.com",
    is_new_session: false,  // First was new
    createdAt: "2026-01-12T18:41:00Z",
    last_message_at: "2026-01-12T18:45:00Z"
  },
  {
    _id: ObjectId(...),
    session_id: "SESSION-1704153600000-def456",
    customer_name: "kirav9",
    customer_email: "kiran1@gmail.com",
    is_new_session: true,   // New session
    previous_sessions: [
      {
        session_id: "SESSION-1704067200000-abc123",
        conversation_id: ObjectId(...),
        message_count: 5
      }
    ],
    createdAt: "2026-01-13T14:15:00Z",
    last_message_at: "2026-01-13T14:16:00Z"
  }
]
```

### Check Messages for kirav9

```javascript
// All messages for kirav9
db.chatmessages.find({
  conversation_id: ObjectId(...)
})

// Session 1 messages
[
  {
    session_id: "SESSION-1704067200000-abc123",
    message: "Hi, I have an issue",
    sender_type: "customer"
  },
  {
    session_id: "SESSION-1704067200000-abc123",
    message: "How can I help?",
    sender_type: "agent"
  },
  // ... more session 1 messages
]

// Session 2 messages (after return)
[
  {
    session_id: "SESSION-1704153600000-def456",
    message: "Hi, I'm back",
    sender_type: "customer"
  },
  // ... session 2 messages
]
```

## Expected Behavior Comparison

### Customer View: kirav9

```
SESSION 1 (Day 1):
┌─────────────────────┐
│ kirav9: "Hi..."     │ ← Visible
│ Agent: "Hello..."   │ ← Visible
│ [5 messages total]  │ ← All visible
└─────────────────────┘

WAIT: 25+ hours inactive

SESSION 2 (Day 2 - NEW):
┌─────────────────────┐
│ [Empty chat!]       │ ← FRESH START
│                     │
│ kirav9: "I'm back"  │ ← First message of new session
└─────────────────────┘

OLD MESSAGES: 🚫 HIDDEN (for customer privacy)
```

### Agent View: Sees Both Sessions

```
AGENT VIEW:
┌──────────────────────────────┐
│ Current Chat                 │
│ ┌────────────────────────┐   │
│ │ kirav9: "I'm back"     │   │ ← Session 2 (current)
│ └────────────────────────┘   │
│                              │
│ 📋 Conversation History      │
│ ┌────────────────────────┐   │
│ │ Session 1              │   │ ← Session 1 (archived)
│ │ Jan 12, 6:41 PM        │   │
│ │ 5 messages             │   │
│ │ ✅ RESOLVED            │   │
│ └────────────────────────┘   │
│                              │
│ Agent Notes:                 │
│ "kirav9 had issue yesterday" │ ← Agent has context!
└──────────────────────────────┘
```

## API Calls to Monitor

### When kirav9 First Connects
```
POST /api/chatconversation
{
  customer_name: "kirav9",
  customer_email: "kiran1@gmail.com",
  client_id: "demo-client"
}

Response:
{
  _id: "conv-001",
  session_id: "SESSION-1704067200000-abc123",
  is_new_session: true
}
```

### When kirav9 Returns (Day 2)
```
GET /api/chat/history?email=kiran1@gmail.com&clientId=demo-client
→ System detects: Previous conversation exists
→ Checks: last_message_at (25 hours ago)
→ Decision: Create new session
→ POST new conversation

Response:
{
  data: [
    { session_id: "SESSION-1704067200000-abc123", ... }, // Old
    { session_id: "SESSION-1704153600000-def456", ... }  // New
  ]
}
```

### Messages for kirav9

#### Customer Requesting Messages
```
GET /api/chatmessage?conversation_id=conv-002&session_id=SESSION-1704153600000-def456
→ getMessagesForUser(convId, isAgent=false, sessionId)
→ Filter: WHERE session_id = "SESSION-1704153600000-def456"

Response: 
[Only messages from Session 2] ✅
```

#### Agent Requesting Messages
```
GET /api/chatmessage?conversation_id=conv-002
→ getMessagesForUser(convId, isAgent=true)
→ Filter: WHERE conversation_id = "conv-002"

Response:
[All messages from Session 1 AND 2] ✅
```

## Manual Testing Steps

### Test Case: kirav9's Full Journey

```
DAY 1 - 6:41 PM:
┌─────────────────────────────┐
│ 1. kirav9 opens chat        │
│ 2. Enters email:            │
│    kiran1@gmail.com         │
│ 3. Starts: "Hi, I..."       │
│ 4. Agent responds: "Hello!" │
│ 5. Chat continues... (5 msgs)
│ 6. Conversation ends        │
│                             │
│ System saves:               │
│ - Session: SESSION-001      │
│ - is_new_session: true      │
│ - last_message_at: 6:45 PM │
└─────────────────────────────┘

DAY 2 - 2:15 PM (25+ hours later):
┌─────────────────────────────┐
│ 1. kirav9 opens chat        │
│ 2. System checks:           │
│    "kiran1@gmail.com"       │
│ 3. Finds: Previous conv     │
│ 4. Calculates: 25+ hours!   │
│ 5. Decision: NEW SESSION    │
│                             │
│ System creates:             │
│ - New Session: SESSION-002  │
│ - is_new_session: true      │
│ - Archive old: SESSION-001  │
│                             │
│ kirav9 sees: Empty chat ✨  │
│ Agent sees: History panel 📋
└─────────────────────────────┘
```

## Verification Checklist ✅

- [ ] First time kirav9 connects → New session created
- [ ] kirav9 sent messages → Tagged with session_id
- [ ] After 24+ hours, kirav9 returns → New session created
- [ ] Old session archived → In previous_sessions array
- [ ] kirav9 sees empty chat → Only current session messages
- [ ] Agent sees history panel → Shows Session 1
- [ ] Agent sees all messages → From both sessions
- [ ] Message counts correct → 5 in Session 1, N in Session 2

## Debugging (If Issues)

### Issue: kirav9 Still Sees Old Messages
**Check**: 
```javascript
// In ChatWindow.jsx
const messages = getMessagesForUser(
  conversationId,
  isAgent=false,  // ← Should be false for customer
  sessionId       // ← Should be current session only
);
```

### Issue: Agent Doesn't See History
**Check**:
```javascript
// In ConversationHistory.jsx
// API should be called with customer email
GET /api/chat/history?email=kiran1@gmail.com&clientId=...
```

### Issue: Session Not Created
**Check**:
```javascript
// In sessionManager.js
const session = await getOrCreateSession(
  customerEmail,
  customerName,
  clientId
);
// Should return: sessionId, isNewSession, previousSessions
```

## Expected Console Logs

### When kirav9 Returns (Day 2)
```
🔍 Looking for existing conversations: kiran1@gmail.com
📊 Found 1 existing conversations for this customer
⏱️ Last message was 25.3 hours ago
🔄 Creating new session (inactive >24hrs)
📋 Fetching conversation history for kiran1@gmail.com
✅ Found 2 conversations for kiran1@gmail.com
```

## Summary

With kirav9 (kiran1@gmail.com):

✅ **First Visit**: 
- Session 1 created
- Fresh conversation
- No history

✅ **After 24+ Hours**:
- Session 2 created (NEW)
- Session 1 archived
- kirav9 sees: Empty chat (fresh!)
- Agent sees: History panel with Session 1

✅ **Result**:
- Customer: Clean, fresh experience
- Agent: Full context from Session 1
- System: Organized session tracking

Perfect test case! 🎯
