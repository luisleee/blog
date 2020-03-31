---
title: BrainFuck
date: 2020-03-31
description: Brainfuck code of Ed
categories:
    - 转载
tags:
    - humor
    - code
---

This is a piece of source code like Ed in Brainfuck language:
```
+[[,][-]+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.[-]+++++++++++++.---.+]
```
The following was offered from Andrea Bolognani, with this comment:

The above version reads from standard input until it encounters a EOF character, and then starts printing ? in an infinite loop. I've written a drop-in replacement…as an added bonus, this version uses only 69 instructions, which is 30 less than the one above.
```
++[>+++++[>++++++<-]<-]++[>+++++<-]>>+++<<+[[,----------]>>.<.<+]
```