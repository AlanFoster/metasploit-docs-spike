# Metasploit Docs Spike 

# Getting started

```bash
yarn
yarn run
```

Visit `http://localhost:8000`.

Edit files in `/content/` and see live updates.

# Extracting msf metadata

```
msfconsole --quiet --no-database --resource ./extract_module_metadata.rc --execute-command 'exit'
cp ../metasploit-framework/tmp/module_metadata.json ./contents/modules/details
```    

## Noted Problems

### Extracting module metadata

Extracting the metadata from modules takes at least 0.3 seconds per module, due to calculating payload sizes for
every module create.

### Non-deterministic metadata
 
Each time the metadata extraction script runs, it produces different output.

Some modules use random default values, leading to diffs between builds such as:

```patch
--- a/contents/modules/details/exploits/multi/postgres/postgres_copy_from_program_cmd_exec.json
+++ b/contents/modules/details/exploits/multi/postgres/postgres_copy_from_program_cmd_exec.json
@@ -263,7 +263,7 @@
       "type": "string",
       "name": "TABLENAME",
       "required": true,
-      "default": "LsTZYp9fg",
+      "default": "6EQ2Obh6Dx",
       "aliases": [
 
       ],
``` 

Modules seem to swap between being advanced or not, but only when the metadata extraction is ran in parallel:

```
--- a/contents/modules/details/auxiliary/admin/http/typo3_winstaller_default_enc_keys.json
+++ b/contents/modules/details/auxiliary/admin/http/typo3_winstaller_default_enc_keys.json
@@ -115,7 +115,7 @@
       "aliases": [
 
       ],
-      "advanced": false,
+      "advanced": true,
       "description": "A proxy chain of format type:host:port[,type:host:port][...]"
     },
```

### Algolia

It's possible to wire up custom Algolia integration + search functionality, as this spike uses. However, algolia offer
an out of the box solution for documentation sites - https://docsearch.algolia.com/

This would still give us the same benefits as wiring up our own indexing, but wouldn't require any ongoing development
effort:

> Use metrics such as Popular Queries, No Results, and Click Position to better optimize your content.

> we'll crawl your website at most every 24 hours.
