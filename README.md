# Software Architecture Study Website

Open **dist/index.html** in a browser to browse the generated study notes locally. No server is needed. The website includes topic navigation, full-text search, Python example pages, and reading progress saved in your browser.

The Markdown files in the parent workspace remain the source of the lessons. To refresh the site after editing them, run from the workspace root:

```powershell
python study-website/build.py
```

The build script requires the Python `mistune` package, already available in the development environment. It reads the root README and discovers topic folders automatically: a topic folder must contain its own README.md. It includes Markdown and Python files inside each topic, excluding hidden directories and Python caches. The study-website folder itself is excluded. Generated pages are stored in dist/content.js.

## Add another lecture

1. Create a folder beside Design Pattern and Cloud Database.
2. Add its README.md and lesson Markdown files.
3. Run `python study-website/build.py` from the workspace root.
4. Refresh the browser. The new topic appears without editing HTML or JavaScript.

Sidebar groups can be expanded or collapsed using their headings. Search temporarily expands matching groups. Opening a lesson expands its group. Reading progress and expanded groups are stored locally in your browser, when browser storage is available.

Design Pattern is a top-level collapsible topic. Its Creational, Structural, and Behavioral categories are nested collapsible sections inside it. Collapsing Design Pattern hides all three categories. Cloud Database is a separate top-level topic.

## Host on another service

Upload **the contents of study-website/dist** to a static website host. Put index.html at the hosting root and keep app.js, styles.css, and content.js beside it. There is no server application or framework build required.

You do not need a ZIP, the .openai directory, the Markdown sources, or the whole project just to host the generated website. The .openai/hosting.json file is metadata for the previous Sites deployment; other static hosts do not need it.

To move your editable study workspace to another computer, copy the **whole workspace**, including the original lecture Markdown files and study-website/build.py. Keep the generated dist folder too. Install mistune in the new Python environment if needed before rebuilding. You can omit .git directories, __pycache__, and old deployment archives.

The website uses system fonts, so it does not need to download a font to display properly. Reading progress is local to each browser and is not automatically transferred with the files.

Deployment is a snapshot: rebuilding local content does not automatically update the hosted website.
