(\d)a0(\d)::/=$11b$2
(\d)a1(\d)::/=b$11$2
(\d)b0(\d)::/=a$11$2
(\d)b1(\d)::/=c$10$2
(\d)c0(\d)::/=$11HALT$2
(\d)c1(\d)::/=d$11$2
(\d)d0(\d)::/=$11d$2
(\d)d1(\d)::/=$10a$2
_([abcd]\d)::/=_0$1
([abcd]\d)_::/=$10_
::=
_0a00_
