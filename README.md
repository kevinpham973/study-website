# Software Architecture Study Website

Open **dist/index.html** in a browser to browse the generated study notes locally. No server is needed. The website includes topic navigation, full-text search, Python example pages, and reading progress saved in your browser.

The Markdown files in the parent workspace remain the source of the lessons. To refresh the site after editing them, run from the workspace root:

```powershell
python study-website/build.py
```

The build script requires the Python `mistune` package, already available in the development environment. It only reads the root README and Markdown/Python files inside Design Pattern and Cloud Database. Generated pages are stored in dist/content.js.

Deployment is a snapshot: rebuilding local content does not automatically update the hosted website.
