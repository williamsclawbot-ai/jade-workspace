# 6-Column Content Display Reorganization

## Overview

Content items now display in a **responsive 6-column grid layout** instead of dense text blocks. This provides better visual scanning and organization of content elements.

## Layout Components

### New Component: `ContentItem6Column.tsx`

Located at: `apps/mission-control/components/ContentItem6Column.tsx`

This component replaces the previous `ScriptColumnDisplay` component and provides:

#### 6 Column Cards:
1. **HOOK** 🎣 — The opening line (extracted from script)
2. **SETTING** 📍 — Where/how filmed (from description, setting field, or script)
3. **SCRIPT** 📝 — Full script content
4. **ON SCREEN HOOK TEXT** 📺 — Hook text with timing (extracted from on-screen text)
5. **ON SCREEN TEXT** ✍️ — All on-screen text with timing
6. **CAPTION** 💬 — Full caption for post

Each column is:
- Card-style with rounded corners and border
- Light background matching status color
- Full text visible with scrolling if needed
- Easy to scan left-to-right
- Hover effects for better interactivity

### Responsive Design

- **Mobile (default)**: Stacks vertically (1 column)
- **Tablet (sm+)**: 3 columns per row
- **Desktop (lg+)**: 6 columns (2 rows of 3)

```
DESKTOP VIEW:
┌──────┬──────┬──────┐
│HOOK  │SET   │SCRIPT│  Row 1
└──────┴──────┴──────┘
┌──────┬──────┬──────┐
│HOOK₂ │TEXT  │CAP   │  Row 2
└──────┴──────┴──────┘

TABLET VIEW:
┌──────┬──────┬──────┐
│HOOK  │SET   │SCRIPT│
├──────┼──────┼──────┤
│HOOK₂ │TEXT  │CAP   │
└──────┴──────┴──────┘

MOBILE VIEW:
┌──────┐
│HOOK  │
├──────┤
│SET   │
├──────┤
│SCRIPT│
├──────┤
│HOOK₂ │
├──────┤
│TEXT  │
├──────┤
│CAP   │
└──────┘
```

### Card Heights

- Fixed height: 300px on desktop/tablet
- Each card scrolls independently if content exceeds height
- Headers are sticky at top of each card

## Implementation Details

### Data Extraction Functions

The component intelligently extracts data:

#### Hook Extraction
- Looks for "Hook:" label in script
- Falls back to first question (line ending with ?)
- Default: first 100 characters of script

#### Setting Extraction
- Uses explicit `setting` prop if provided
- Falls back to `description` field
- Looks for "Setting:" in script
- Default: "On location"

#### On-Screen Hook Text
- Looks for hook-specific timing blocks in on-screen text
- Pattern: `[0-X sec] "...hook text..."`
- Falls back to first timing block if no hook found

#### Caption & On-Screen Text
- Uses explicit props if provided
- Extracts from script if embedded
- Shows "(No content)" placeholder if empty

### Status Colors

Supports 4 color themes matching different contexts:
- **Green**: Ready to film/approved content
- **Red**: Due for review content
- **Blue**: Alternative reviews
- **Purple**: General content

## Files Updated

### Modified Components

1. **TodayExpanded.tsx**
   - Import changed from `ScriptColumnDisplay` to `ContentItem6Column`
   - Both "Due for Review" section (red) and "Ready to Film" section (green) updated
   - Added `description` prop passing

2. **Content.tsx**
   - Import changed from `ScriptColumnDisplay` to `ContentItem6Column`
   - "Due for Review" workflow section (red) updated
   - "Ready to Film/Schedule" section (purple) updated
   - Added `setting` and `description` props passing

### New Files

- **ContentItem6Column.tsx** — Main 6-column display component

## Applied To

### Today Tab (TodayExpanded.tsx)
- ✅ Tomorrow's Content - Due for Review section
- ✅ Today's Content - Ready to Film/Schedule section

### Content Tab (Content.tsx)
- ✅ This Week section - Due for Review items
- ✅ This Week section - Ready to Film/Schedule items

## Approval Buttons

Approval buttons remain **below** the content cards:
- Green "Approve for Filming" button
- Amber "Request Changes" button
- Positioning unchanged from previous implementation

## Styling Features

### Visual Hierarchy
- Bold, uppercase column headers with emojis
- Light background colors inherit from status
- Border colors match status theme
- Smooth hover transitions

### Text Handling
- Whitespace preserved for script formatting
- Text wrapping and scrolling handled automatically
- Line breaks maintained in all fields
- Long content scrollable within fixed card height

### Accessibility
- Clear visual labels with icons
- Sufficient color contrast
- Readable font sizes (12px base)
- Semantic HTML structure

## Browser Compatibility

Works with:
- Chrome/Chromium
- Firefox
- Safari
- Edge

Tested with Next.js 15.5.12 and Tailwind CSS

## Future Enhancements

Potential improvements:
1. Collapsible columns for narrower viewports
2. Column reordering by user preference
3. Export individual columns as text
4. Inline editing for approved content
5. Comparison view for changes-requested items
6. Dark mode support

## Usage Example

```tsx
<ContentItem6Column 
  script={item.script}
  onScreenText={item.onScreenText}
  caption={item.caption}
  setting={item.setting}
  description={item.description}
  statusColor="green"
/>
```

## Notes

- Component automatically extracts data from script if explicit props aren't provided
- All data is read-only in display mode
- No inline editing (maintains current approval workflow)
- Responsive design tested at breakpoints: 320px, 768px, 1024px, 1280px+
