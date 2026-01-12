# Support Ticket System - Complete Guide

## Overview
A professional support ticket management system integrated with live chat, featuring automatic ticket number generation, customer notifications, and a public tracking interface.

## Features Implemented

### 1. **Ticket Creation from Live Chat** 📋
- Agents can create tickets directly from live chat conversations
- **Location**: Chat Window → "Create Ticket" button
- Auto-filled customer details:
  - Customer name
  - Customer email
  - Conversation ID (for reference)
- Ticket fields:
  - Title
  - Description
  - Priority (low, medium, high, urgent)
  - Category (general, technical, billing, etc.)
  - Client association

### 2. **Professional Ticket Reference Numbers** 🎫
- Automatic generation: `TKT-00001`, `TKT-00002`, etc.
- Sequential numbering stored in database
- Unique, sparse index for reliability
- Generation happens automatically on ticket creation

### 3. **Ticket Management Dashboard** 📊
- **List View**: See all tickets with key details
  - Ticket number badge
  - Title and description
  - Status and priority indicators
  - Customer information
  - Creation date
- **Detail View**: Full ticket information panel
  - Editable status and priority
  - Resolution notes
  - Customer information
  - Created date and timeline
- **Filtering**: By status, priority, category
- **Auto-refresh**: Updates every 3 seconds

### 4. **Customer Notifications** 📧
Email notifications sent automatically in three scenarios:

#### a) **Ticket Created** 
```
📋 Support Ticket Reference: TKT-00003
✅ Status: OPEN
⭐ Priority: URGENT
📂 Category: technical
📌 Issue Title: [Customer's issue]
👤 Customer Name: [Name]
📧 Email: [Email]
```

#### b) **Ticket Updated**
- Sent when status, priority, or other fields change
- Includes list of changes made
- Current ticket status snapshot

#### c) **Ticket Resolved**
- Sent automatically when ticket marked as "resolved" or "closed"
- Confirmation that issue has been addressed
- Invitation to reply if issue persists

### 5. **Public Customer Ticket Tracker** 🌐
- **URL**: `/track-ticket`
- **Access**: No authentication required
- **Features**:
  - Search by Ticket ID (e.g., TKT-00001)
  - Verify email address for security
  - View current ticket status
  - See priority and category
  - Timeline of ticket lifecycle
  - Issue details and description

**Example Flow**:
1. Customer receives: `🔖 TKT-00003` in email
2. Customer visits: `https://app.com/track-ticket`
3. Customer enters: `TKT-00003` and `their@email.com`
4. Customer sees: Real-time status and updates

### 6. **Share with Customer Feature** 📤
- **Button**: "Share with Customer" in ticket details
- **Action**: Copies professional formatted message to clipboard
- **Content Includes**:
  - Ticket reference number (TKT-xxxxx)
  - Status, priority, category
  - Issue title
  - Customer details
  - Professional message about expected response

**Sample Share Message**:
```
📋 **Support Ticket Reference: TKT-00003**

✅ **Status:** OPEN
⭐ **Priority:** URGENT
📂 **Category:** technical

📌 **Issue Title:** Support Issue from kirav9
👤 **Customer Name:** kirav9
📧 **Email:** kiran1@gmail.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for contacting us! Your support ticket has been created and assigned to our support team. 

We will review your issue and get back to you as soon as possible.

**Please save this Reference ID for your records:**
🔖 **TKT-00003**

You can use this ID to track the status of your ticket.
```

## System Architecture

### Frontend Components

#### `CreateTicketFromChatDialog.jsx`
- Modal dialog triggered from chat window
- Auto-fills customer details from conversation
- Form validation
- Success/error feedback
- Console logging for debugging

#### `CustomerTicketTracker.jsx`
- Public component (no authentication)
- Search interface for customers
- Displays comprehensive ticket information
- Timeline view of ticket lifecycle
- Status/priority color coding
- Professional gradient UI

#### `TicketDetails.jsx`
- Agent-facing ticket management panel
- Editable status and priority dropdowns
- Resolution notes textarea
- Copy ticket number button
- Share with customer button
- **NEW**: Customer tracking link display
- Delete functionality

#### `TicketList.jsx`
- Displays all tickets in table format
- Ticket number badges
- Color-coded status and priority
- Pagination support
- Filtering capabilities

### Backend Services

#### `emailService.js` (New)
Email notification functions:
- `sendTicketCreatedEmail()`: Sent on ticket creation
- `sendTicketUpdateEmail()`: Sent on ticket updates
- `sendTicketResolvedEmail()`: Sent when ticket resolved

**Current Status**: Console logging (development mode)
**Future Integration**: SendGrid, Mailgun, AWS SES, etc.

#### `entities.js` (Modified)
- Auto-generates ticket numbers before save
- Calls email service on ticket creation
- Calls email service on ticket updates
- Handles all CRUD operations for tickets

#### `Ticket.js` (Model)
Schema includes:
- `ticket_number`: Unique sequential number (TKT-xxxxx)
- `title`: Issue title (required)
- `description`: Issue details (required)
- `status`: open, in_progress, pending, resolved, closed
- `priority`: low, medium, high, urgent
- `category`: Issue category
- `client_id`: Associated client
- `customer_name`: Name from conversation
- `customer_email`: Email for notifications
- `conversation_id`: Link to live chat conversation
- `created_by`: Agent who created ticket
- `assigned_to`: Assigned support agent
- `resolution_notes`: Agent notes
- Timestamps and more...

**Pre-save Hook**: Generates ticket number if not provided

### API Endpoints

#### GET `/api/entities/ticket`
- Retrieves all tickets
- Auto-filters (shows all tickets for development)
- Supports pagination and filtering
- Auto-refresh every 3 seconds in UI

#### GET `/api/entities/ticket/:id`
- Retrieves single ticket details
- Includes all relationships

#### POST `/api/entities/ticket`
- Creates new ticket
- Auto-generates ticket number
- Sends email notification to customer
- Returns created ticket

#### PUT `/api/entities/ticket/:id`
- Updates ticket fields
- Sends update email if status changes
- Sends resolution email if marked resolved

#### DELETE `/api/entities/ticket/:id`
- Deletes ticket

## Data Flow

### Ticket Creation Flow
```
Chat Window
    ↓
[Create Ticket Button]
    ↓
CreateTicketFromChatDialog
    ↓
Auto-fill customer details
    ↓
Agent submits form
    ↓
POST /api/entities/ticket
    ↓
Backend generates TKT-XXXXX
    ↓
Mongoose pre-save hook
    ↓
Save to database
    ↓
Send email to customer
    ↓
Return to frontend
    ↓
Show success message
    ↓
Ticket appears in Tickets list
```

### Customer Update Tracking Flow
```
Agent updates ticket status
    ↓
PUT /api/entities/ticket/:id
    ↓
Update database
    ↓
Check if update requires notification
    ↓
Send appropriate email:
  - Update email (status/priority changed)
  - Resolution email (resolved/closed)
    ↓
Customer receives email with details
    ↓
Customer can visit /track-ticket
    ↓
Customer enters ticket ID & email
    ↓
Frontend searches ticket database
    ↓
Display real-time ticket information
```

## Usage Instructions

### For Agents: Creating Tickets
1. Open a live chat conversation
2. Click "Create Ticket" button
3. Form auto-fills with customer details
4. Enter issue title and description
5. Select priority and category
6. Click "Create Ticket"
7. See success notification
8. Ticket appears in Tickets page

### For Agents: Managing Tickets
1. Go to "Tickets" page
2. View ticket list with key information
3. Click ticket to see details panel
4. Update status/priority using dropdowns
5. Add resolution notes
6. Click "Update Ticket" to save
7. Click "Share with Customer" to copy message
8. Share the ticket reference number via email/chat

### For Agents: Customer Link
1. Open ticket details
2. Scroll down to "Customer Tracking Link"
3. Copy the link: `https://app.com/track-ticket`
4. Send to customer in email or chat

### For Customers: Tracking Ticket
1. Receive email with ticket reference: `TKT-00001`
2. Visit: `https://app.com/track-ticket`
3. Enter ticket ID: `TKT-00001`
4. Enter email: their registered email
5. Click "Search Ticket"
6. View current status and timeline
7. Check updates for any progress

## Email Notifications (Development)
Currently logs to console. To implement with real email service:

1. **SendGrid Integration**:
   ```javascript
   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   ```

2. **Mailgun Integration**:
   ```javascript
   const mailgun = require('mailgun-js');
   const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY});
   ```

3. **Environment Variables**:
   ```
   EMAIL_SERVICE=sendgrid
   SENDGRID_API_KEY=your_key
   SENDER_EMAIL=support@company.com
   ```

## Security Features
- JWT authentication for agents
- Email verification for customer tracker (ticket ID + email)
- Sparse unique index on ticket_number
- User ownership tracking (created_by, assigned_to)
- Client association for multi-tenant support

## Future Enhancements
1. **Email Integration**: Connect real email service
2. **SMS Notifications**: Send updates via SMS
3. **Webhooks**: Notify external systems
4. **SLA Tracking**: Track response and resolution times
5. **Satisfaction Ratings**: Post-resolution CSAT survey
6. **Knowledge Base Integration**: Link related KB articles
7. **AI Suggestions**: Suggest responses based on KB
8. **Bulk Actions**: Update multiple tickets at once
9. **Email Reply Capture**: Create tickets from customer emails
10. **Advanced Reporting**: Analytics on ticket metrics

## Testing Checklist
- ✅ Create ticket from live chat
- ✅ Auto-generate ticket number
- ✅ View all tickets in dashboard
- ✅ Update ticket status/priority
- ✅ Delete tickets
- ✅ Share ticket with customer
- ✅ Track ticket as customer
- ✅ Email notifications logged to console
- ✅ Customer can verify with email + ticket ID
- ✅ Timeline shows ticket lifecycle

## Files Modified/Created

### Created:
- `server/src/utils/emailService.js` - Email notifications
- `src/components/tickets/CustomerTicketTracker.jsx` - Public tracker

### Modified:
- `server/src/routes/entities.js` - Added email service, ticket generation
- `server/src/models/Ticket.js` - Added fields, pre-save hook
- `src/components/tickets/TicketDetails.jsx` - Added customer link display
- `src/App.js` - Added public route for tracker

## Conclusion
The support ticket system is now fully integrated with:
- Live chat ticket creation
- Professional ticket numbering
- Email notifications (development mode)
- Public customer tracking interface
- Complete ticket lifecycle management
- Professional UI with gradients and color coding

Agents can efficiently create and manage tickets, while customers receive updates and can track their issues in real-time!
