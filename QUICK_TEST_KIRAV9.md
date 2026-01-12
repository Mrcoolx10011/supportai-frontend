# Quick Test: kirav9 Session Management 🧪

## The Test

When **kirav9** (kiran1@gmail.com) returns after 24+ hours:

### What kirav9 SEES (Customer)
```
"Wait, where are my old messages?"

Before:
┌──────────────────────┐
│ Day 1                │
│ Me: "Hi, I..."       │
│ Agent: "Hello!"      │
│ Me: "Thanks"         │
│ Agent: "No prob"     │
│ Me: "See you later"  │
│ [5 messages total]   │
└──────────────────────┘

After 24+ Hours Return:
┌──────────────────────┐
│ (empty)              │
│                      │
│ Me: "Hi again!"      │
│ [NEW SESSION!]       │
└──────────────────────┘

✨ Feels like fresh start!
```

### What AGENT SEES
```
"Let me check kirav9's history..."

Chat Panel:
┌──────────────────────────┐
│ Current: kirav9          │
│ Me: "Hi again!"          │
│ [current session]        │
└──────────────────────────┘

Expand: 📋 Conversation History
┌──────────────────────────────┐
│ ✅ Session 1 (Jan 12)        │
│    6:41 PM - 5 messages      │
│    Status: RESOLVED          │
│                              │
│ 🔵 Session 2 (Jan 13)        │
│    2:15 PM - [current]       │
│    Status: ACTIVE            │
└──────────────────────────────┘

💡 "Ah! This customer had issues 
   yesterday. Let me help them better!"
```

## How to Test It

### Test Setup
1. Use browser dev console or test account
2. Customer name: `kirav9`
3. Email: `kiran1@gmail.com`

### Test Sequence

**Step 1: First Chat (Day 1)**
```
1. Open support widget
2. Name: kirav9
3. Email: kiran1@gmail.com
4. Message: "Hi, I have a billing issue"
5. Agent: Responds and chats
6. Send a few messages (3-5)
7. Close chat
```

**Check Database**:
```sql
-- Verify session created
SELECT * FROM chatconversations 
WHERE customer_email = "kiran1@gmail.com"
-- Should show: session_id, is_new_session: true
```

**Step 2: Wait (Simulate >24 Hours)**

Option A - Real Wait: ⏳ Wait 24+ hours

Option B - Force Test: 🔧 Modify database
```sql
-- Make last message 25 hours old
UPDATE chatconversations
SET last_message_at = DATE_SUB(NOW(), INTERVAL 25 HOUR)
WHERE customer_email = "kiran1@gmail.com"
```

**Step 3: Return Chat (Day 2)**
```
1. Open support widget again
2. Name: kirav9
3. Email: kiran1@gmail.com (same!)
4. You should see: EMPTY CHAT
5. Message: "Hi, I'm back"
```

**Verify Results**:

✅ **Customer View**:
```
- Empty chat on return
- Only sees new messages
- Old messages hidden
```

✅ **Agent View** (check in Tickets/Live Chat):
```
- See both conversation sessions
- Click "📋 Conversation History"
- Shows Session 1 (yesterday)
- Shows Session 2 (today, current)
```

## Expected Results ✨

### kirav9's Session Timeline
```
DAY 1 @ 6:41 PM:
├─ Session 1 Created
│  ├─ Customer Email: kiran1@gmail.com
│  ├─ Session ID: SESSION-1704067200000-abc123
│  ├─ Messages: 5
│  └─ Status: Ended
│
DAY 2 @ 2:15 PM:
├─ System Detects: 25+ hours inactive
├─ Creates: Session 2 (NEW)
│  ├─ Session ID: SESSION-1704153600000-def456
│  ├─ is_new_session: true
│  └─ Archives: Session 1
│
Customer View: Shows only Session 2 (fresh!)
Agent View: Shows Session 1 + Session 2 (history!)
```

## Visual Proof Points

**Database should show**:
```
Conversations:
[
  {
    session_id: "SESSION-1704067200000-abc123",
    customer_email: "kiran1@gmail.com",
    message_count: 5,
    status: "resolved"
  },
  {
    session_id: "SESSION-1704153600000-def456",
    customer_email: "kiran1@gmail.com",
    previous_sessions: [{
      session_id: "SESSION-1704067200000-abc123",
      message_count: 5
    }],
    status: "active"
  }
]
```

**Messages should show**:
```
Session 1 Messages:
- session_id: SESSION-1704067200000-abc123
- (5 messages tagged)

Session 2 Messages:
- session_id: SESSION-1704153600000-def456
- (new messages tagged)
```

## What This Proves ✅

- ✅ kirav9 gets NEW SESSION after 24hrs
- ✅ kirav9 sees EMPTY CHAT (fresh start)
- ✅ Old messages are HIDDEN from customer
- ✅ Agent sees BOTH sessions in history
- ✅ System properly ARCHIVES old session
- ✅ Session IDs are properly TAGGED
- ✅ Message filtering works by SESSION

## Success Criteria 🎯

| Check | Expected | Status |
|-------|----------|--------|
| New session created | ✅ | ? |
| Session ID generated | ✅ | ? |
| Old messages hidden | ✅ | ? |
| Agent sees history | ✅ | ? |
| Message counts right | ✅ | ? |
| Status updated | ✅ | ? |
| Timestamps correct | ✅ | ? |

## Troubleshooting

**If kirav9 still sees old messages:**
```
Check: Message filtering not working
Fix: Verify getMessagesForUser() uses sessionId for customers
```

**If history doesn't show:**
```
Check: API not returning previous_sessions
Fix: Verify /api/chat/history endpoint response
```

**If new session not created:**
```
Check: Session timeout maybe set wrong
Fix: Verify SESSION_TIMEOUT = 24 hours in code
```

---

**Ready to test with kirav9!** 🚀

kirav9 (kiran1@gmail.com) is the perfect test user to verify:
- Session creation ✅
- Message filtering ✅  
- History archival ✅
- Fresh experience ✅
