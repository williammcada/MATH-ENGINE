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
    # Batch AH-1: Lessons 1-10
    ('algebra-half-en:node:4', 'ah-place-values3', None, 'Values of three digits in a six-digit number', 'number-representation', True),
    ('algebra-half-en:node:5', 'ah-digits-from-places', None, 'Write a number from its named digits', 'number-representation', False),
    ('algebra-half-en:node:6', 'ah-place-value-one', None, 'Value of a digit in a five-digit number', 'number-representation', False),
    ('algebra-half-en:node:8', 'ah-standard-from-expanded', None, 'Standard notation from expanded notation', 'number-representation', False),
    ('algebra-half-en:node:9', 'ah-expanded7', None, 'Seven-digit number in expanded notation', 'number-representation', False),
    ('algebra-half-en:node:10', 'ah-expanded7-choice', None, 'Expanded notation of a seven-digit number', 'number-representation', False),
    ('algebra-half-en:node:12', 'ah-number-words', None, 'Write a whole number in words', 'number-representation', False),
    ('algebra-half-en:node:13', 'ah-words-to-digits', None, 'Whole number from words to digits', 'number-representation', False),
    ('algebra-half-en:node:15', 'ah-add3', None, 'Add three whole numbers', 'whole-arithmetic', False),
    ('algebra-half-en:node:16', 'ah-money-add', 'a', 'Add dollars and cents', 'decimal-arithmetic', False),
    ('algebra-half-en:node:17', 'ah-column-add4', None, 'Add four numbers in columns', 'whole-arithmetic', False),
    ('algebra-half-en:node:18', 'ah-column-add5d', None, 'Add three five-digit numbers', 'whole-arithmetic', False),
    ('algebra-half-en:node:19', 'ah-money-add', 'b', 'Add dollar amounts and cents', 'decimal-arithmetic', False),
    ('algebra-half-en:node:22', 'ah-order-line', None, 'Order integers using a number line', 'number-order', False),
    ('algebra-half-en:node:23', 'ah-order-six', None, 'Order six signed numbers', 'number-order', False),
    ('algebra-half-en:node:24', 'ah-order-five', None, 'Order five signed numbers', 'number-order', False),
    ('algebra-half-en:node:26', 'ah-round-big', None, 'Round to the nearest hundred thousand or million', 'rounding-estimation', False),
    ('algebra-half-en:node:27', 'ah-round-5digit', None, 'Round to the nearest thousand or ten thousand', 'rounding-estimation', False),
    ('algebra-half-en:node:30', 'ah-subtract3', None, 'Subtract three-digit numbers with regrouping', 'whole-arithmetic', False),
    ('algebra-half-en:node:31', 'ah-subtract-column', None, 'Subtract in columns with regrouping', 'whole-arithmetic', False),
    ('algebra-half-en:node:32', 'ah-money-subtract-cents', None, 'Subtract cents from dollars', 'decimal-arithmetic', False),
    ('algebra-half-en:node:34', 'ah-missing-addend', None, 'Missing addend', 'whole-arithmetic', False),
    ('algebra-half-en:node:35', 'ah-missing-subtrahend', None, 'Missing subtrahend', 'whole-arithmetic', False),
    ('algebra-half-en:node:36', 'ah-missing-minuend', None, 'Missing minuend', 'whole-arithmetic', False),
    ('algebra-half-en:node:37', 'ah-missing-addend-column', None, 'Missing addend in columns', 'whole-arithmetic', False),
    ('algebra-half-en:node:38', 'ah-missing-column-mixed', None, 'Missing number in a column addition or subtraction', 'whole-arithmetic', False),
    ('algebra-half-en:node:41', 'ah-multiply-3x2', None, 'Multiply a three-digit number by a two-digit number', 'whole-arithmetic', False),
    ('algebra-half-en:node:42', 'ah-multiply-three', None, 'Multiply three factors', 'whole-arithmetic', False),
    ('algebra-half-en:node:43', 'ah-money-times-tens', None, 'Multiply money by a multiple of ten', 'decimal-arithmetic', False),
    ('algebra-half-en:node:45', 'ah-money-divide', None, 'Divide money by a whole number', 'decimal-arithmetic', False),
    ('algebra-half-en:node:46', 'ah-divide-remainder', None, 'Divide by a two-digit divisor', 'whole-arithmetic', False),
    ('algebra-half-en:node:48', 'ah-missing-factor', 'times', 'Missing factor', 'whole-arithmetic', False),
    ('algebra-half-en:node:49', 'ah-missing-factor', 'dot', 'Missing factor with a dot', 'whole-arithmetic', False),
    ('algebra-half-en:node:50', 'ah-missing-divisor', None, 'Missing divisor in a fraction bar', 'whole-arithmetic', False),
    ('algebra-half-en:node:51', 'ah-missing-dividend', None, 'Missing dividend', 'whole-arithmetic', False),
    ('algebra-half-en:node:53', 'ah-word-pages', None, 'Pages left to read', 'word-equations', False),
    ('algebra-half-en:node:54', 'ah-word-runners', None, 'Runners who signed up later', 'word-equations', False),
    ('algebra-half-en:node:55', 'ah-word-price', None, 'Original price before a reduction', 'word-equations', False),
    ('algebra-half-en:node:56', 'ah-word-lengthen', None, 'How much longer to make it', 'word-equations', False),
    ('algebra-half-en:node:59', 'ah-decimal-words', None, 'Write decimal numbers in words', 'number-representation', False),
    ('algebra-half-en:node:60', 'ah-words-to-decimals', None, 'Write decimal numbers from words', 'number-representation', False),
    ('algebra-half-en:node:61', 'ah-ten-thousandths', None, 'Numeric form with ten-thousandths', 'number-representation', False),
    ('algebra-half-en:node:63', 'ah-decimal-add2', None, 'Add decimals to thousandths', 'decimal-arithmetic', False),
    ('algebra-half-en:node:64', 'ah-decimal-subtract', None, 'Subtract decimals', 'decimal-arithmetic', False),
    ('algebra-half-en:node:65', 'ah-decimal-missing-subtrahend', None, 'Missing number in a decimal subtraction', 'decimal-arithmetic', False),
    ('algebra-half-en:node:66', 'ah-decimal-add4', None, 'Add four decimal numbers', 'decimal-arithmetic', False),
    ('algebra-half-en:node:67', 'ah-decimal-subtract-choice', None, 'Subtract decimals to thousandths', 'decimal-arithmetic', False),
    ('algebra-half-en:node:69', 'ah-round-decimal-place', None, 'Round a decimal to a named place', 'rounding-estimation', False),
    ('algebra-half-en:node:70', 'ah-round-two-places', None, 'Round to two decimal places', 'rounding-estimation', False),
    ('algebra-half-en:node:73', 'ah-decimal-multiply', None, 'Multiply decimals', 'decimal-arithmetic', False),
    ('algebra-half-en:node:74', 'ah-decimal-missing-dividend', None, 'Missing dividend with a decimal divisor', 'decimal-arithmetic', False),
    ('algebra-half-en:node:75', 'ah-decimal-multiply-small', None, 'Multiply by a small decimal', 'decimal-arithmetic', False),
    ('algebra-half-en:node:77', 'ah-divide-by-hundredths', None, 'Divide by hundredths', 'decimal-arithmetic', False),
    ('algebra-half-en:node:78', 'ah-divide-by-4-8', None, 'Divide by 4 or 8 to a decimal', 'decimal-arithmetic', False),
    ('algebra-half-en:node:79', 'ah-decimal-missing-factor', None, 'Missing decimal factor', 'decimal-arithmetic', False),
    ('algebra-half-en:node:80', 'ah-divide-round', None, 'Divide decimals and round', 'decimal-arithmetic', False),
    ('algebra-half-en:node:81', 'ah-divide-by-tenths', None, 'Divide by tenths', 'decimal-arithmetic', False),
    ('algebra-half-en:node:83', 'ah-estimate-product', None, 'Estimate and then multiply', 'rounding-estimation', False),
    ('algebra-half-en:node:84', 'ah-estimate-product2', None, 'Estimate and then multiply by a small decimal', 'rounding-estimation', False),
    ('algebra-half-en:node:87', 'ah-times-power10', None, 'Multiply by 100 or 1000', 'decimal-arithmetic', False),
    ('algebra-half-en:node:88', 'ah-divide-power10', None, 'Divide by 100 or 1000', 'decimal-arithmetic', False),
    ('algebra-half-en:node:89', 'ah-times-power10-small', None, 'Multiply a small decimal by a power of ten', 'decimal-arithmetic', False),
    ('algebra-half-en:node:90', 'ah-divide-power10-large', None, 'Divide by 10,000 or 100,000', 'decimal-arithmetic', False),
    ('algebra-half-en:node:92', 'ah-order-decimals', None, 'Order decimal numbers', 'number-order', False),
    ('algebra-half-en:node:93', 'ah-graph-decimals', None, 'Graph decimals on a number line', 'number-order', False),
    ('algebra-half-en:node:94', 'ah-order-decimals', None, 'Order decimals from least to greatest', 'number-order', False),
    ('algebra-half-en:node:97', 'ah-segment-difference', None, 'Find a segment length with decimals', 'segments', False),
    ('algebra-half-en:node:98', 'ah-segment-difference-whole', None, 'Find a segment length', 'segments', False),
    ('algebra-half-en:node:100', 'ah-angle-definition', None, 'Define a type of angle', 'angles', False),
    ('algebra-half-en:node:101', 'ah-angle-degrees', None, 'Degrees in right and straight angles', 'angles', False),
    ('algebra-half-en:node:102', 'ah-classify-angle', None, 'Classify an angle', 'angles', False),
    ('algebra-half-en:node:104', 'ah-perimeter-l', None, 'Perimeter of an L-shaped figure', 'perimeter', True),
    ('algebra-half-en:node:105', 'ah-perimeter-notch', None, 'Perimeter of a notched rectangle', 'perimeter', False),
    ('algebra-half-en:node:107', 'ah-divisibility-lists', None, 'Divisibility by 2, 3, 5 and 10', 'number-theory', False),
    ('algebra-half-en:node:108', 'ah-not-divisible', None, 'Number not divisible by 2, 3, 5 or 10', 'number-theory', False),
    ('algebra-half-en:node:109', 'ah-divisible-both', None, 'Number divisible by two numbers', 'number-theory', False),
]
