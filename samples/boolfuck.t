#::=http://progopedia.com/dialect/boolfuck/
_!l::=_!0x
([^!frltoc])([frltoc])::/=$2$1
([ynx])([^pa])::/=$2$1
!f0::=!1x
!f1::=!0x
!c[01]::/=!0x
(0|1)!l::/=!$1x
!r(0|1)([^_])::/=$1!$2x
!t0::=!0n
!t1::=!1y
!o0::=!0xaQ
!o1::=!1xaR
aQ::=~0
aR::=~1
!r(0|1)_::/=$1!0_x
P+::=f+p
P>::=r>p
P;::=o;p
P<::=l<p
P-::=c-p
xp::=P
P[::=ta[
P]::=ta]
ya[::=[P
na]::=]P
P.::=.P
na[::=[j
ya]::=J]
([^j])j\]::/=$1]P
\[J([^J])::/=[P$1
([^j])(j+)\[::/=$1[$2j
\](J+)([^J])::/=J$1]$2
([^j])(j+)([^\[\]])::/=$1$3$2
([^\[\]])(J+)([^J])::/=$2$1$3
([^j])j(j+)\]::/=$1]$2
\[J(J+)::/=$1[
?::=:::
::=
_!0_P?
