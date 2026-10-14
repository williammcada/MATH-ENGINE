#!/usr/bin/env python3
"""Catalog and source mapping for the 8/7 port tasks (coverage programme batches).

Each task names the source record it ports. Open records keep their own ID (course-87-en:item:...), so they
become working entries; a port that replaces an earlier, less faithful adaptation uses course-87-en:port:...
so the earlier entry and everything derived from it stay intact.

Block hashes come from the private recovery ZIP when SAXON_SOURCE_ZIP is set; otherwise the committed
mapping is reused. Only IDs and hashes are written here, never source text.
"""
import hashlib, json, os, pathlib, zipfile
root = pathlib.Path(__file__).resolve().parents[1]
COURSE = 'Introduction to PreAlgebra (8/7)'
# (record, recipe, variant, title, topic, replaces-earlier-adaptation)
TASKS = [
 ('SN870002', 'money-divide', None, 'Divide a money amount by a two-digit number', 'decimal-arithmetic', False),
 ('SX870018', 'money-times', None, 'Multiply a money amount by a multiple of ten', 'decimal-arithmetic', True),
 ('SN870005', 'evaluate-quotient', None, 'Evaluate a quotient for a given value', 'expressions', False),
 ('SN870181', 'evaluate-product-difference', None, 'Evaluate a(b − c) with signed and decimal values', 'expressions', False),
 ('SN870006', 'evaluate-product-over-sum', None, 'Evaluate jk/(j + k)', 'expressions', False),
 ('SX870024', 'property-statement', 'commutative', 'Illustrate the commutative property', 'expressions', True),
 ('SX870025', 'property-statement', 'associative', 'Illustrate the associative property', 'expressions', True),
 ('SN870153', 'property-test', None, 'Decide whether an operation is commutative or associative', 'expressions', False),
 ('SN870015', 'missing-dividend', None, 'Find a missing dividend', 'equations', False),
 ('SX870115', 'compare-number-line', None, 'Compare integers using a number line', 'integers', False),
 ('SX870033', 'subtraction-number-line', None, 'Show a subtraction on a number line', 'integers', False),
 ('SN870156', 'subtraction-number-line', 'signed', 'Show a signed subtraction on a number line', 'integers', False),
 ('SX870122', 'place-of-digit', None, 'Name the place of a digit (through trillions)', 'number-representation', False),
 ('SN870023', 'place-of-digit', 'mid', 'Name the place of a digit in a large number', 'number-representation', False),
 ('AHG50141', 'underlined-digit-value', None, 'Write the value of an underlined digit in short word form', 'number-representation', False),
 ('SX870001', 'expanded-notation', None, 'Write a number in expanded notation with multiplication', 'number-representation', True),
 ('SN870020', 'words-to-digits', None, 'Write a number given in words using digits', 'number-representation', False),
 ('SX870041', 'factor-lists', None, 'List factors, common factors and the GCF', 'number-theory', False),
 ('SN870025', 'gcf-two', None, 'Find the greatest common factor of two numbers', 'number-theory', True),
 ('SN870158', 'which-divisible', None, 'Choose the number divisible by a given number', 'number-theory', False),
 ('SN870027', 'which-divisible', 'large', 'Choose the larger number divisible by a given number', 'number-theory', False),
 ('SX760040', 'divisible-by-both', None, 'Decide whether a number is divisible by two numbers', 'number-theory', False),
 ('SN870179', 'which-has-property', None, 'Choose the number with a divisibility property', 'number-theory', False),
 ('SX870119', 'name-linear-figures', None, 'Name lines, rays and segments with symbols', 'geometry-properties', False),
 ('SN870592', 'angle-kind', None, 'Classify an angle from a straight or right angle', 'geometry-properties', False),
 ('SN870188', 'percent-shaded-square', None, 'Percent of a square that is shaded', 'fraction-decimal-percent', False),
 ('SN870161', 'percent-shaded-square', 'about', 'Estimate the percent of a diagram that is shaded', 'fraction-decimal-percent', False),
 ('SN870358', 'percent-grid', None, 'Percent of a hundred grid that is shaded', 'fraction-decimal-percent', False),
 ('SN870032', 'ruler-length', None, 'Measure a segment to the nearest sixteenth of an inch', 'measurement', False),
 ('SN870183', 'ruler-length', 'eighths', 'Measure a segment to the nearest eighth of an inch', 'measurement', False),
 ('SN870037', 'add-unit-fraction', None, 'Add a unit fraction with a like denominator', 'fractions', False),
 ('SN870035', 'multiply-fractions', None, 'Multiply two fractions', 'fractions', False),
 ('SN870036', 'subtract-like-fractions', None, 'Subtract fractions with like denominators', 'fractions', False),
 ('SN870824', 'reciprocal', 'prime-den', 'Find the reciprocal of a fraction', 'fractions', False),
 ('SX870049', 'reciprocal', 'how-many', 'How many of a fraction are in one', 'fractions', False),
 ('SN870034', 'reciprocal', None, 'Find the reciprocal of a proper or improper fraction', 'fractions', False),
 ('SX870052', 'add-to-mixed', None, 'Add three like fractions; answer as a mixed number', 'fractions', False),
 ('SX870053', 'add-to-mixed', 'mixed-numbers', 'Add two mixed numbers with like denominators', 'fractions', False),
 ('SX870123', 'circles-mixed', 'draw', 'Draw shaded circles for a mixed number', 'fractions', False),
 ('SX540337', 'circles-mixed', 'identify', 'Name the mixed number and improper fraction shown', 'fractions', False),
 ('DBFF0203', 'mixed-to-improper', 'wide', 'Write a mixed number as an improper fraction', 'fractions', False),
 ('SN870043', 'mixed-to-improper', None, 'Write a mixed number as an improper fraction', 'fractions', False),
]

def main():
    inv = json.loads((root / 'curriculum/course-inventory/v0.1/course-87-en.json').read_text())
    lesson = {r['id']: r['lessonId'] for r in inv}
    mapping_path = root / 'curriculum/source-mappings/port87-v0.1.json'
    old = {m['sourceRecord']: m['sourceBlockSha256'] for m in json.loads(mapping_path.read_text())} if mapping_path.exists() else {}
    hashes = {}
    zpath = os.environ.get('SAXON_SOURCE_ZIP')
    if zpath:
        items = json.loads(zipfile.ZipFile(zpath).read('course-87-en.json'))['items']
        hashes = {i['id']: [b['sha256'] for b in i['blocks'] if b['type'] in (1, 3, 4, 5, 6, 8)] for i in items}
    entries, mapping = [], []
    for rec, recipe, variant, title, topic, replaces in TASKS:
        record = 'course-87-en:item:' + rec
        sid = ('course-87-en:port:' if replaces else 'course-87-en:item:') + rec
        e = dict(sourceId=sid, sourceRecord=record, lessonId=lesson[record], course=COURSE, family='structured-port87',
                 recipe=recipe, title=title, topic=topic, origin='original-source-informed-port', exactLegacyReproduction=False)
        if variant:
            e['variant'] = variant
        entries.append(e)
        h = hashes.get(record) or old.get(record)
        assert h, 'no block hashes for ' + record + ' (set SAXON_SOURCE_ZIP)'
        mapping.append(dict(sourceId=sid, sourceRecord=record, lessonId=lesson[record], course=COURSE, family='structured-port87',
                            recipe=recipe, variant=variant, title=title, relationship='original-source-informed-port',
                            exactLegacyReproduction=False, sourceBlockSha256=h))
    assert len({e['sourceId'] for e in entries}) == len(entries)
    (root / 'src/port87-map.js').write_text('(function(root){const data=' + json.dumps(entries, ensure_ascii=False, separators=(',', ':')) +
        ';if(typeof module!=="undefined"&&module.exports)module.exports=data;root.MathPort87Map=data;})(typeof globalThis!=="undefined"?globalThis:this);\n')
    mapping_path.write_text(json.dumps(mapping, indent=1, ensure_ascii=False) + '\n')
    print('port87 tasks:', len(entries))

main()
