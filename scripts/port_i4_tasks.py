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
    _t('TX4_S01_00047', 'i4-add-story', 'two-small', 'Add two small numbers in a story', 'whole-arithmetic'),
    _t('TX4_S01_00108', 'i4-add-story', 'three-2digit', 'Add three two-digit numbers written in words', 'whole-arithmetic'),
    _t('TX4_S01_00109', 'i4-add-story', 'three-2digit-over', 'Add three numbers in words with a sum over 100', 'whole-arithmetic'),
    _t('TX4_S01_00107', 'i4-add-story', 'three-hundreds', 'Add three hundreds written in words', 'whole-arithmetic'),
    _t('TX4_S01_00112', 'i4-add-story', 'two-3digit', 'Add two three-digit numbers written in words', 'whole-arithmetic'),
    _t('TX4_S01_00097', 'i4-column-add', 'four', 'Add a column of four one-digit numbers', 'whole-arithmetic'),
    _t('TX4_S01_00099', 'i4-column-missing', 'three', 'Find the missing number in a column addition', 'equations'),
    _t('TX4_S01_00016', 'i4-pic-sentence', 'balls', 'Number sentence for groups of balls', 'whole-arithmetic'),
    _t('TX4_S01_00105', 'i4-pic-sentence', 'dice', 'Number sentence for four number cubes', 'whole-arithmetic'),
    _t('TX4_S01_00049', 'i4-pic-sentence', 'domino', 'Number sentence for two boxes of dots', 'whole-arithmetic'),
    _t('TX4_S01_00046', 'i4-pic-sentence', 'shapes', 'Add two groups of shapes', 'whole-arithmetic'),
    _t('TX4_S01_00052', 'i4-pic-sentence', 'story', 'Number sentence for a three-addend story', 'whole-arithmetic'),
    _t('TX4_S01_00051', 'i4-six-ways', None, 'Six ways to add three numbers', 'whole-arithmetic'),
    # Lesson 2: Missing Addends
    _t('TX4_S01_00042', 'i4-missing-row', 'four', 'Missing addend among four addends', 'equations'),
    _t('TX4_S01_00013', 'i4-missing-row', 'seven', 'Missing addend among seven addends', 'equations'),
    _t('TX4_S01_00040', 'i4-column-missing', 'three', 'Find the missing addend in a column of three', 'equations'),
    _t('TX4_S01_00117', 'i4-column-missing', 'six', 'Find the missing addend in a column of six', 'equations'),
    _t('TX4_S01_00118', 'i4-column-missing', 'six-2digit', 'Find a two-digit missing addend in a column of six', 'equations'),
    # Lesson 3: Sequences; Digits
    _t('TX4_S01_00079', 'i4-expanded', None, 'Value of hundreds and tens written as products', 'number-representation'),
    _t('TX4_S01_00012', 'i4-sequence', 'next3-down', 'Next three numbers of a counting-down sequence', 'sequences'),
    _t('TX4_S01_00153', 'i4-sequence', 'next3-up', 'Next three numbers of a counting-up sequence', 'sequences'),
    _t('TX4_S01_00125', 'i4-sequence', 'blank', 'Missing number in a counting sequence', 'sequences'),
    _t('TX4_S01_00156', 'i4-sequence', 'fill3', 'Three missing numbers in a counting sequence', 'sequences'),
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
    # Batch I4-2: Lessons 6-10 and Investigation 1
    # Lesson 6: Review of Subtraction
    _t('TX4_S01_00007', 'i4-subtract', 'when-small', 'The difference when a small number is subtracted', 'whole-arithmetic'),
    _t('TX4_S01_00028', 'i4-subtract', 'when-20s', 'Subtract a one-digit number from a number in the twenties', 'whole-arithmetic'),
    _t('TX4_S01_00026', 'i4-subtract', 'facts', 'Subtraction facts in a column', 'whole-arithmetic'),
    _t('TX4_S01_00060', 'i4-fact-family', 'write', 'Write the fact family for three numbers', 'whole-arithmetic'),
    _t('TX4_S01_00058', 'i4-fact-family', 'finish', 'Finish a fact family', 'whole-arithmetic'),
    _t('TX4_S01_00059', 'i4-fact-family', 'same', 'Are two facts in the same fact family?', 'whole-arithmetic'),
    # Lesson 7: Writing Numbers Through 999
    _t('TX4_S01_00087', 'i4-order', 'third', 'The third number from least to greatest', 'number-order'),
    _t('TX4_S01_00005', 'i4-blocks', None, 'Number shown by hundred flats and unit squares', 'number-representation'),
    _t('TX4_S01_00025', 'i4-words-number', 'to-digits', 'Write a three-digit number from words', 'number-representation'),
    _t('TX4_S01_00163', 'i4-words-number', 'to-words', 'Write a three-digit number in words', 'number-representation'),
    _t('TX4_S01_00142', 'i4-add-story', 'two-2digit', 'Add two two-digit numbers written in words', 'whole-arithmetic'),
    # Lesson 8: Adding Money
    _t('TX4_S01_00088', 'i4-money-add', 'story-regroup', 'Add two dollar amounts in a story, with regrouping', 'whole-arithmetic'),
    _t('TX4_S01_00004', 'i4-money-add', 'story-small', 'Add two dollar amounts in a story', 'whole-arithmetic'),
    _t('TX4_S01_00021', 'i4-money-add', 'story-over', 'Add two dollar amounts with a total over $100', 'whole-arithmetic'),
    _t('TX4_S01_00022', 'i4-money-add', 'stacked-one', 'Add a one-digit dollar amount in a column, with regrouping', 'whole-arithmetic'),
    _t('TX4_S01_00023', 'i4-money-add', 'row-noregroup', 'Add two-digit dollar amounts in a row', 'whole-arithmetic'),
    # Lesson 9: Adding with Regrouping
    _t('TX4_S01_00089', 'i4-add-2digit', 'to-ten', 'Add 1 to make the next ten in a story', 'whole-arithmetic'),
    _t('TX4_S01_00003', 'i4-money-add', 'stacked-regroup', 'Add two-digit dollar amounts in a column, with regrouping', 'whole-arithmetic'),
    _t('TX4_S01_00019', 'i4-money-add', 'stacked-big', 'Add dollar amounts in a column, total near $100', 'whole-arithmetic'),
    _t('TX4_S01_00018', 'i4-money-add', 'row-regroup', 'Add two-digit dollar amounts in a row, with regrouping', 'whole-arithmetic'),
    _t('TX4_S01_00020', 'i4-add-2digit', 'stacked', 'Add two-digit numbers in a column, with regrouping', 'whole-arithmetic'),
    # Lesson 10: Even and Odd Numbers
    _t('TX4_S01_00090', 'i4-even-odd', 'which-even', 'Which number is even', 'number-theory'),
    _t('TX4_S01_00091', 'i4-even-odd', 'digits', 'Which arrangement of three digits is even', 'number-theory'),
    _t('TX4_S01_00002', 'i4-even-odd', 'two-rows', 'A total that fits two equal rows', 'number-theory'),
    _t('TX4_S01_00017', 'i4-even-odd', 'two-rows-not', 'A total that cannot fit two equal rows', 'number-theory'),
    _t('TX4_S01_00001', 'i4-even-odd', 'set-odd', 'A set of odd numbers', 'number-theory'),
    _t('TX4_S01_00063', 'i4-even-odd', 'set-even', 'A set of even numbers', 'number-theory'),
    _t('TX4_S01_00147', 'i4-even-odd', 'make-even-3', 'Make an even number from three digits', 'number-theory'),
    _t('TX4_S01_00148', 'i4-even-odd', 'make-even-4', 'Make an even number in a range from four digits', 'number-theory'),
    _t('TX4_S01_00167', 'i4-even-odd', 'odd-or-even', 'Is a number odd or even', 'number-theory'),
    _t('TX4_S01_00062', 'i4-even-odd', 'yes-no', 'Is a number even (or odd): yes or no', 'number-theory'),
    _t('TX4_S01_00064', 'i4-even-odd', 'between', 'Write an odd or even number in a range', 'number-theory'),
    _t('TX4_S01_00072', 'i4-even-odd', 'remainder', 'A remainder is less than the divisor', 'number-theory'),
    # Investigation 1: Number Lines
    _t('TX4_S01_00073', 'i4-numline', 'which-arrow', 'Which arrow points to a number', 'number-order'),
    _t('TX4_S01_00094', 'i4-numline', 'tens', 'Read a number line marked in tens', 'number-order'),
    _t('TX4_S01_00095', 'i4-numline', 'fives', 'Read a number line marked in fives', 'number-order'),
    _t('TX4_S01_00096', 'i4-numline', 'twenty-fives', 'Read a number line marked in twenty-fives', 'number-order'),
    _t('TX4_S01_00149', 'i4-numline', 'integers', 'Read a negative number on a number line', 'integers'),
    _t('TX4_S01_00150', 'i4-write-compare', 'one-digit', 'Write a comparison sentence with a symbol', 'number-order'),
    _t('TX4_S01_00151', 'i4-write-compare', 'three-digit', 'Compare two numbers written in words, with a symbol', 'number-order'),
    _t('TX4_S01_00071', 'i4-write-compare', 'negative', 'Write a comparison with a negative number', 'integers'),
    _t('TX4_S01_00168', 'i4-compare', 'three-digit', 'Compare three-digit numbers', 'number-order'),
    _t('TX4_S01_00171', 'i4-compare', 'words', 'Compare numbers written in words', 'number-order'),
    _t('TX4_S01_00172', 'i4-compare', 'expr-sub', 'Compare two differences', 'number-order'),
    _t('TX4_S01_00173', 'i4-compare', 'expr-mixed', 'Compare a sum with a product', 'number-order'),
    _t('TX4_S01_00174', 'i4-compare', 'expr-add', 'Compare two sums', 'number-order'),
    _t('TX4_S01_00068', 'i4-compare', 'negatives', 'Compare two negative numbers', 'integers'),
    _t('TX4_S01_00067', 'i4-graphed-set', None, 'Name the set of numbers graphed', 'integers'),
    _t('TX4_S01_00069', 'i4-seq-tenth', None, 'Next three terms and the tenth term of a sequence', 'sequences'),
    _t('TX4_S01_00070', 'i4-compare-words', None, 'Write a comparison with negative numbers in words', 'integers'),
    # Batch I4-3: Lessons 11-16
    # Lesson 11: Addition Word Problems with Missing Addends
    _t('TX4_S02_00015', 'i4-missing-story', 'small', 'Missing addend in a story (totals to 31)', 'word-equations'),
    _t('TX4_S02_00051', 'i4-missing-story', 'two-digit', 'Missing addend in a story (totals 35 to 46)', 'word-equations'),
    _t('TX4_S02_00066', 'i4-missing-story', 'words-money', 'How much more money is needed (amounts in words)', 'word-equations'),
    _t('TX4_S02_00108', 'i4-missing-story', 'words-2digit', 'Missing two-digit addend in a story in words', 'word-equations'),
    _t('TX4_S02_00110', 'i4-missing-story', 'words-3digit', 'Missing addend with a three-digit total in words', 'word-equations'),
    _t('TX4_S02_00111', 'i4-missing-story', 'map', 'Distance between two towns west of a third', 'word-equations'),
    _t('TX4_S02_00069', 'i4-missing-story', 'two-takeaways', 'How many are left after two amounts are given away', 'word-equations'),
    # Lesson 12: Missing Numbers in Subtraction
    _t('TX4_S02_00070', 'i4-add-3digit', 'story-2', 'Add a two-digit amount to a three-digit amount in a story', 'whole-arithmetic'),
    _t('TX4_S02_00137', 'i4-missing-sub', 'subtrahend-small', 'Missing number subtracted from a teen number', 'equations'),
    _t('TX4_S02_00014', 'i4-missing-sub', 'subtrahend-2digit', 'Missing two-digit number subtracted, in a column', 'equations'),
    _t('TX4_S02_00046', 'i4-missing-sub', 'minuend-2digit', 'Missing two-digit number subtracted from, in a column', 'equations'),
    _t('TX4_S02_00047', 'i4-missing-sub', 'minuend-row', 'Missing number subtracted from, in a sentence', 'equations'),
    # Lesson 13: Adding Three-Digit Numbers
    _t('TX4_S02_00013', 'i4-add-3digit', 'money-three-big', 'Add three dollar amounts with a total over $1000', 'whole-arithmetic'),
    _t('TX4_S02_00045', 'i4-add-3digit', 'money-three', 'Add three three-digit dollar amounts', 'whole-arithmetic'),
    _t('TX4_S02_00043', 'i4-add-3digit', 'stacked', 'Add three-digit numbers in a column', 'whole-arithmetic'),
    _t('TX4_S02_00044', 'i4-add-3digit', 'money-stacked', 'Add three-digit dollar amounts in a column', 'whole-arithmetic'),
    _t('TX4_S02_00114', 'i4-add-3digit', 'story', 'Add two three-digit dollar amounts in a story', 'whole-arithmetic'),
    _t('TX4_S02_00122', 'i4-add-3digit', 'over-1000', 'Add three-digit numbers with a sum over 1000', 'whole-arithmetic'),
    # Lesson 14: Subtracting Two-Digit and Three-Digit Numbers; Missing Two-Digit Addends
    _t('TX4_S02_00012', 'i4-sub', 'no-regroup-3', 'Subtract three-digit numbers without regrouping', 'whole-arithmetic'),
    _t('TX4_S02_00016', 'i4-sub', 'no-regroup-2', 'Subtract two-digit numbers in a column without regrouping', 'whole-arithmetic'),
    _t('TX4_S02_00018', 'i4-sub', 'regroup-2', 'Subtract two-digit numbers in a column with regrouping', 'whole-arithmetic'),
    _t('TX4_S02_00011', 'i4-missing-2digit', 'row', 'Missing two-digit addend without regrouping', 'equations'),
    _t('TX4_S02_00126', 'i4-missing-2digit', 'stacked', 'Missing two-digit addend in a column', 'equations'),
    # Lesson 15: Subtracting Two-Digit Numbers with Regrouping
    _t('TX4_S02_00077', 'i4-sub', 'story-money', 'Subtract dollar amounts in a story, with regrouping', 'whole-arithmetic'),
    _t('TX4_S02_00131', 'i4-sub', 'money-regroup-stacked', 'Subtract two-digit dollar amounts in a column, with regrouping', 'whole-arithmetic'),
    _t('TX4_S02_00010', 'i4-sub', 'regroup-2', 'Subtract two-digit numbers in a column with regrouping', 'whole-arithmetic'),
    _t('TX4_S02_00039', 'i4-sub', 'regroup-small', 'Two-digit subtraction with a one-digit difference', 'whole-arithmetic'),
    # Lesson 16: Expanded Form; More on Missing Numbers in Subtraction
    _t('TX4_S02_00053', 'i4-expanded-form', 'sum-3', 'Expanded form of a three-digit number', 'number-representation'),
    _t('TX4_S02_00009', 'i4-expanded-form', 'sum-4', 'Expanded form of a four-digit number', 'number-representation'),
    _t('TX4_S02_00036', 'i4-expanded-form', 'standard', 'The number for an expanded form', 'number-representation'),
    _t('TX4_S02_00127', 'i4-missing-sub', 'subtrahend-2digit', 'Missing two-digit number subtracted, in a column', 'equations'),
    _t('TX4_S02_00008', 'i4-missing-3digit', 'addend', 'Missing three-digit addend in a column', 'equations'),
    _t('TX4_S02_00033', 'i4-missing-3digit', 'subtrahend', 'Missing three-digit number subtracted', 'equations'),
    _t('TX4_S02_00133', 'i4-missing-3digit', 'subtrahend-stacked', 'Missing three-digit number subtracted, in a column', 'equations'),
    _t('TX4_S02_00134', 'i4-missing-3digit', 'minuend', 'Missing three-digit number subtracted from, in a column', 'equations'),
    _t('TX4_S02_00034', 'i4-missing-3digit', 'minuend-row', 'Missing number subtracted from, with two-digit parts', 'equations'),
]

# Records consolidated into a port task above (same demand: a choice-only twin or a repeated fixed item).
# Not read by the map builder; the batch decisions files record them.
CONSOLIDATED_I4 = {
    # Batch I4-1
    'TX4_S01_00074': 'TX4_S01_00108', 'TX4_S01_00015': 'TX4_S01_00052', 'TX4_S01_00048': 'TX4_S01_00047',
    'TX4_S01_00103': 'TX4_S01_00047', 'TX4_S01_00098': 'TX4_S01_00097', 'TX4_S01_00100': 'TX4_S01_00099',
    'TX4_S01_00050': 'TX4_S01_00016',
    'TX4_S01_00075': 'TX4_S01_00042', 'TX4_S01_00076': 'TX4_S01_00042', 'TX4_S01_00077': 'TX4_S01_00042',
    'TX4_S01_00113': 'TX4_S01_00042', 'TX4_S01_00078': 'TX4_S01_00042',
    'TX4_S01_00041': 'TX4_S01_00013', 'TX4_S01_00101': 'TX4_S01_00040', 'TX4_S01_00102': 'TX4_S01_00040',
    'TX4_S01_00115': 'TX4_S01_00040',
    'TX4_S01_00080': 'TX4_S01_00012', 'TX4_S01_00053': 'TX4_S01_00012', 'TX4_S01_00055': 'TX4_S01_00012',
    'TX4_S01_00054': 'TX4_S01_00153', 'TX4_S01_00152': 'TX4_S01_00153', 'TX4_S01_00154': 'TX4_S01_00153',
    'TX4_S01_00082': 'TX4_S01_00125', 'TX4_S01_00083': 'TX4_S01_00125', 'TX4_S01_00126': 'TX4_S01_00125',
    'TX4_S01_00127': 'TX4_S01_00125', 'TX4_S01_00128': 'TX4_S01_00125', 'TX4_S01_00129': 'TX4_S01_00125',
    'TX4_S01_00155': 'TX4_S01_00156', 'TX4_S01_00037': 'TX4_S01_00011', 'TX4_S01_00123': 'TX4_S01_00011',
    'TX4_S01_00130': 'TX4_S01_00011', 'TX4_S01_00122': 'TX4_S01_00039',
    'TX4_S01_00085': 'TX4_S01_00084', 'TX4_S01_00159': 'TX4_S01_00157', 'TX4_S01_00036': 'TX4_S01_00133',
    'TX4_S01_00086': 'TX4_S01_00135', 'TX4_S01_00009': 'TX4_S01_00135', 'TX4_S01_00136': 'TX4_S01_00135',
    'TX4_S01_00137': 'TX4_S01_00135', 'TX4_S01_00031': 'TX4_S01_00135', 'TX4_S01_00160': 'TX4_S01_00057',
    # Batch I4-2
    'TX4_S01_00006': 'TX4_S01_00060', 'TX4_S01_00161': 'TX4_S01_00060', 'TX4_S01_00162': 'TX4_S01_00060',
    'TX4_S01_00027': 'TX4_S01_00026', 'TX4_S01_00138': 'TX4_S01_00026', 'TX4_S01_00139': 'TX4_S01_00026',
    'TX4_S01_00024': 'TX4_S01_00005', 'TX4_S01_00140': 'TX4_S01_00025', 'TX4_S01_00141': 'TX4_S01_00025',
    'TX4_S01_00143': 'TX4_S01_00025', 'TX4_S01_00165': 'TX4_S01_00163', 'TX4_S01_00164': 'TX4_S01_00163',
    'TX4_S01_00061': 'TX4_S01_00163', 'TX4_S01_00166': 'TX4_S01_00163', 'TX4_S01_00144': 'TX4_S01_00004',
    'TX4_S01_00145': 'TX4_S01_00023', 'TX4_S01_00146': 'TX4_S01_00020', 'TX4_S01_00093': 'TX4_S01_00090',
    'TX4_S01_00092': 'TX4_S01_00002', 'TX4_S01_00065': 'TX4_S01_00001', 'TX4_S01_00066': 'TX4_S01_00167',
    'TX4_S01_00169': 'TX4_S01_00168', 'TX4_S01_00170': 'TX4_S01_00168',
    # Batch I4-3
    'TX4_S02_00065': 'TX4_S02_00015', 'TX4_S02_00068': 'TX4_S02_00015', 'TX4_S02_00050': 'TX4_S02_00015',
    'TX4_S02_00049': 'TX4_S02_00015', 'TX4_S02_00107': 'TX4_S02_00015', 'TX4_S02_00067': 'TX4_S02_00015',
    'TX4_S02_00109': 'TX4_S02_00066', 'TX4_S02_00112': 'TX4_S02_00110',
    'TX4_S02_00048': 'TX4_S02_00014', 'TX4_S02_00071': 'TX4_S02_00137', 'TX4_S02_00138': 'TX4_S02_00047',
    'TX4_S02_00115': 'TX4_S02_00043', 'TX4_S02_00116': 'TX4_S02_00043', 'TX4_S02_00123': 'TX4_S02_00045',
    'TX4_S02_00113': 'TX4_S02_00044',
    'TX4_S02_00017': 'TX4_S02_00012', 'TX4_S02_00118': 'TX4_S02_00012',
    'TX4_S02_00124': 'TX4_S02_00016', 'TX4_S02_00041': 'TX4_S02_00011', 'TX4_S02_00040': 'TX4_S02_00011',
    'TX4_S02_00075': 'TX4_S02_00126', 'TX4_S02_00076': 'TX4_S02_00126', 'TX4_S02_00139': 'TX4_S02_00126', 'TX4_S02_00042': 'TX4_S02_00126',
    'TX4_S02_00117': 'TX4_S02_00014',
    'TX4_S02_00079': 'TX4_S02_00131', 'TX4_S02_00073': 'TX4_S02_00044', 'TX4_S02_00037': 'TX4_S02_00010', 'TX4_S02_00038': 'TX4_S02_00010',
    'TX4_S02_00119': 'TX4_S02_00010', 'TX4_S02_00130': 'TX4_S02_00010', 'TX4_S02_00132': 'TX4_S02_00010',
    'TX4_S02_00080': 'TX4_S01_00025', 'TX4_S02_00081': 'TX4_S02_00127', 'TX4_S02_00129': 'TX4_S02_00127',
    'TX4_S02_00052': 'TX4_S02_00009', 'TX4_S02_00035': 'TX4_S02_00008',
    'TX4_S02_00120': 'TX4_S02_00126', 'TX4_S02_00135': 'TX4_S02_00133',
    'TX4_S02_00140': 'TX4_S02_00133', 'TX4_S02_00136': 'TX4_S02_00134', 'TX4_S02_00128': 'TX4_S02_00046',
    'TX4_S01_00111': 'TX4_S02_00011',
}

# Records left as they are (covered-provisional, served by an earlier adaptation) because porting them would need a
# shared-file change: see docs/change-specs/coverage-i4-pending-requests-v0.1.md. Not read by the map builder.
PENDING_I4 = {
    # Batch I4-1 (request R3: replacing these earlier adaptations changes the count in tests/structured-bank-audit.py)
    'TX4_S01_00104': 'R3', 'TX4_S01_00106': 'R3', 'TX4_S01_00110': 'R3',
    'TX4_S01_00114': 'R3', 'TX4_S01_00116': 'R3', 'TX4_S01_00119': 'R3',
    # Batch I4-3 (request R3)
    'TX4_S02_00072': 'R3', 'TX4_S02_00074': 'R3', 'TX4_S02_00125': 'R3', 'TX4_S02_00078': 'R3',
    'TX4_S02_00147': 'R3', 'TX4_S02_00082': 'R3',
}
