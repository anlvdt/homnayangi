# Hôm Nay Ăn Gì? — interface rules

The existing [design system](design-system/homnayangi/MASTER.md) is the visual source of truth. Its [dining-flow override](design-system/homnayangi/pages/dining.md) controls the chooser and result. This file is the short implementation checklist for both themes and all screen sizes.

## Purpose and hierarchy

- Say on the home view that the app suggests a dish for the current meal. Show one clear primary action per view.
- Keep the food and the chosen dish more prominent than decoration. Reduce competing accents before adding new ones.
- Use self-hosted Be Vietnam Pro. Use the existing `--fs-*` and `--r-*` tokens in `styles.css`. Keep spacing on the established 4, 6, 8, 12, 16, 20, 24, 32 px rhythm; avoid one-off values where these fit.

## Color and components

- Use the existing warm earth ground, cream paper surfaces, dark ink, leaf green primary action, and restrained turmeric accent. Use the dining override's leaf green for the result's order action.
- Cards of the same purpose share surface, border, radius, and elevation. Buttons of the same purpose share size and interaction states. Inputs share labels, borders, focus treatment, and nearby help or error text.
- Text on paper and ground must remain readable in both themes. Check text and icon contrast at WCAG AA. Do not carry a light-theme foreground color onto a dark surface without checking it.
- Hover, pressed, focus, and disabled states must be distinct. Keep keyboard focus visible.

## Responsive behavior and motion

- Support a 320 px viewport and 200% text sizing without clipped content or inaccessible actions. The page must not scroll sideways. Provide a visible cue for horizontally scrollable choices.
- Give pointer controls at least a 44 × 44 px hit area. Modal content must scroll on short screens and keep its close or skip action reachable.
- Use short transitions for state changes. Respect `prefers-reduced-motion` in JavaScript interactions as well as CSS.

## Content and states

- Explain empty, loading, success, and failure states in the place where they occur. Keep form errors beside the relevant field and announce dynamic feedback.
- Keep all picker flows operable by keyboard. Tab controls expose selection and support arrow-key movement.
- Each actual HTML page has a title, description, and favicon. Labels describe the action that will happen.
