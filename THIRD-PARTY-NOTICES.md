# React Bits — current components

Source repository: https://github.com/DavidHDev/react-bits
Retrieved 2026-09-22; upstream commit observed: 9481af758aae6cfb34c3652ec40a1c099360331f.

This website bundles the free TiltedCard and FlipCard JSX/CSS sources from src/content/Components/TiltedCard and src/content/Micro/FlipCard. TiltedCard source is retained; FlipCard retains its implementation with OS reduced-motion switching disabled at the user's explicit request. Props customize dimensions, tilt, scale, glare and neutral surfaces. Local adapters add equal-height measurement, project content, the wheel-driven perspective carousel and image-derived ambient light. Those adapters are not claimed as unmodified React Bits components. No Pro component is included.

Full React Bits license is included in components/LICENSE.md. React and React DOM are MIT licensed; Motion is MIT licensed. Runtime dependency license files are included in assets/licenses for distribution with this website.

## Previous Silk implementation (not loaded)

The fragment-pattern calculation in hero.js is adapted from React Bits Silk by David Haz, retrieved 2026-09-21. The React/Three.js wrapper is not used. This adaptation is integrated into this personal website, not distributed as a standalone component library.

Source: https://github.com/DavidHDev/react-bits/blob/main/src/content/Backgrounds/Silk/Silk.jsx

License: https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md

MIT + Commons Clause License Condition v1.0

Copyright (c) 2026 David Haz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, and distribute the Software **as part of an application, website, or product**, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

## Commons Clause Restriction

You may use this Software, including for any commercial purpose, **so long as you do not sell, sublicense, or redistribute the components themselves-whether alone, in a bundle, or as a ported version.**

## No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
