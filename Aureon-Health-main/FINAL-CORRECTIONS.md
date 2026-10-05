# Aureon Health – Root Cause Theme & Hero Fix

## Fixed
- Home 1 `PERSONAL & FAMILY PROTECTION` kicker contrast in dark mode.
- Home 2 restored to the original photo-backed enterprise hero layout.
- Home 2 hero copy and both CTAs remain readable in both themes.
- Hero CTA rows use consistent alignment, spacing, height and centered icon/text treatment.
- Equal-height card CTA bottoms are aligned where cards use the `h-100` layout.
- Light-mode global typography rules were narrowed so they no longer override dark visual surfaces.
- Dark-mode global `span` recoloring was removed so semantic component colors are not overwritten.

## Root Cause
The stylesheet contained broad theme selectors using `!important`, especially:
- `[data-theme="dark"] span:not(.badge):not(.btn)`
- global light-mode paragraph/list/heading overrides

Those rules were more general than the intended component design but still forced colors on hero labels, overlays, footer copy and CTA surfaces. Several later Home 2 hero overrides also accumulated above the original photo hero rules. The fix narrows the broad selectors and restores component-scoped theme rules.
