changelog
=========

Track changes to the Prezi system: receive events through POST, display in an easy-to-filter way

```sh
prezicurl https://changelog.prezi.com/api/events \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"criticality": 1, "unix_timestamp": 1395334488, "category": "misc", "description": "cli test"}'
```

(prezicurl: https://github.com/prezi/prezi-attic/blob/master/prezicurl)
