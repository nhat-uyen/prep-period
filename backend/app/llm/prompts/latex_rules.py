# TODO: need to improve by putting what are the rules for LaTeX formatting
LATEX_RULES = r"""
Math formatting (LaTeX):
Put every equation, expression, and variable in LaTeX inside dollar signs.
Plain numbers in ordinary sentences stay as plain text.
Use \\times for multiplication and \\div for division, never * or /.
Write money as \\$15 (escaped dollar sign).

Correct:   "question": "Graph the equation $y = \\frac{1}{2}x + 1$."
Incorrect: "question": "Graph the equation y = \frac{1}{2}x + 1."
Never write math as plain text (no x^2, 1/2, sqrt(x)).
"""