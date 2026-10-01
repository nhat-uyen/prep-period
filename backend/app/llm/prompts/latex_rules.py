# TODO: need to improve by putting what are the rules for LaTeX formatting
LATEX_RULES = r"""
Math formatting (LaTeX):
Write these in LaTeX wrapped in dollar signs, and double every backslash in the JSON:
  - student instructions
  - problems' questions, instructions, answers, and explanations
Correct:   "question": "Graph the equation $y = \\frac{1}{2}x + 1$."
Incorrect: "question": "Graph the equation y = \frac{1}{2}x + 1."
Never write math as plain text (no x^2, 1/2, sqrt(x)).
"""