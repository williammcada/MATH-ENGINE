"""Algebra 1/2 port tasks (coverage programme, parallel courses). Owned by the Algebra 1/2 course chat.

The records are generator-script records (like 8/7): read them with scripts/read-source.py and preview with scripts/legacy_preview.py.

Each tuple is (record, recipe, variant, title, topic, replaces-earlier-adaptation):
  record   the full source ID from curriculum/course-inventory/v0.1/algebra-half-en.json, for example
           'algebra-half-en:node:4'
  recipe   a recipe in src/port-algebra-half.js; it must start with 'ah-'
  variant  None or a short name the recipe switches on
  topic    a topic already used in the cross-course data (curriculum/cross-course/v0.6); a new topic is a shared change
  replaces True when this task takes over a record that an earlier adaptation already serves

scripts/build-port87-map.py --course algebra-half turns this list into src/port-algebra-half-map.js and
curriculum/source-mappings/port-algebra-half-v0.1.json (block hashes need SAXON_SOURCE_ZIP). Only IDs are written here.
Group entries by batch with a comment line: # Batch AH-1: Lessons ...
"""
TASKS_AH = [
]
