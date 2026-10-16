"""Algebra 2 port tasks (coverage programme, parallel courses). Owned by the Algebra 2 course chat.

The records are generator-script records (like 8/7): read them with scripts/read-source.py and preview with scripts/legacy_preview.py.

Each tuple is (record, recipe, variant, title, topic, replaces-earlier-adaptation):
  record   the full source ID from curriculum/course-inventory/v0.1/algebra-2-en.json, for example
           'algebra-2-en:node:4'
  recipe   a recipe in src/port-algebra-2.js; it must start with 'a2-'
  variant  None or a short name the recipe switches on
  topic    a topic already used in the cross-course data (curriculum/cross-course/v0.6); a new topic is a shared change
  replaces True when this task takes over a record that an earlier adaptation already serves

scripts/build-port87-map.py --course algebra-2 turns this list into src/port-algebra-2-map.js and
curriculum/source-mappings/port-algebra-2-v0.1.json (block hashes need SAXON_SOURCE_ZIP). Only IDs are written here.
Group entries by batch with a comment line: # Batch A2-1: Lessons ...
"""
TASKS_A2 = [
]
