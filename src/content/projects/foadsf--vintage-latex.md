---
title: "Foadsf/vintage-latex"
owner: "Foadsf"
name: "vintage-latex"
fullName: "Foadsf/vintage-latex"
description: "Twenty LuaLaTeX and MetaPost (fiziko) examples of the old scientific-paper aesthetic: engraved plates, star charts, computed log tables, knots, telescopes"
sourceUrl: "https://github.com/Foadsf/vintage-latex"
stars: 146
forks: 11
language: "PowerShell"
topics: ["fiziko", "latex", "lualatex", "metapost", "scientific-illustration", "tikz", "typography", "vintage"]
license: "NOASSERTION"
defaultBranch: "main"
snapshotDate: "2026-09-10"
pushedAt: "2026-09-09T13:37:42Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Vintage scientific papers with LaTeX

Twenty small examples show independent mechanisms behind a convincing
old-scientific-paper aesthetic. Each file is deliberately standalone: copy one,
compile it, and remove individual effects to see what they contribute.

The examples fall into three groups: pure LaTeX pages (1, 2, 4, 5, 6, 10 to
14), standalone fiziko MetaPost
figures (3, 7, 8, 9), and LaTeX pages with fiziko figures drawn inside them by
LuaTeX's built-in MetaPost (15 to 20).

## Gallery

Low-resolution previews of the compiled output; the PDFs themselves are
vector and searchable.

| | | | |
|:-:|:-:|:-:|:-:|
| *图片：01* | *图片：02* | *图片：03* | *图片：04* |
| 01 early modern page | 02 engraved optics plate | 03 Hooke apparatus | 04 ornamented incipit |
| *图片：05* | *图片：06* | *图片：07* | *图片：08* |
| 05 Victorian newspaper | 06 natural history catalogue | 07 lens rays | 08 Atwood machine |
| *图片：09* | *图片：10* | *图片：11* | *图片：12* |
| 09 shading atlas | 10 table of logarithms | 11 circumpolar star chart | 12 snow-crystal micrographs |
| *图片：13* | *图片：14* | *图片：15* | *图片：16* |
| 13 cooling curve | 14 patent drawing sheet | 15 inclined plane | 16 telescope plate |
| *图片：17* | *图片：18* | *图片：19* | *图片：20* |
| 17 terrestrial globe | 18 mechanics primer | 19 knots plate | 20 phases of the moon |

## The examples

1. `01-early-modern-page.tex` -- OpenType
   old-style figures and historical ligatures, an explicit long *s*, warm paper
   and ink colors, asymmetric margins, a drop capital, spaced small capitals,
   marginalia, and printer's rules.
2. `02-engraved-optics-plate.tex` --
   deterministic irregular strokes and line hatching in TikZ, with labels kept
   as real searchable text.
3. `03-fiziko-hooke-apparatus.mp` --
   a compact Hooke apparatus drawn with the external
   fiziko MetaPost library: hatched
   support, modeled spring, hanging weight, and measured extension.
4. `04-ornamented-incipit.tex` -- an A5
   early-scientific title page with a boxed three-line initial and a small
   vector ornament made from ordinary TikZ paths.
5. `05-victorian-newspaper.tex` -- a
   compact square broadsheet with a masthead, balanced columns, rule between
   columns, pull quotation, article heads, and meteorological register.
6. `06-natural-history-catalogue.tex`
   -- a museum catalogue page using hanging entries, dot leaders, explicit
   typographic roles, and old-style numeric data.
7. `07-fiziko-lens-rays.mp` -- a glass lens
   whose ray paths are computed by fiziko's refraction macro rather than drawn
   to a predetermined focal point.
8. `08-fiziko-atwood-machine.mp` -- an
   Atwood machine composed from a hatched support, shaded pulley, curved rope,
   hanging weights, and acceleration arrow.
9. `09-fiziko-shading-atlas.mp` -- a
   side-by-side comparison of line shading, stippling, and a variable-width
   shaded tube.
10. `10-lua-table-of-logarithms.tex`
    -- a five-place table of logarithms whose every digit is computed by a
    Lua function at compile time, set in lining tabular figures with the
    ruling of a nineteenth-century table.
11. `11-circumpolar-star-chart.tex`
    -- a polar star chart: one macro converts right ascension and declination
    to chart coordinates for thirty-four catalogued stars, hour circles
    lettered in roman numerals, and magnitude-graded discs.
12. `12-snow-crystal-micrographs.tex`
    -- four circular microscope fields; the crystals are grown by TikZ
    Lindenmayer-system grammars, with six rotated copies of one arm supplying
    the hexagonal symmetry.
13. `13-cooling-curve-graph-paper.tex`
    -- a pgfplots chart on sepia graph paper with inward ticks, open-circle
    plotting symbols, a hand-fitted curve, and an italic marginal remark.
14. `14-patent-drawing-sheet.tex` --
    a patent-office plate of a centrifugal governor: numbered leader lines,
    sections hatched at forty-five degrees, engraved balls, and witness and
    inventor signature lines.
15. `15-fiziko-inclined-plane.tex`
    -- a treatise page whose figure is drawn by fiziko inside LuaLaTeX: a
    wooden wedge, a shaded ball, and the weight resolved along and normal to
    the slope, with labels set in the page's own text and math fonts.
16. `16-fiziko-telescope-plate.tex`
    -- a Keplerian telescope in which every ray is refracted by fiziko's
    tracing macro; the focus and the exit pupil, where the eye is placed, are
    found where computed rays cross the axis.
17. `17-fiziko-terrestrial-globe.tex`
    -- the earth from three stations using fiziko's globe with its built-in
    coastlines, plus a border row of small globes turned by equal steps.
18. `18-fiziko-mechanics-primer.tex`
    -- a two-column chapter with a loaded cart, a lever in balance, and a
    pendulum, each drawn in place in its column.
19. `19-fiziko-knots-plate.tex` --
    trefoil, cinquefoil, and septafoil cords from one formula each, with
    fiziko finding the crossings and shading the rope.
20. `20-fiziko-phases-of-the-moon.tex`
    -- the moon in eight orbital positions under one fixed light, and the
    same eight phases as seen from the earth by turning the light about a
    fixed sphere.

The `.tex` files compile independently with LuaLaTeX. The `.mp` files are
standalone MetaPost sources with fiziko as an explicit external dependency.
Examples 15 to 20 need both: they are LuaLaTeX documents that load fiziko
through `luamplib`.

## Build

The quickest route is the script for your shell, run from the repository
root. Both compile every example into `build/` and skip the fiziko examples
unless a fiziko checkout is given:

```powershell
.\build.ps1 -Fiziko ..\fiziko            # PowerShell 7
```

```sh
./build.sh ../fiziko                      # POSIX shell
```

Append example names to build only those. The sections below spell out the
same commands by hand.

Requirements:

- LuaLaTeX (TeX Live or MiKTeX);
- the LaTeX packages `fontspec`, `geometry`, `microtype`, `multicol`, `xcolor`,
  `tikz` (with its `lindenmayersystems`, `patterns.meta`, `calc`, and
  `shapes.geometric` libraries), `pgfplots`, `luacode`, and `array`;
- EB Garamond (the `ebgaramond` package in TeX Live and MiKTeX).

From the repository root, create an output directory and compile all
pure-LaTeX examples:

```powershell
# PowerShell 7 on Windows
New-Item -ItemType Directory -Force build | Out-Null
$names = @(
  '01-early-modern-page',
  '02-engraved-optics-plate',
  '04-ornamented-incipit',
  '05-victorian-newspaper',
  '06-natural-history-catalogue',
  '10-lua-table-of-logarithms',
  '11-circumpolar-star-chart',
  '12-snow-crystal-micrographs',
  '13-cooling-curve-graph-paper',
  '14-patent-drawing-sheet'
)
foreach ($name in $names) {
  lualatex -interaction=nonstopmode -halt-on-error `
    -output-directory=build "examples/$name.tex"
}
```

```sh
# POSIX shell on Linux or macOS
mkdir -p build
for name in \
  01-early-modern-page \
  02-engraved-optics-plate \
  04-ornamented-incipit \
  05-victorian-newspaper \
  06-natural-history-catalogue \
  10-lua-table-of-logarithms \
  11-circumpolar-star-chart \
  12-snow-crystal-micrographs \
  13-cooling-curve-graph-paper \
  14-patent-drawing-sheet
do
  lualatex -interaction=nonstopmode -halt-on-error \
    -output-directory=build "examples/$name.tex"
done
```

The source files intentionally reject pdfLaTeX. That engine cannot provide the
OpenType controls demonstrated here.

### Build the fiziko examples

Clone fiziko separately; it is not vendored or relicensed here:

```sh
git clone https://github.com/jemmybutton/fiziko.git ../fiziko
```

MetaPost finds `fiziko.mp` through `MPINPUTS`. Preserve the trailing path
separator so the normal MetaPost search path remains available.

```powershell
# PowerShell 7 on Windows
$env:MPINPUTS = "$((Resolve-Path ../fiziko).Path);"
New-Item -ItemType Directory -Force build | Out-Null
$names = @(
  '03-fiziko-hooke-apparatus',
  '07-fiziko-lens-rays',
  '08-fiziko-atwood-machine',
  '09-fiziko-shading-atlas'
)
foreach ($name in $names) {
  # -job-name is required by MiKTeX's mpost; omit it on TeX Live (see below).
  mpost -interaction=nonstopmode -halt-on-error `
    -job-name=$name -output-directory=build "examples/$name.mp"
}
```

```sh
# POSIX shell on Linux or macOS
export MPINPUTS="$(cd ../fiziko && pwd):"
mkdir -p build
for name in \
  03-fiziko-hooke-apparatus \
  07-fiziko-lens-rays \
  08-fiziko-atwood-machine \
  09-fiziko-shading-atlas
do
  # Run from inside build/: TeX Live's mpost cannot read the mpx file its
  # btex step writes when -output-directory is used.
  (cd build && mpost -interaction=nonstopmode -halt-on-error \
    "../examples/$name.mp")
done
```

Each result is named `build/-1.eps`. The two distributions
disagree about the job-name flag: MiKTeX's `mpost` (3.00, checked September
2026) crashes with an access violation at the first `btex` label unless
`-job-name=` is given, while TeX Live's `mpost` rejects that spelling
and needs no flag at all because the job name defaults to the file's basename.
`build.ps1` detects MiKTeX and adds the flag; `build.sh` never does. Convert
the EPS files to
PDF or PNG with Ghostscript; do not request PDF directly from MetaPost without
checking the file signature. Every source uses `prologues := 3` so labels are
embedded and the output carries an EPSF header.

### Build the LaTeX pages with fiziko inside them

Examples 15 to 20 additionally need:

- the `luamplib` package, which runs MetaPost inside LuaTeX;
- `unicode-math` and the `garamond-math` package, so that the mathematical
  labels on the figures match EB Garamond.

`luamplib` finds `fiziko.mp` through the same `MPINPUTS` variable as above,
so set it before running LuaLaTeX:

```powershell
# PowerShell 7 on Windows
$env:MPINPUTS = "$((Resolve-Path ../fiziko).Path);"
New-Item -ItemType Directory -Force build | Out-Null
$names = @(
  '15-fiziko-inclined-plane',
  '16-fiziko-telescope-plate',
  '17-fiziko-terrestrial-globe',
  '18-fiziko-mechanics-primer',
  '19-fiziko-knots-plate',
  '20-fiziko-phases-of-the-moon'
)
foreach ($name in $names) {
  lualatex -interaction=nonstopmode -halt-on-error `
    -output-directory=build "examples/$name.tex"
}
```

```sh
# POSIX shell on Linux or macOS
export MPINPUTS="$(cd ../fiziko && pwd):"
mkdir -p build
for name in \
  15-fiziko-inclined-plane \
  16-fiziko-telescope-plate \
  17-fiziko-terrestrial-globe \
  18-fiziko-mechanics-primer \
  19-fiziko-knots-plate \
  20-fiziko-phases-of-the-moon
do
  lualatex -interaction=nonstopmode -halt-on-error \
    -output-directory=build "examples/$name.tex"
done
```

These pages share one pattern. `\everymplib` inputs `fiziko.mp`, fixes the
random seed, sets the stroke width and light direction, and tints all strokes
with the page's ink colour through `drawoptions`; each figure is then an
ordinary `mplibcode` environment placed where it belongs in the text. Labels
written between `btex` and `etex` are typeset by the document itself, which is
why they appear in EB Garamond and Garamond Math rather than Computer Modern.

Two pitfalls met while writing them:

- MetaPost's default `scaled` arithmetic rejects `randomseed` values of 4096
  or more, so the seeds in these files are small.
- Do not name a MetaPost variable `floor`: it shadows the `floor` function,
  and fiziko's wood texture then fails with an "Isolated expression" error.

MiKTeX note: the MiKTeX package `luamplib` (2.42.8, checked September 2026)
ships `luamplib.sty` but not the `luamplib.lua` module it requires, so
`\usepackage{luamplib}` fails with "module 'luamplib' not found". The fix is
to extract both files from the CTAN `luamplib.dtx` with
`luatex luamplib.dtx` and place them together in a TEXMF root, then refresh
the file name database. TeX Live is not affected.

## What was corrected from the design discussion

These examples were developed from a Gemini design discussion supplied by the
project owner. The useful ideas survived, but its sample was not copied as-is:

- `Style=Historic` is not used as a generic switch. Historical ligatures are
  requested explicitly with `Ligatures=Historic`.
- A long *s* is an orthographic character, not itself a ligature. The source
  contains `ſ` explicitly in `obſerved`; EB Garamond's `Historic` feature also
  substitutes long-*s* forms in some other contexts.
- `\pagecolor` already comes from `xcolor`; a separate `pagecolor` dependency is
  unnecessary for this use.
- The discussion used `\caption*` without loading a package that defines it.
  The figure MWE uses an ordinary centered text line instead.
- TikZ's random-step decoration is seeded, so recompiling does not redraw the
  plate differently.

## Design notes

This is a period-inspired visual treatment, not a historically exact facsimile.
Real seventeenth-, nineteenth-, and early-twentieth-century publications differ
substantially by press, date, language, paper, and reproduction process.

- Swap EB Garamond for another period-specific OpenType face such as IM FELL
  English or Old Standard when the target publication calls for it. Recheck
  the replacement font's OpenType features rather than assuming the same
  settings are supported.
- Old-style figures are a design choice, not a universal historical rule.
- Warm page color and softened ink simulate a scanned or aged copy; a pristine
  original would not necessarily have those colors.
- Line jitter suggests a handmade plate, while hatching reflects a real graphic
  constraint of monochrome reproduction. Neither reproduces a particular
  engraving process by itself.
- Every fiziko example sets a fixed `randomseed`, because several of the
  library's textures use random sampling and would otherwise change on rebuild.
- The star positions in example 11 are rounded epoch-2000 coordinates; the
  cooling readings in example 13 are a formula with a deterministic ripple,
  not measurements; the lens radii in example 16 were chosen for a legible
  plate, not copied from an instrument; and the log table in example 10 is
  computed, so it is exact to the precision printed.
- The knot routine in fiziko is documented by its author as not especially
  stable. Example 19 uses cords whose crossings are well separated; a new knot
  may need its sampling step or rope width adjusted.

For accessible output, keep body text contrast high, retain all diagram labels
as text, and do not rasterize the final PDF.

## License

The source, prose, and generated examples are licensed under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). When adapting
the project, credit it, link back to the repository, note your changes, and use
the same license for the adaptation.

fiziko itself is not included in this repository. It remains a separate
GPL-3.0 dependency under the terms published by its upstream project.
