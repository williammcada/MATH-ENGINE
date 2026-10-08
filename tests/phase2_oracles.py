"""Independent standard-library oracles for the expanded numerical contracts."""
from fractions import Fraction as F
from statistics import median
from functools import reduce
import math

def numeric(r,p):
 if r=='9.6':
  x,y,z=map(F,[p.x,p.y,p.z]);return (x+y if p.branch<2 else x-y)*z if p.branch%2 else x+(y*z if p.branch<2 else -y*z)
 if r=='13.1':return [p.a*p.b,p.b,p.a][p.branch]
 if r=='16.1':return F(p.amount,p.factor) if p.reverse else p.amount*p.factor
 if r=='19.1':return sum(p.sides)
 if r=='25.1':return [p.d,p.d*F(p.whole)]
 if r=='27.2':
  l=math.lcm(*p.values);return [l,2*l,3*l]
 if r=='28.1':return [p.a*p.b+p.c,p.b,p.c,10][p.branch]
 if r=='29.3':
  a=10*((p.a+5)//10);b=10*((p.b+5)//10);return [a+b,a-b,a*b,F(a,b)][p.branch]
 if r=='37.2':return F(p.a*p.b,2)
 if r in ['38.2','38.3']:return [p.values[0],p.values[-1]-p.values[0],sum(p.values)][p.branch]
 if r=='39.2':return [p.a,p.b,p.a*p.c,p.b*p.c][p.branch]
 if r=='40.4':return [90-p.a,180-p.a,p.a][p.branch]
 if r=='41.1':return [p.a*p.b*p.c,2*(p.a+p.b),p.a*p.b,F(p.a*p.b,2)][p.branch]
 if r in ['43.4','48.2']:return [F(p.a,100),F(p.a,100),p.a]
 if r in ['49.1','56.1']:
  left=p.a*p.radix+p.b;right=p.c*p.radix+p.d;return list(divmod(left-right if p.subtract else left+right,p.radix))
 if r in ['52.1','52.2']:return [p.a+p.b*p.c**2,(p.a+p.b)*p.c-p.b,p.a*p.c,p.a**2-p.b+p.c][p.branch]
 if r=='58.3':return p.x if p.branch else p.a*p.x+p.b
 if r=='67.2':return [p.sides+1,2*p.sides,p.sides+1] if p.pyramid else [p.sides+2,3*p.sides,2*p.sides]
 if r=='69.1':return [F(p.a,10),p.b+p.c+1]
 if r=='88.2':return F(p.a,p.factor) if p.reverse else p.a*p.factor
 if r=='94.2':return F(1,2**p.a) if p.branch==0 else F(1,6) if p.branch==1 else F(p.a*p.b,(p.a+p.b)**2)
 if r=='94.3':return F(p.a*(p.b if p.branch else p.a-1),(p.a+p.b)*(p.a+p.b-1))
 if r=='95.1':return [F(314*p.a*p.a*p.b,100),p.a*p.b*p.c,F(p.a*p.b*p.c,2)][p.branch]
 if r=='98.2':return F(1,p.b) if p.shrink else p.b
 if r=='98.3':return p.a if p.shrink else p.a*p.b
 if r=='105.1':return [2*(p.a*p.b+p.a*p.c+p.b*p.c),F(628*p.a*(p.a+p.b),100),12*p.a**2+12*p.a*p.b][p.branch]
 if r=='INV3.2':return p.point
 if r=='INV4.2':return [len(p.v),min(p.v),max(p.v)]
 if r in ['INV4.4','INV4.6']:
  v=sorted(p.v);n=len(v);s=[min(v),F(median(v[:n//2])),F(median(v)),F(median(v[(n+1)//2:])),max(v)]
  return s if r=='INV4.4' else [s[2],s[3]-s[1],s[4]-s[0]]
 raise AssertionError('Missing phase2 numeric oracle: '+r)

def textual(r,p):
 if r=='INV4.3':
  v=sorted(p.v);counts={x:v.count(x) for x in set(v)};m=max(counts.values());modes=sorted(x for x,n in counts.items() if n==m) if m>1 else [];modes=', '.join(map(str,modes)) if modes else 'none';middle=median(v);middle=str(int(middle)) if int(middle)==middle else str(middle);return f'{modes}; {max(v)-min(v)}; {middle}'
 if r=='15.3':return 'ABC'[next(i for i,x in enumerate(p.options) if F(x)!=F(p.a,p.d))]
 if r=='18.6':return ['true','false','true','false','false','true'][p.branch]
 if r=='62.2':return '; '.join(['BC','AC','AB'][i] for i in sorted(range(3),key=lambda i:p.angles[i]))
 if r=='67.1':return ['rectangular prism','cylinder','sphere','cone','square pyramid','triangular prism'][p.branch]
 if r=='79.2':return ['insufficient','greater','less','equal'][p.branch]
 if r=='INV3.1':return ['x-axis','y-axis','origin','I','II','III','IV'][p.branch]
 raise AssertionError('Missing phase2 text oracle: '+r)
