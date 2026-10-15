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


def _id(short):
    """Full source ID from the short item name, e.g. 'TX4_S01_00073' -> 'intermediate-4-en:bank:Int4_Section01:item:TX4_S01_00073'."""
    return 'intermediate-4-en:bank:Int4_Section%s:item:%s' % (short.split('_')[1][1:], short)


def _t(short, recipe, variant, title, topic, replaces=False):
    return (_id(short), recipe, variant, title, topic, replaces)


TASKS_I4 = [
    # Batch I4-1: Lessons 1-5
    # Lesson 1: Review of Addition
    _t('TX4_S01_00014', 'i4-missing-addend', 'small', 'Find a missing addend (shown addend 2 to 4)', 'equations'),
    _t('TX4_S01_00043', 'i4-missing-addend', 'mid', 'Find a missing addend (shown addend 5 or 6)', 'equations'),
    _t('TX4_S01_00044', 'i4-missing-addend', 'large', 'Find a missing addend (shown addend 7 to 9)', 'equations'),
    _t('TX4_S01_00045', 'i4-missing-addend', 'stacked', 'Find a missing addend in a column', 'equations'),
    _t('TX4_S01_00111', 'i4-missing-addend', 'two-digit', 'Find a two-digit missing addend', 'equations', True),
    _t('TX4_S01_00047', 'i4-add-story', 'two-small', 'Add two small numbers in a story', 'whole-arithmetic'),
    _t('TX4_S01_00108', 'i4-add-story', 'three-2digit', 'Add three two-digit numbers written in words', 'whole-arithmetic'),
    _t('TX4_S01_00109', 'i4-add-story', 'three-2digit-over', 'Add three numbers in words with a sum over 100', 'whole-arithmetic'),
    _t('TX4_S01_00107', 'i4-add-story', 'three-hundreds', 'Add three hundreds written in words', 'whole-arithmetic'),
    _t('TX4_S01_00112', 'i4-add-story', 'two-3digit', 'Add two three-digit numbers written in words', 'whole-arithmetic'),
    _t('TX4_S01_00097', 'i4-column-add', 'four', 'Add a column of four one-digit numbers', 'whole-arithmetic'),
    _t('TX4_S01_00099', 'i4-column-missing', 'three', 'Find the missing number in a column addition', 'equations'),
    _t('TX4_S01_00104', 'i4-add-row', 'six', 'Add six one-digit numbers', 'whole-arithmetic', True),
    _t('TX4_S01_00106', 'i4-add-row', 'seven', 'Add seven one-digit numbers', 'whole-arithmetic', True),
    _t('TX4_S01_00016', 'i4-pic-sentence', 'balls', 'Number sentence for groups of balls', 'whole-arithmetic'),
    _t('TX4_S01_00105', 'i4-pic-sentence', 'dice', 'Number sentence for four number cubes', 'whole-arithmetic'),
    _t('TX4_S01_00049', 'i4-pic-sentence', 'domino', 'Number sentence for two boxes of dots', 'whole-arithmetic'),
    _t('TX4_S01_00046', 'i4-pic-sentence', 'shapes', 'Add two groups of shapes', 'whole-arithmetic'),
    _t('TX4_S01_00052', 'i4-pic-sentence', 'story', 'Number sentence for a three-addend story', 'whole-arithmetic'),
    _t('TX4_S01_00051', 'i4-six-ways', None, 'Six ways to add three numbers', 'whole-arithmetic'),
    # Lesson 2: Missing Addends
    _t('TX4_S01_00075', 'i4-missing-row', 'three', 'Missing addend among three addends', 'equations', True),
    _t('TX4_S01_00042', 'i4-missing-row', 'four', 'Missing addend among four addends', 'equations'),
    _t('TX4_S01_00077', 'i4-missing-row', 'five', 'Missing addend among five addends', 'equations', True),
    _t('TX4_S01_00013', 'i4-missing-row', 'seven', 'Missing addend among seven addends', 'equations'),
    _t('TX4_S01_00119', 'i4-missing-row', 'nine', 'Two-digit missing addend among nine addends', 'equations', True),
    _t('TX4_S01_00114', 'i4-missing-row', 'to-100', 'Missing addend with two-digit addends and a sum of 100', 'equations', True),
    _t('TX4_S01_00116', 'i4-missing-row', 'big', 'Missing addend with two-digit addends and a three-digit sum', 'equations', True),
    _t('TX4_S01_00040', 'i4-column-missing', 'three', 'Find the missing addend in a column of three', 'equations'),
    _t('TX4_S01_00117', 'i4-column-missing', 'six', 'Find the missing addend in a column of six', 'equations'),
    _t('TX4_S01_00118', 'i4-column-missing', 'six-2digit', 'Find a two-digit missing addend in a column of six', 'equations'),
    # Lesson 3: Sequences; Digits
    _t('TX4_S01_00079', 'i4-expanded', None, 'Value of hundreds and tens written as products', 'number-representation'),
    _t('TX4_S01_00012', 'i4-sequence', 'next3-down', 'Next three numbers of a counting-down sequence', 'sequences'),
    _t('TX4_S01_00152', 'i4-sequence', 'next3-up', 'Next three numbers of a counting-up sequence', 'sequences', True),
    _t('TX4_S01_00125', 'i4-sequence', 'blank', 'Missing number in a counting sequence', 'sequences'),
    _t('TX4_S01_00155', 'i4-sequence', 'fill3', 'Three missing numbers in a counting sequence', 'sequences', True),
    _t('TX4_S01_00124', 'i4-circled', None, 'Next circled number in a pattern', 'sequences'),
    _t('TX4_S01_00081', 'i4-count-by', 'nickels', 'Cents in a number of nickels', 'whole-arithmetic'),
    _t('TX4_S01_00121', 'i4-count-by', 'dimes', 'Count dimes by tens', 'whole-arithmetic'),
    _t('TX4_S01_00120', 'i4-count-by', 'wheels', 'Count by twos in a story', 'whole-arithmetic'),
    _t('TX4_S01_00131', 'i4-count-by', 'xs', 'Count a pattern by threes', 'whole-arithmetic'),
    _t('TX4_S01_00011', 'i4-digits', 'count', 'How many digits a number has', 'number-representation'),
    _t('TX4_S01_00038', 'i4-digits', 'last', 'The last digit of a number', 'number-representation'),
    _t('TX4_S01_00039', 'i4-digits', 'first', 'The first digit of a number', 'number-representation'),
    # Lesson 4: Place Value
    _t('TX4_S01_00084', 'i4-place', 'which-4', 'The place of a digit in a four-digit number', 'number-representation'),
    _t('TX4_S01_00056', 'i4-place', 'which-3', 'The place of a digit in a three-digit number', 'number-representation'),
    _t('TX4_S01_00157', 'i4-place', 'place-of', 'The place of one digit in three numbers', 'number-representation'),
    _t('TX4_S01_00134', 'i4-place', 'digit-in', 'The digit in a given place', 'number-representation'),
    _t('TX4_S01_00132', 'i4-place', 'compose', 'Write a number from hundreds, tens and ones', 'number-representation'),
    _t('TX4_S01_00133', 'i4-bills', 'three', 'Money shown by $100, $10 and $1 bills', 'number-representation'),
    _t('TX4_S01_00035', 'i4-bills', 'two', 'Money shown by $10 and $1 bills', 'number-representation'),
    _t('TX4_S01_00010', 'i4-bills', 'compare', 'Compare two amounts of money in bills', 'number-representation'),
    _t('TX4_S01_00158', 'i4-bills', 'draw', 'Draw an amount with $100, $10 and $1 bills', 'number-representation'),
    # Lesson 5: Ordinal Numbers; Months of the Year
    _t('TX4_S01_00135', 'i4-line', 'between', 'People between two places in line', 'whole-arithmetic'),
    _t('TX4_S01_00033', 'i4-line', 'front', 'People in front of a place in line', 'whole-arithmetic'),
    _t('TX4_S01_00034', 'i4-line', 'behind', 'People behind a place in a line of ten', 'whole-arithmetic'),
    _t('TX4_S01_00032', 'i4-order-least', None, 'The smallest of four close numbers', 'number-order'),
    _t('TX4_S01_00008', 'i4-dates', 'month', 'The month in a written date', 'calendar-time'),
    _t('TX4_S01_00057', 'i4-dates', 'month-year', 'The month and year in a written date', 'calendar-time'),
    _t('TX4_S01_00030', 'i4-dates', 'days', 'The number of days in a month', 'calendar-time'),
    _t('TX4_S01_00029', 'i4-dates', 'count-months', 'How many months have 30 or 31 days', 'calendar-time'),
]

# Records consolidated into a port task above (same demand: a choice-only twin or a repeated fixed item).
# Not read by the map builder; the batch decisions files record them.
CONSOLIDATED_I4 = {
    # Batch I4-1
    'TX4_S01_00074': 'TX4_S01_00108', 'TX4_S01_00015': 'TX4_S01_00052', 'TX4_S01_00048': 'TX4_S01_00047',
    'TX4_S01_00103': 'TX4_S01_00047', 'TX4_S01_00098': 'TX4_S01_00097', 'TX4_S01_00100': 'TX4_S01_00099',
    'TX4_S01_00110': 'TX4_S01_00106', 'TX4_S01_00050': 'TX4_S01_00016',
    'TX4_S01_00076': 'TX4_S01_00075', 'TX4_S01_00113': 'TX4_S01_00075', 'TX4_S01_00078': 'TX4_S01_00042',
    'TX4_S01_00041': 'TX4_S01_00013', 'TX4_S01_00101': 'TX4_S01_00040', 'TX4_S01_00102': 'TX4_S01_00040',
    'TX4_S01_00115': 'TX4_S01_00040',
    'TX4_S01_00080': 'TX4_S01_00012', 'TX4_S01_00053': 'TX4_S01_00012', 'TX4_S01_00055': 'TX4_S01_00012',
    'TX4_S01_00054': 'TX4_S01_00152', 'TX4_S01_00153': 'TX4_S01_00152', 'TX4_S01_00154': 'TX4_S01_00152',
    'TX4_S01_00082': 'TX4_S01_00125', 'TX4_S01_00083': 'TX4_S01_00125', 'TX4_S01_00126': 'TX4_S01_00125',
    'TX4_S01_00127': 'TX4_S01_00125', 'TX4_S01_00128': 'TX4_S01_00125', 'TX4_S01_00129': 'TX4_S01_00125',
    'TX4_S01_00156': 'TX4_S01_00155', 'TX4_S01_00037': 'TX4_S01_00011', 'TX4_S01_00123': 'TX4_S01_00011',
    'TX4_S01_00130': 'TX4_S01_00011', 'TX4_S01_00122': 'TX4_S01_00039',
    'TX4_S01_00085': 'TX4_S01_00084', 'TX4_S01_00159': 'TX4_S01_00157', 'TX4_S01_00036': 'TX4_S01_00133',
    'TX4_S01_00086': 'TX4_S01_00135', 'TX4_S01_00009': 'TX4_S01_00135', 'TX4_S01_00136': 'TX4_S01_00135',
    'TX4_S01_00137': 'TX4_S01_00135', 'TX4_S01_00031': 'TX4_S01_00135', 'TX4_S01_00160': 'TX4_S01_00057',
}
