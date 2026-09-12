# Hôm Nay Ăn Gì? — Design System

This file is the visual source of truth for the product. Page-specific files in
`pages/` may override it; otherwise these rules apply everywhere.

## Direction

The interface evokes a Vietnamese village courtyard: fired earth, woven mats,
bamboo trays, dó paper and indigo cloth. It should feel warm, playful and local,
not like a casino or a generic neon game. Decoration supports the food-choice
task and must never reduce readability.

## Foundation

- Typeface: self-hosted Be Vietnam Pro, weights 400–800.
- Main ground: `--ground-1 #6b4426`, `--ground-2 #2c1a0d`.
- Paper surfaces: `--surface-solid #fdf6e4`, `--surface-2 #f5efdc`.
- Text: `--ink #24211b`, `--ink-soft #6b6455`, ground text `#f7f0dd`.
- Accents: turmeric `--gold #f0b429`, banana leaf `--green-btn #4a7c3f`,
  indigo `--indigo #35526f`, terracotta `--terracotta #c85a3c`.
- Corner radii use existing `--r-*` tokens. Prefer warm, compact surfaces and
  subtle physical depth over glossy glass or saturated gradients.

## Components and interaction

- Primary actions use the green or turmeric tokens with high-contrast text.
- Cards and feature rows must be semantic controls when clickable.
- All controls keep a visible `:focus-visible` ring and follow visual DOM order.
- Minimum pointer target is 44×44 px; adjacent targets keep at least 8 px space
  where the layout allows it.
- Inputs have persistent visible labels, an associated `for`/`id`, and helper or
  error text beside the field. Placeholder text is supplementary only.
- Use inline SVG icons from the established rounded-stroke family. Decorative
  SVGs are `aria-hidden`; icon-only actions require an accessible name.
- Motion communicates deal, reveal and selection. Honor `prefers-reduced-motion`
  and avoid layout-animation properties when a transform can express the state.

## Layout

- The deck remains the visual focus and scales algorithmically to its container.
- Desktop uses the main stage plus supporting controls; mobile stacks content.
- Short landscape screens place the quick action and alternate modes in one row
  so the deck retains useful height. No control may create horizontal page scroll.
- Modals retain a visible close action, scroll internally, trap focus while open,
  close on Escape, and restore focus to the opener.

## Content and product behavior

- Vietnamese copy is concise, conversational and specific about what will happen.
- “Gợi ý theo giờ” is a weighted recommendation, not a hard filter. Explicit meal
  filters remain deterministic.
- Destructive actions name the affected item and require confirmation.
- Privacy copy distinguishes bundled assets from an external custom-image URL
  explicitly supplied by the user.

## QA gates

- Keyboard-only completion of every flow, including card navigation and settings.
- Contrast at least WCAG AA; focus indicators are not removed.
- Check 360×800 mobile, 812×375 landscape, tablet and desktop widths.
- Verify light/dark mode, reduced motion, empty/filter states, offline shell,
  long Vietnamese dish names and odd-sized Battle brackets.
