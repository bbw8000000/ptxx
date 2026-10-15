---
title: "datalab-to/indra"
owner: "datalab-to"
name: "indra"
fullName: "datalab-to/indra"
description: "Fast CPU OCR: line detection, CTC recognition, reading order, markdown"
sourceUrl: "https://github.com/datalab-to/indra"
stars: 68
forks: 5
language: "Python"
topics: ["ai", "cpu", "document-parsing", "ocr", "onnx", "pdf"]
license: "Apache-2.0"
homepage: "https://www.datalab.to"
defaultBranch: "main"
snapshotDate: "2026-10-14"
pushedAt: "2026-10-13T15:52:14Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

Datalab

  State of the Art models for Document Intelligence


  
  
  
  


  
  
  


# Indra OCR

Indra OCR is a 1M-parameter OCR model that reads up to 49 pages per second on CPU. It turns PDFs and images into markdown, plain text, or JSON with boxes, and it has these features:

- Throughput - 49 pages/s, 11-17x faster than Tesseract and PaddleOCR on the same machine and pages (table)
- Latency - ~230 ms per page on 4 x86 vCPUs, 12-24x faster than Tesseract and PaddleOCR
- Accuracy - scores 41.3 on OmniParseBench text, ahead of PaddleOCR's PP-OCR text models (35.8) and Tesseract (19.3). Its headline score (62.1) beats PaddleOCR's full PP-StructureV3 pipeline (58.4).
- Layout and boxes - a bounding box for every line and every layout block, with block labels (headings, lists, tables, captions, footnotes, page headers) and reading order
- Digital PDFs - reads the PDF's own text layer in any script, and OCRs only what is missing
- Small - about 18 MB of models on ONNX Runtime, no PyTorch

The main recognizer, `rec.onnx`, has about 1M parameters. See benchmarks for the full results and limitations for what it does not do yet.

Indra OCR is named for [Indra](https://en.wikipedia.org/wiki/Indra).


## Try Datalab's Managed Platform

Indra OCR is built for speed on CPUs. When you need the highest accuracy, on handwriting, math, complex tables and degraded scans, our managed platform runs Chandra, our state of the art OCR model, with zero data retention by default, SOC 2 Type 2, and custom BAAs.

If you have high volume workloads, we offer a batch processing service that can handle 1B+ pages a day.

Get started with **$5 in free credits** - [sign up](https://www.datalab.to/?utm_source=gh-indra) - or try Chandra in our [public playground](https://www.datalab.to/playground?utm_source=gh-indra).

## Quickstart

```shell
pip install indra-ocr

indra-ocr paper.pdf                    # markdown to stdout
indra-ocr *.pdf --out results/         # one .md per input, all cores
indra-ocr scan.png --format json       # lines, boxes, layout blocks, confidences

indra-ocr-viewer                       # local web viewer on http://localhost:8765
```

The first run downloads the models (about 18 MB) from [Hugging Face](https://huggingface.co/datalab-to/indra-ocr).

## Examples

Real Indra OCR outputs on OmniParseBench pages. Colored boxes are layout blocks with their label, faint blue boxes are lines, drawn from the JSON output with no edits.


Scanned upside down: Indra OCR turns the page upright, reads both columns in order and finds the headings.
A journal page with two tables, output as HTML with their captions.


**See more examples, with the markdown output for each →**


# License

The code is Apache 2.0. The model weights use a modified OpenRAIL-M license ([LICENSE](https://huggingface.co/datalab-to/indra-ocr/blob/main/LICENSE)).

# Commercial usage

This code is Apache 2.0, and our model weights use a modified OpenRAIL-M license (free for research, personal use, and startups under $20M funding/revenue, cannot be used competitively with our API). To remove the OpenRAIL license requirements, or for broader commercial licensing, visit our pricing page [here](https://www.datalab.to/pricing?utm_source=gh-indra).

# Installation

```shell
pip install indra-ocr
```

For the latest code from GitHub instead: `pip install git+https://github.com/datalab-to/indra.git`. To let the viewer compare with Tesseract, install `pip install "indra-ocr[tesseract]"` and a Tesseract binary.

Python 3.10 or newer, tested on Linux (x86_64 and aarch64, Python 3.10 to 3.13) and macOS (Apple silicon). It installs ONNX Runtime, OpenCV and pypdfium2, and no PyTorch. The models download from Hugging Face on the first run and are cached. To use a local copy, set `INDRA_OCR_MODEL_DIR` or pass `--model-dir`.

# Usage

## CLI

```shell
indra-ocr paper.pdf                       # markdown to stdout
indra-ocr *.pdf --out results/            # one .md per input
indra-ocr scan.png --format json          # lines, boxes, layout blocks, confidences, timings
indra-ocr paper.pdf --format text         # plain text, one line per detected line
indra-ocr paper.pdf --mode ocr --timings  # ignore the text layer, OCR every page; timings on stderr
indra-ocr paper.pdf --keep-furniture      # keep page headers and footers in the markdown
indra-ocr *.pdf --out results/ --cores 8  # limit the cores (default: all usable cores)
indra-ocr paper.pdf --math                # write math as LaTeX (off by default; slower on math pages)
```

**CLI Options:**
- `--out DIR`: write one file per input (`.md`, `.txt` or `.jsonl`)
- `--format [md|text|json]`: output format (default: md)
- `--mode [auto|ocr|text]`: `auto` reads the text layer where it passes the checks and OCRs elsewhere (default). `ocr` never reads the text layer. `text` uses the text layer even when the checks fail
- `--model-order`: order text-layer lines with the order model, not the PDF content order
- `--no-image-ocr`: on text-layer pages, do not OCR text inside images
- `--cores N`: cores to use, one worker process each (default: all usable cores)
- `--dpi`: render resolution for PDFs (default: 200)
- `--max-pages N`: read at most N pages per file
- `--password`: password for encrypted PDFs
- `--keep-furniture`: keep page headers and footers in the markdown
- `--math`: write math as LaTeX (`$...$`); off by default, see Math
- `--timings`: print per-page source and time to stderr
- `--model-dir`: folder with the models (default: download)

The CLI continues past files it cannot read, and exits with 1 if any failed.

## From python

```python
import indra_ocr

conv = indra_ocr.load(threads=4)          # mode="auto" | "ocr" | "text"
for i, page in conv.convert("paper.pdf"):
    print(page.source, page.timings["total_ms"])
    print(page.markdown)                  # headings, lists, tables as HTML
    page.blocks                           # [{"label", "bbox", "text"}] in reading order
    page.lines                            # [Line(box, text, conf)] in reading order
```

For many pages or files, `convert_many` runs one single-threaded worker process per core, one page per task, and returns results in input order:

```python
import indra_ocr

if __name__ == "__main__":                # worker processes re-import this file
    for path, result in indra_ocr.convert_many(["a.pdf", "b.pdf"], cores=None):
        if isinstance(result, indra_ocr.InputError):
            continue                      # unreadable or locked file
        for i, page in result:
            print(path, i, page.source)
```

Without the `if __name__ == "__main__":` guard (needed on macOS and Windows), `convert_many` warns and reads everything in one process.

`indra_ocr.load` takes `path` (model folder), `threads`, `dpi`, `mode`, `pdf_order`, `image_ocr`, `furniture` and `math`. `conv.convert` takes `max_pages` and `password`.

## Viewer

```shell
indra-ocr-viewer --port 8765              # open http://localhost:8765
```

A local web viewer: drop in a PDF or an image, and each page shows its lines, layout blocks and reading order over the page, with the rendered markdown, the markdown source, the lines with their confidences, the JSON output and the time of each stage. The pipeline options (text layer or OCR, math, headers and footers, reading order, OCR of text inside images, dpi, page limit) are set in the page, and lines, blocks, block labels and reading order can each be shown or hidden. Files stay on your machine. `--tesseract` lets the page compare with Tesseract (needs `pytesseract` and a Tesseract install). Over SSH, forward the port: `ssh -N -L 8765:localhost:8765 host`.

## Output

Every page is a `Page` with:

- `markdown`: headings (`##`), paragraphs, lists, and tables as HTML. Page headers and footers are left out unless `furniture=True` / `--keep-furniture`
- `text`: one line per detected line, in reading order
- `lines`: `Line(box, text, conf)`, box is `x0, y0, x1, y1` in image pixels
- `blocks`: layout blocks in reading order, `{"label", "bbox", "text"}`
- `source`: `text` (PDF text layer), `ocr`, `hybrid` (text layer + OCR of text inside images) or `error`
- `rotation`, `skew`: the quarter or half turn applied (degrees), and the small tilt straightened
- `timings`: per-step milliseconds, with `total_ms`
- `note`: why the page took its path

Block labels: `Text`, `Section-Header`, `Page-Header`, `Page-Footer`, `List-Group`, `Table`, `Caption`, `Footnote`, `Table-Of-Contents`, `Form`. `--format json` writes one JSON object per page with all of these fields.

# Languages

**OCR (scans and images):** Latin (about 50 languages), Cyrillic, Greek, Devanagari, Bengali, and Chinese (simplified and traditional). Each line with Chinese characters goes to the Chinese recognizer.

**Text layer (digital PDFs): any script.** We checked text mode on 1,125 pages from 75 language families. On pages whose layer passes the checks, Indra OCR keeps at least 98% of the layer's characters in every family, including Arabic, Hebrew, Persian, Urdu, Thai, Khmer, Lao, Myanmar, Georgian, Armenian, Ethiopic, the Indic scripts, Chinese, Japanese and Korean. Right-to-left lines keep their right-to-left order.

# Limitations

Indra OCR is built for speed on clean print. It is not the right tool for:

- **Complex tables.** Tables with merged or spanning cells, cell text that wraps over several lines, nested headers, or no ruling lines can come out with cells in the wrong rows or columns. Simple grid tables read well.
- **Handwriting.** Handwritten text is not supported (about 8% on the OmniParseBench handwriting tests).
- **Scripts outside the OCR list.** OCR reads Latin, Cyrillic, Greek, Devanagari, Bengali and Chinese. Other scripts, including Arabic, Hebrew, Thai, Japanese kana and Korean Hangul, work only through a digital PDF's text layer. On scans and images they come out wrong; a Hangul line, for example, comes out as wrong Chinese characters.
- **Degraded scans.** Old, faded or low-resolution scans read poorly (about 20% on the OmniParseBench old-scan tests).

Also:

- Math comes out as plain text unless `--math` is on (see Math).
- No vertical text (such as traditional Chinese newspapers).
- Very wide, banner-shaped pages read poorly.
- Labels inside engineering drawings often come out as small tables.
- Pages above 100 megapixels at 200 dpi render at a lower dpi, so small text on them can be lost.
- The orientation model turns about half of the upright Arabic and Hebrew pages that go to OCR by mistake. Do not rely on it for those scripts.

For these documents, [Chandra on Datalab](https://www.datalab.to/?utm_source=gh-indra) is the accurate option.

# Math

Math is off by default. With `--math` (or `indra_ocr.load(math=True)`), a small classifier finds the lines that hold math, and a second recognizer reads them as text with inline LaTeX (`we have $x _ { i } \leq 1$`).

On OmniParseBench (all 2,937 pages, default settings otherwise):

| | headline | text | tables | layout | math tests |
|---|---|---|---|---|---|
| Indra OCR | 62.1 | 41.4 | 56.4 | 88.5 | 14.3 |
| Indra OCR `--math` | **66.8** | **57.5** | 54.8 | 88.1 | **56.5** |
| PaddleOCR PP-StructureV3 | 58.4 | 55.6 | 47.8 | 71.7 | – |

- With `--math`, Indra OCR is ahead of PaddleOCR's PP-StructureV3 on the headline, text, tables and layout. Without it, PP-StructureV3 leads on text.
- Tables lose 1.5 points: numbers in some table cells are read as math.
- `--math` is slower. On x86 (AMD EPYC Genoa), one page at a time on 4 cores in auto mode, the median page takes ~360 ms with `--math` and ~210 ms without. With one single-threaded worker per core, throughput is about 30% lower on 4 cores and 35% lower on 32 (4.8 vs 6.8 and 29.2 vs 44.9 pages/s, measured in one container on 300 OmniParseBench pages).
- The cost falls on the pages where the math path runs. In auto mode, pages read through a digital PDF's text layer slow down most: their median time per page goes from 130 ms to 345 ms in the throughput run (one single-threaded worker per core).
- Old scanned math gains little (22.2 to 23.1).

The math models download only when `--math` is on.

# Benchmarks

## OmniParseBench

OmniParseBench has 16,288 pass/fail tests on 2,937 pages. The headline is the mean of the text, tables and layout families. All runs: x86, 4 vCPUs per engine, one page at a time, every engine on the same pages with the same scorer and its default settings.


| engine | headline | text | tables | layout | median ms / page |
|---|---|---|---|---|---|
| Indra OCR (auto: text layer + OCR) | 62.1 | 41.3 | **56.4** | **88.6** | **228** |
| Indra OCR (OCR only) | 57.5 | 33.5 | 50.9 | 88.2 | 303 |
| Indra OCR `--math` (auto) | **66.8** | **57.5** | 54.8 | 88.1 | ~360† |
| PaddleOCR PP-OCRv6 small, text models only (RapidOCR) | – | 35.8 | 0.0 | – | 2,685 |
| PaddleOCR PP-StructureV3 (2,918 pages\*) | 58.4 | 55.6 | 47.8 | 71.7 | 40,958 |
| Tesseract 5 (our run, Latin model) | – | 19.3 | 0.0 | – | 5,496 |

- The PP-OCR text models and Tesseract output lines, not tables or layout blocks, so their table scores are 0 and their layout family is not scored.
- PP-StructureV3 is PaddleOCR's full document pipeline (layout, tables, formulas). Without `--math`, it reads text better than Indra OCR (55.6 vs 41.3). With `--math`, Indra OCR is ahead on text too (57.5). It takes about 180 times as long per page as Indra OCR's default mode. \*One of its 150 shards stalled for 6 hours on its first page, so its row leaves out 19 pages.
- Faster settings exist, but we did not score their accuracy. Tesseract with the `eng` model and 1 thread takes 3.4 s a page (6.1 s as run). PP-StructureV3 without formula, seal and chart recognition, unwarping and orientation, and with its mobile OCR models, takes 10.5 s a page. Indra OCR is still 15-45x faster per page.
- The OmniParseBench leaderboard's own Tesseract run scores 17.6 on text.
- Median latency varies by about 15% between runs of the same code. †The `--math` latency is from a separate run on x86 (AMD EPYC Genoa, 4 cores, one page at a time), where the default mode gave 208 ms.

**Chinese** (136 OmniParseBench Chinese tests): Indra OCR 64.7, PaddleOCR PP-OCRv5 mobile Chinese text models 65.4, PP-StructureV3 68.4.

## olmOCR-bench

Born-digital splits and old scans, our harness, 200 dpi:

| split | Indra OCR | Tesseract 4 |
|---|---|---|
| headers_footers | 91.2 | 35.5 |
| multi_column | 70.0 | 70.4 |
| long_tiny_text | 67.9 | 64.0 |
| table_tests | 60.5 | 1.0 |
| old_scans | 20.0 | 18.4 |

## Throughput

The CLI and `convert_many` run one single-threaded worker process per usable core, one page per task, so a single long PDF also uses every core. `--cores` limits it.

Pages per second. Every engine ran on the same x86 machine (AMD EPYC, no GPU) on the same 300 OmniParseBench pages, with one single-threaded worker per core, OCR mode and default settings. Indra OCR is the mean of 3 runs. The other engines ran once.

| engine | 4 cores | 8 cores | 16 cores | 32 cores |
|---|---|---|---|---|
| Indra OCR | **7.3** | **14.2** | **27.2** | **49.4** |
| Indra OCR `--math`† | ~5 | – | – | ~30 |
| PaddleOCR PP-OCRv6 small, text models only (RapidOCR) | 0.65 | 1.24 | 2.42 | 4.28 |
| Tesseract 5 | 0.78 | 1.37 | 2.27 | 2.92 |
| PaddleOCR PP-StructureV3\* | ≤ 0.022 | ≤ 0.044 | ≤ 0.089 | ≤ 0.18 |

At 32 cores, Indra OCR is 11.5x PaddleOCR's PP-OCR text models, 16.9x Tesseract and about 280x PP-StructureV3 (against its upper bound). \*PP-StructureV3 ran a time-capped subset of the pages, so its numbers are upper bounds. †`--math` ran in a separate container with the same CPU type and the same pages, where it gave 4.8 pages/s on 4 cores and 29.2 on 32, against 6.8 and 44.9 without it (about 30% and 35% lower).

Model loading and one warm-up page per worker are not timed. A short 300-page job through `convert_many`, model loading included, runs at 7.2 pages/s on 4 cores and 37.7 on 32.

## Reproducing

```shell
git clone https://github.com/datalab-to/indra.git && cd indra
pip install indra-ocr 'omni-parse-bench[benchmark]'
python bench/opb_indra.py --out runs/opb_auto --mode auto --procs 8
```

Each page runs in a single-threaded worker process, page headers and footers kept. `--mode ocr` gives the OCR-only row, `--math` the `--math` row, `--suites` scores only the listed suites, `--limit N` scores the first N pages, and `--models` points at a local model folder. The run writes `summary.json` (the benchmark's own summary, plus median and p90 ms per page) and `pages.jsonl` (per page: time, source, tests passed).

# Credits

Thank you to the following open source projects:

- ONNX Runtime
- pypdfium2
- OpenCV
- Hugging Face Hub
