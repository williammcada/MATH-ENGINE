"""Algebra 1 port tasks (coverage programme, parallel courses). Owned by the Algebra 1 course chat.

The records are generator-script records (like 8/7): read them with scripts/read-source.py and preview with scripts/legacy_preview.py.

Each tuple is (record, recipe, variant, title, topic, replaces-earlier-adaptation):
  record   the full source ID from curriculum/course-inventory/v0.1/algebra-1-en.json, for example
           'algebra-1-en:node:4'
  recipe   a recipe in src/port-algebra-1.js; it must start with 'a1-'
  variant  None or a short name the recipe switches on
  topic    a topic already used in the cross-course data (curriculum/cross-course/v0.6); a new topic is a shared change
  replaces True when this task takes over a record that an earlier adaptation already serves

scripts/build-port87-map.py --course algebra-1 turns this list into src/port-algebra-1-map.js and
curriculum/source-mappings/port-algebra-1-v0.1.json (block hashes need SAXON_SOURCE_ZIP). Only IDs are written here.
Group entries by batch with a comment line: # Batch A1-1: Lessons ...
"""
N = 'algebra-1-en:node:'
TASKS_A1 = [
    # Batch A1-1: Lessons 1-6
    (N + '4', 'a1-mixed-add', None, 'Add two mixed numbers with unlike denominators', 'fractions', True),
    (N + '5', 'a1-mixed-sub', None, 'Subtract mixed numbers with unlike denominators', 'fractions', False),
    (N + '6', 'a1-mixed-three', None, 'Add and subtract three mixed numbers', 'fractions', False),
    (N + '7', 'a1-improper-add', None, 'Add two improper fractions written as mixed numbers', 'fractions', False),
    (N + '8', 'a1-mixed-sub', 'mc', 'Subtract mixed numbers with regrouping', 'fractions', False),
    (N + '10', 'a1-seg-part', None, 'Find a missing segment length with mixed numbers', 'segments', False),
    (N + '11', 'a1-seg-sum', None, 'Add three segment lengths with mixed numbers', 'segments', False),
    (N + '15', 'a1-angle-defs', None, 'Define angle types and give right and straight angle measures', 'angles', False),
    (N + '16', 'a1-angle-formed', None, 'Name the angle formed by two right angles or perpendicular lines', 'angles', False),
    (N + '17', 'a1-classify-angle', None, 'Classify an angle from its measure', 'angles', False),
    (N + '19', 'a1-polygon-kind', None, 'Equiangular, equilateral and regular polygons', 'geometry-properties', False),
    (N + '20', 'a1-polygon-name', None, 'Name a polygon from its number of sides', 'geometry-properties', False),
    (N + '22', 'a1-triangle-defs', None, 'Define triangles by sides and by angles', 'geometry-properties', False),
    (N + '23', 'a1-right-tri-angle', None, 'Find an acute angle of a right triangle', 'angles', False),
    (N + '24', 'a1-tri-third', None, 'Find the third angle of a triangle', 'angles', False),
    (N + '25', 'a1-isosceles-angles', None, 'Find the angles of an isosceles triangle', 'angles', False),
    (N + '26', 'a1-iso-theorem', None, 'Equal sides are opposite equal angles', 'geometry-properties', False),
    (N + '27', 'a1-tri-sum', None, 'Sum of the angles of a triangle', 'angles', False),
    (N + '28', 'a1-right-tri-x', None, 'Find the other acute angle of a right triangle', 'angles', False),
    (N + '30', 'a1-quad-defs', None, 'Define quadrilaterals', 'geometry-properties', False),
    (N + '31', 'a1-quad-name', None, 'Name a quadrilateral from its properties', 'geometry-properties', False),
    (N + '32', 'a1-quad-best', None, 'Choose the best name for a quadrilateral', 'geometry-properties', False),
    (N + '35', 'a1-square-side', None, 'Side of a square from its perimeter', 'perimeter', False),
    (N + '36', 'a1-rect-perimeter', None, 'Perimeter of a rectangle', 'perimeter', False),
    (N + '37', 'a1-step-perimeter', None, 'Perimeter of an L-shaped figure', 'perimeter', False),
    (N + '38', 'a1-notch-perimeter', 'notch', 'Perimeter of a figure with a step', 'perimeter', False),
    (N + '39', 'a1-notch-perimeter', 'stairs', 'Perimeter of a stair-step figure', 'perimeter', False),
    (N + '40', 'a1-poly-perimeter', None, 'Perimeter of a polygon from its side lengths', 'perimeter', False),
    (N + '42', 'a1-circumference', 'radius', 'Circumference from the radius', 'circle-measurement', False),
    (N + '43', 'a1-circumference', 'diameter', 'Circumference from the diameter', 'circle-measurement', False),
    (N + '44', 'a1-circumference', 'back', 'Radius or diameter from a circumference in terms of pi', 'circle-measurement', False),
    (N + '45', 'a1-semi-perim', 'one', 'Perimeter of a rectangle with a semicircle', 'circle-measurement', False),
    (N + '46', 'a1-semi-perim', 'both', 'Perimeter of figures made of rectangles and semicircles', 'circle-measurement', False),
    (N + '47', 'a1-semi-perim', 'notch', 'Perimeter of a rectangle with a semicircle cut out', 'circle-measurement', False),
    (N + '48', 'a1-circumference', 'mc', 'Circumference using 3.14 for pi', 'circle-measurement', False),
    (N + '52', 'a1-natural', None, 'Natural numbers and counting numbers', 'sets', False),
    (N + '56', 'a1-frac-prod3', None, 'Multiply three fractions', 'fractions', False),
    (N + '57', 'a1-mixed-prod3', None, 'Multiply three mixed numbers', 'fractions', False),
    (N + '58', 'a1-mixed-div', None, 'Divide mixed numbers', 'fractions', False),
    (N + '59', 'a1-complex-frac', None, 'Simplify a complex fraction of mixed numbers', 'fractions', False),
    (N + '60', 'a1-frac-prod-cancel', None, 'Multiply fractions by cancelling common factors', 'fractions', False),
    (N + '61', 'a1-mixed-div', 'table', 'Divide mixed numbers (choice)', 'fractions', False),
    (N + '64', 'a1-op-names', 'two', 'Names for the results of operations', 'whole-arithmetic', False),
    (N + '65', 'a1-op-names', 'one', 'Name the result of an operation', 'whole-arithmetic', False),
    (N + '67', 'a1-dec-div', None, 'Divide decimal numbers', 'decimal-arithmetic', False),
    (N + '68', 'a1-dec-mul', None, 'Multiply decimal numbers', 'decimal-arithmetic', False),
    (N + '69', 'a1-dec-sub', None, 'Subtract decimal numbers', 'decimal-arithmetic', False),
    (N + '70', 'a1-dec-add', None, 'Add decimal numbers', 'decimal-arithmetic', False),
    (N + '73', 'a1-unit-chain', 'two', 'Convert units with two unit multipliers', 'measurement', False),
    (N + '74', 'a1-unit-chain', 'mixed', 'Convert between metric and US units with two unit multipliers', 'measurement', False),
    (N + '75', 'a1-unit-chain', 'three', 'Convert units with three unit multipliers', 'measurement', False),
    (N + '79', 'a1-sets', None, 'Write the natural numbers, whole numbers and integers in braces', 'sets', False),
    (N + '80', 'a1-set-name', None, 'Name a set from its roster', 'sets', False),
    (N + '82', 'a1-abs', 'decimal', 'Absolute value of a negative decimal', 'integers', False),
    (N + '83', 'a1-abs', 'expr', 'Absolute value of a sum or difference', 'integers', False),
    (N + '84', 'a1-abs', 'simple', 'Absolute value of an integer', 'integers', False),
    (N + '86', 'a1-name', 'commutative', 'Commutative property of addition', 'expressions', False),
    (N + '87', 'a1-signed-sum', None, 'Add two signed numbers', 'integers', False),
    (N + '90', 'a1-name', 'inverse', 'Another name for the opposite of a number', 'integers', False),
    (N + '91', 'a1-signed-sum', 'pos-neg', 'Add a positive and a negative number', 'integers', False),
    (N + '93', 'a1-three-sum', None, 'Add three signed numbers', 'integers', False),
    (N + '96', 'a1-seven-sum', None, 'Simplify a string of signed numbers', 'integers', False),
    (N + '97', 'a1-seven-sum', 'mc', 'Simplify a string of signed numbers (negative start)', 'integers', False),
    (N + '99', 'a1-abs-ops', None, 'Simplify with absolute value and signed numbers', 'integers', False),
    (N + '100', 'a1-abs-ops', 'mc', 'Simplify with absolute value in the middle', 'integers', False),
]
