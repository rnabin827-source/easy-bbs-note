# Easy BBS Note

## Current State
New project with no existing application files.

## Requested Changes (Diff)

### Add
- Note data model with fields: title, subject, year (1st/2nd/3rd/4th Year), content
- Backend: `addNote` update function to store a new note
- Backend: `getNotes` query function that returns all notes, with optional year filter
- Frontend: Form at the top with Title (text input), Subject (text input), BBS Year (dropdown: 1st Year, 2nd Year, 3rd Year, 4th Year), Content (textarea), and an Add Note button
- Frontend: Filter dropdown below the form (All Years, 1st Year, 2nd Year, 3rd Year, 4th Year)
- Frontend: Notes displayed as cards showing Title, Year, Subject, Content
- Light blue/white background, green Add Note button, white cards with subtle shadow

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Generate Motoko backend with Note type, stable storage, addNote, and getNotes (with optional year filter)
2. Build React frontend with add-note form, year filter dropdown, and note card grid
3. Wire frontend to backend actor calls for addNote and getNotes
4. Deploy draft
