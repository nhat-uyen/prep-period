import re

# LaTeX commands starting with a letter that JSON treats as an escape (f, t, b, r, n)
_LATEX_CMDS = (
    "frac|dfrac|tfrac|times|theta|text|textbf|textit|tan|tau|to|top|triangle|"
    "beta|bar|binom|boxed|begin|rightarrow|right|rho|neq|ne|nu|nabla|not|notin|ni"
)
_BAD_ESCAPE = re.compile(rf"(?<!\\)\\(?=(?:{_LATEX_CMDS})\b)")

def repair_latex_escapes(raw: str) -> str:
    # \frac -> \\frac (skips ones already correctly escaped)
    return _BAD_ESCAPE.sub(r"\\\\", raw)