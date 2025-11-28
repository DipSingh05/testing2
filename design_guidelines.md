# Upwork Scraper - Design Guidelines

## Design Approach
**System**: Linear/Notion-inspired productivity tool interface
**Rationale**: This is a utility-focused data scraping tool requiring efficiency, clarity, and information density. The design prioritizes functionality over visual flair while maintaining modern aesthetics.

## Typography System
- **Primary Font**: Inter via Google Fonts CDN (clean, highly legible for data)
- **Hierarchy**:
  - Page Title: text-2xl, font-semibold
  - Section Headers: text-lg, font-medium
  - Job Titles: text-base, font-semibold
  - Body/Metadata: text-sm, font-normal
  - Labels/Helper Text: text-xs, font-medium

## Layout & Spacing
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: p-4 to p-6
- Section gaps: gap-6 to gap-8
- Card spacing: p-4 internally, gap-4 between cards
- Form field spacing: space-y-4

**Container Structure**:
- Max width: max-w-7xl mx-auto
- Page padding: px-6 lg:px-8
- Vertical rhythm: py-8 to py-12 for main sections

## Component Library

### Control Panel (Top Section)
Single-row horizontal layout containing:
- **URL Input Field**: 
  - Full-width flex-1 input with placeholder text
  - Label above: "Upwork Search URL"
  - Helper text below for format guidance
- **Scrape Limit Control**: 
  - Number input with min/max indicators
  - Label: "Job Limit" 
  - Display range info: "(Min: 5, Max: All)"
- **Filter Dropdown**: 
  - Select menu for sorting (Date, Budget, Relevance)
  - Icon from Heroicons (ChevronDownIcon)
- **Scrape Button**: 
  - Primary action button, px-6 py-2.5
  - Icon: MagnifyingGlassIcon from Heroicons

Layout: Grid layout with responsive breakpoints
- Mobile: Stack vertically (grid-cols-1)
- Desktop: grid-cols-12 with URL spanning 6 cols, limit 2 cols, filter 2 cols, button 2 cols

### Status Indicator
Horizontal bar showing:
- Status text ("Scraping...", "Complete", "Idle")
- Progress indicator (animated pulse during scraping)
- Results count display ("Showing X of Y jobs")

### Job Listing Grid
**Card-based layout**: 
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Gap: gap-6
- Card structure (each job):
  - Border with rounded corners (rounded-lg)
  - Internal padding: p-6
  - Hover state: subtle elevation change
  
**Card Content Hierarchy**:
1. Job Title (text-base font-semibold, leading-tight)
2. Client Name + Verification Badge (text-sm, with CheckBadgeIcon from Heroicons)
3. Budget/Rate (text-sm font-medium, prominent placement)
4. Posted Date (text-xs, muted appearance)
5. Description Preview (text-sm, line-clamp-3 for truncation)
6. Tags Row (inline-flex gap-2, small rounded badges for skills)
7. View Details Link (text-sm with ArrowRightIcon)

### Empty State
Centered content when no jobs scraped:
- Large icon (DocumentMagnifyingGlassIcon from Heroicons, size-16)
- Heading: "No Jobs Scraped Yet"
- Description: "Enter an Upwork search URL and click Scrape to get started"
- Spacing: space-y-4, text-center

## Navigation & Structure
**Single-page application layout**:
- Minimal header: Application title + GitHub link icon (optional)
- Main content area: Control panel → Status → Job grid
- No footer needed (tool-focused interface)

## Icons
**Library**: Heroicons via CDN
**Usage**:
- Input fields: MagnifyingGlassIcon for search
- Status: CheckCircleIcon, ExclamationCircleIcon
- Dropdowns: ChevronDownIcon
- Job cards: ClockIcon (date), CurrencyDollarIcon (budget), UserIcon (client)

## Interactive Elements
- **Buttons**: Rounded corners (rounded-md), consistent padding (px-4 py-2)
- **Input Fields**: Full borders (border), rounded (rounded-md), focus ring
- **Cards**: Clickable with cursor-pointer, subtle shadow (shadow-sm)
- **Tags/Badges**: Pill-shaped (rounded-full), small padding (px-3 py-1)

## Responsiveness
- **Mobile** (< 768px): Single column, stacked controls, vertical navigation
- **Tablet** (768-1024px): 2-column job grid, horizontal control panel
- **Desktop** (> 1024px): 3-column job grid, optimized horizontal layout

## Animations
Minimal, purposeful only:
- Loading state: Subtle pulse animation on status bar
- Card hover: Smooth scale/shadow transition (transition-all duration-200)
- Button press: Standard active state scaling
- No scroll-triggered or elaborate animations

## Data Display Priorities
1. **Job Title & Client** - Most prominent
2. **Budget/Rate** - Second most visible
3. **Skills/Tags** - Easy to scan
4. **Description** - Readable but compact
5. **Metadata** (date, location) - Supporting information

**Design Principle**: Every pixel serves the user's goal of quickly scanning and evaluating job opportunities. Clean, scannable, efficient.