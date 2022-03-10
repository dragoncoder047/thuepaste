# Thuepaste

Some utilities for working with the Thue programming language.

The demo page is inspired by [this jsfiddle](https://jsfiddle.net/ao6egwh9/3/) and [Chris Pressey's Python implementation](https://github.com/catseye/Thue/blob/master/src/thue.py). I don't know who made that jsfiddle - all I know was that it was originally hosted at <http://z3.ca/~lament/thue.html> but that link is dead. (If you know who made it, please do tell me.)

Head over to <https://dragoncoder047.github.io/thuepaste/> to try it out.

The name is a pun on 'toothpaste'.

## What is Thue?

Thue is an esoteric programming language invented by John Colagioia in early 2000. Thue, in short, is a random string rewriting system - you give it a set of rules, each composed of a 'left side' of what to look for and a 'right side' of what to replace it with if found (traditionally separated by `::=`), plus a string. On each step, Thue picks a random right side and replaces a random occurrence of it in the string with the corresponding left side. If no rules match, the program halts.

Traditionally Thue has also included two 'special' rules for input and output. For input, a right side of `:::` (three colons) will not be replaced with that, but with a string of input from the user. For output, any right side starting with `~` (tilde) will instead be replaced with nothing, and everything after the tilde printed.

For all the nitty gritty, have a look at the [wikipedia article](https://en.wikipedia.org/wiki/Thue_(programming_language)).

## The Examples

### samples/hello.t

The classic Hello World program. Starts with a single `@`, which immediately triggers the single rule, to print `Hello World!` and delete the `@`. The program then immediately halts.

### samples/truthmachine.t

A truth machine. It will prompt you for a string. Upon recieving `0`, it will print that and halt. Upon recieving `1`, it will print `11111111111111.....` forever.

### samples/sierpinski.t

One of the programs that came with the original Thue jsfiddle (linked above). Prints out a bit of Sierpinski trangle.

### samples/incany.t

This one from Chris Pressey will add one to any binary number that you provide as input and remove leading zeros.

### samples/nondeterministic.t

This one shows off the random part of Thue. It contains two rules that both have the same left side, so Thue has to randomly pick one to apply.

### samples/notmarkov.t

This one shows the difference between Thue and another probablilistic algorithm, Markov chains. While a Markov chain given the same rules would correctly convert the asterisks into their number in Roman numerals (`XVIII`), Thue fails miserably here -- and produces abscurdities such as `IVXIIIV` or even `IXIX`.
