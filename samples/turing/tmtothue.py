#! /usr/bin/env python

left = 89
right = 45

tmdef = {
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

blank = 0

for state, do in tmdef.items():
    for read, (write, direction, newstate) in enumerate(do):
        if direction == left:
            print(f'(\\d){state}{read}(\\d)::/={newstate}$1{write}$2')
        else:
            print(f'(\\d){state}{read}(\\d)::/=$1{write}{newstate}$2')

print('_(\\w\\d)::/=_0$1')
print('(\\w\\d)_::/=$10_')
print('::=')
print('_0a00_')
