# jalkiwotda-hsr

Browser extension for generating character build reports from HoYoLAB pages.

> Generate community benchmark reports for your Honkai: Star Rail characters directly from HoYoLAB.

---

## What is this?

This project is a browser extension that analyzes character information from HoYoLAB and generates an HTML report based on community build benchmarks.

The benchmark data originates from the Korean community spreadsheet project commonly known as:

> “이정도면 잘키웠다”

A community-maintained reference that defines practical character build expectations for subculture games such as Honkai: Star Rail.

Examples include:

* recommended Speed thresholds
* Crit Rate / Crit DMG expectations
* Break Effect targets
* usable endgame stat ranges
* practical build baselines

---

## Background

As the game continued to grow, the number of playable characters increased significantly.

Checking every character manually became increasingly difficult.

The official in-game showcase API also has several limitations:

* only publicly visible profiles can be checked
* only showcased characters are accessible
* usually limited to around 6 characters
* difficult to review an entire account at once

However, HoYoLAB provides much more detailed character information through its website.

The problem is that directly using private APIs would require:

* authenticated login handling
* session management
* maintenance against API changes
* privacy/security concerns

---

## Solution

Instead of relying on private APIs, this project uses a simpler approach:

1. Open your HoYoLAB character page
2. The extension reads character data directly from the page HTML
3. The data is analyzed locally
4. An HTML report is generated automatically

This approach allows:

* no credential collection
* no external server requirement
* full-account analysis
* local-only processing
* easier maintenance compared to reverse-engineered APIs

---

## Features

* HoYoLAB character page parsing
* Multi-character analysis
* Community benchmark comparison
* HTML report generation
* Local-only processing
* No login/token storage
* Lightweight browser extension workflow

---

## Planned Features

* Better visualized reports
* Historical build snapshots
* Character filtering/search
* Import/export support
* Versioned benchmark datasets
* Multi-language support

---

## Disclaimer

This is an unofficial fan-made project.

All benchmark data is community-driven and may change depending on game balance updates and meta shifts.

This project is not affiliated with HoYoverse.

---

## License

MIT License
