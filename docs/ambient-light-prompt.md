# Ambient Light Prompt

Create an "ambient light" gradient at the top of this section that feels subtle, premium, and atmospheric (not a hard banner).

Goal:
- The light should appear to glow from above and fade naturally into the section background.
- Keep text readability high and avoid overpowering contrast.
- It must work in both dark and light themes.

Implementation constraints:
- Store it as a reusable utility class in `app/globals.css` under `@layer utilities` (example: `.section-ambient-light`).
- Use CSS variables for colors/intensity in `:root` and `[data-theme="light"]` so the effect is theme-aware.
- Apply the class to top-level section wrappers (e.g. Hero/intro sections), not as one-off inline styles.
- Use layered gradients (radial + linear) with low opacity and soft blur/falloff.
- Keep it performant: no heavy animation by default.

Acceptance:
- Looks like ambient light wash, not a visible shape.
- Reusable across sections with one class.
- Theme-consistent and accessible.
