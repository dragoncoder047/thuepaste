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

## samples/turing/wolfram.t

The first Thue program I wrote using the new regular expression rules. This is an emulation of the [2-state 3-symbol Turing machine](https://en.wikipedia.org/wiki/Wolfram%27s_2-state_3-symbol_Turing_machine) designed by Stephen Wolfram that has since been proved to be universal.

## samples/turing/bb1.t

Another Turing machine. This is the 4-state 2-symbol busy beaver found [here](https://en.wikipedia.org/wiki/Busy_beaver).

## samples/boolfuck.t

The first major undertaking I wrote in Thue. It simulates a dialect of the Boolfuck programming language. There is no `,` for user input, `;` for output outputs a literal `0` or `1` , and there is a `-` that will set the bit to 0 if it was 1 or leave it at zero if it was already 0. This program is also the first to take advantage of the regular expression rules to emulate an infinite number of similar rules using repititions.
