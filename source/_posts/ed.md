---
title: Ed source code
date: 2020-03-31
description: Ed source code
categories:
    - 转载
tags:
    - humor
    - code
---

```
while :;do read x;echo \?;done
```

Here is the source code in x86 assembly (submitted by Nate):
```
[ORG 0x100]
top:  mov ah,0x0a
      mov dx, buffer
      int 0x21
      mov ah, 0x09
      mov dl,message
      int 0x21
      jmp short top
message:
         db 10,'?',13,10,'$'
buffer:
```

Another, submitted by Hunter Turcin:

```
#include <iostream>
#include <string>
using namespace std;

int
main()
{
  string huh;
  for (;;)
    {
      getline(cin, huh);
      cout << "?\n";
    }
  return 0;
}
```