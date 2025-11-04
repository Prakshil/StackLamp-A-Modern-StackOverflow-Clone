# Fix "Unknown attribute: tags" Error

## Quick Fix - Add Missing Attributes in Appwrite Console

### Step 1: Go to Appwrite Console
1. Visit: https://cloud.appwrite.io/
2. Select your project: `stackoverflow` (ID: 69096b68002acd0a5d83)

### Step 2: Navigate to Questions Collection
1. Click **Databases** in the left sidebar
2. Click on database `stackoverflow_db`
3. Click on collection `questions`

### Step 3: Add Missing Attributes

Click **Attributes** tab, then add these if they don't exist:

#### 1. tags (String Array)
- **Key**: `tags`
- **Type**: String
- **Size**: 50
- **Required**: No (uncheck)
- **Array**: Yes (check this!)
- Click **Create**

#### 2. attachmentId (String)
- **Key**: `attachmentId`
- **Type**: String
- **Size**: 50
- **Required**: No (uncheck)
- **Array**: No
- Click **Create**

### Step 4: Verify Required Attributes Exist

Make sure these attributes are present:
- ✅ `title` (String, 100, Required)
- ✅ `content` (String, 10000, Required)
- ✅ `authorId` (String, 50, Required)
- ✅ `tags` (String Array, 50, Optional)
- ✅ `attachmentId` (String, 50, Optional)

### Step 5: Check Permissions

In the **Settings** tab of the collection, ensure these permissions are set:

**Read Access:**
- `Any` (so anyone can view questions)

**Create Access:**
- `Users` (any logged-in user can create)

**Update Access:**
- `Users` (any logged-in user can update)

**Delete Access:**
- `Users` (any logged-in user can delete)

### Step 6: Create Storage Bucket (if file upload fails)

1. Click **Storage** in left sidebar
2. Click **Create Bucket**
3. **Bucket ID**: `attachments`
4. **Name**: Attachments
5. **Permissions**:
   - Read: `Any`
   - Create: `Users`
   - Update: `Users`
   - Delete: `Users`
6. Click **Create**

---

## After Setup

1. Restart your dev server: `npm run dev`
2. Try creating a question at http://localhost:3000/ask
3. It should now work! ✓

---

## If You Still Get Errors

Run the debug page to see what's missing:
- Go to: http://localhost:3000/debug
- Click "Run Tests"
- Check which test fails and what error it shows

The most common issues:
- ❌ Attribute doesn't exist → Add it in Appwrite Console
- ❌ Permission denied → Check collection permissions
- ❌ Bucket not found → Create storage bucket named "attachments"
