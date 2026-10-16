"""Intermediate 4 port tasks (coverage programme, parallel courses). Owned by the Intermediate 4 course chat.

The records are ExamView items (like Course 1): read them with scripts/read-examview.py.

Each tuple is (record, recipe, variant, title, topic, replaces-earlier-adaptation):
  record   the full source ID from curriculum/course-inventory/v0.1/intermediate-4-en.json, for example
           'intermediate-4-en:bank:Int4_Section01:item:TX4_S01_00073'
  recipe   a recipe in src/port-intermediate-4.js; it must start with 'i4-'
  variant  None or a short name the recipe switches on
  topic    a topic already used in the cross-course data (curriculum/cross-course/v0.6); a new topic is a shared change
  replaces True when this task takes over a record that an earlier adaptation already serves

scripts/build-port87-map.py --course intermediate-4 turns this list into src/port-intermediate-4-map.js and
curriculum/source-mappings/port-intermediate-4-v0.1.json (block hashes need SAXON_SOURCE_ZIP). Only IDs are written here.
Group entries by batch with a comment line: # Batch I4-1: Lessons ...
"""
TASKS_I4 = [
]
