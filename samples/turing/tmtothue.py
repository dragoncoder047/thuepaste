#! /usr/bin/env python

left = 89
right = 45

wolfram = {
    'a': (
        (1, right, 'b'), #read 0
        (2, left,  'a'), #read 1
        (1, left,  'a'), #read 2
    ),
    'b': (
        (2, left,  'a'), #read 0
        (2, right, 'b'), #read 1
        (0, right, 'a'), #read 2
    ),
}

bb1 = {
    'a': ((1, right, 'b'), (1, left, 'b')),
    'b': ((1, left, 'a'), (0, left, 'c')),
    'c': ((1, right, 'HALT'), (1, left, 'd')),
    'd': ((1, right, 'd'), (0, right, 'a')),
}

tmdef = bb1

blank = 0

for state, do in tmdef.items():
    for read, (write, direction, newstate) in enumerate(do):
        if direction == left:
            print(f'(\\d){state}{read}(\\d)::/={newstate}$1{write}$2')
        else:
            print(f'(\\d){state}{read}(\\d)::/=$1{write}{newstate}$2')

print(f'_([{"".join(tmdef.keys())}]\\d)::/=_0$1')
print(f'([{"".join(tmdef.keys())}]\\d)_::/=$10_')
print('::=')
print('_0a00_')
