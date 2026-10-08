"""Full current curriculum audit with independent Python oracles, 168 variants/task."""
import subprocess,os
from pathlib import Path
p=Path(__file__).parent
subprocess.run(['python3',str(p/'curriculum87-audit.py')],env={**os.environ,'MATH_AUDIT_VARIANTS':'168','MATH_AUDIT_SEED':'phase2-independent-verification'},check=True)
