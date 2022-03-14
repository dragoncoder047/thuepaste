# Descriptions of example Thue programs

## samples/hello.t

The classic Hello World program. Starts with a single `@`, which immediately triggers the single rule, to print `Hello World!` and delete the `@`. The program then immediately halts.

## samples/truthmachine.t

A truth machine. It will prompt you for a string. Upon recieving `0`, it will print that and halt. Upon recieving `1`, it will print `11111111111111.....` forever.

## samples/sierpinski.t

One of the programs that came with the original Thue jsfiddle (linked above). Prints out a bit of Sierpinski trangle.

## samples/incany.t

This one from Chris Pressey will add one to any binary number that you provide as input and remove leading zeros.

## samples/nondeterministic.t

This one shows off the random part of Thue. It contains two rules that both have the same left side, so Thue has to randomly pick one to apply.

## samples/notmarkov.t

This one I found on the Wikipedia page shows the difference between Thue and another probablilistic algorithm, Markov chains. While a Markov chain given the same rules would correctly convert the asterisks into their number in Roman numerals (`XVIII`), Thue fails miserably here -- and produces abscurdities such as `IVXIIIV` or even `IXIX`.

## samples/tounary.t

This little one I wrote myself. Give it any number in decimal (of any number of digits) and it will convert it into that number of asterisks.

## samples/todecimal.t

This one, also by me, does the reverse of the previous sample. Given a string of asterisks, it will count them.