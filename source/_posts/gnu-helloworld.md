---
title: Hello World!
date: 2020-03-31
description:  The way people code “Hello World” varies depending on their age and job.
categories:
    - 转载
tags:
    - 搞笑
    - GNU
---

How the way people code “Hello World” varies depending on their age and job:

# High School/Jr. High

```
10 PRINT "HELLO WORLD"
20 END
```

# First year in College

```
program Hello(input, output)
begin
writeln('Hello World')
end
```

# Senior year in College

```
(defun hello
(print
(cons 'Hello (list 'World))))
```

# New professional

```
#include <stdio.h>

void main(void)
{
    char *message[] = {"Hello ", "World"};
    int i;
    for(i = 0; i < 2; ++i)
        printf("%s", message[i]);
    printf("\n");
}
```

# Seasoned professional

```
#include <iostream.h>
#include <string.h>
class string
{
    private:
        int size;
        char *ptr;
    public:
        string() : size(0), ptr(new char('\0')) {}
        string(const string &s) : size(s.size)
        {
            ptr = new char[size + 1];
            strcpy(ptr, s.ptr);
        }
    ~string()
    {
        delete [] ptr;
    }
    friend ostream &operator <<(ostream &, const string &);
    string &operator=(const char *);
};

ostream &operator<<(ostream &stream, const string &s)
{
    return(stream << s.ptr);
}
string &string::operator=(const char *chrs)
{
    if (this != &chrs)
    {
        delete [] ptr;
        size = strlen(chrs);
        ptr = new char[size + 1];
        strcpy(ptr, chrs);
    }
    return(*this);
}
int main()
{
    string str;
    str = "Hello World";
    cout << str << endl;
    return(0);
}
```

# System Administrator

```
#include <stdio.h>
#include <stdlib.h>
main()
{
    char *tmp;
    int i=0;
    /* on y va bourin */
    tmp=(char *)malloc(1024*sizeof(char));
    while (tmp[i]="Hello Wolrd"[i++]);
    /* Ooopps y'a une infusion ! */
    i=(int)tmp[8];
    tmp[8]=tmp[9];
    tmp[9]=(char)i;
    printf("%s\n",tmp);
}
```

# Apprentice Hacker

```
#!/usr/local/bin/perl
$msg="Hello, world.\n";
if ($#ARGV >= 0) {
    while(defined($arg=shift(@ARGV))) {
	    $outfilename = $arg;
	    open(FILE, ">" . $outfilename) || die "Can't write $arg: $!\n";
	    print (FILE $msg);
	    close(FILE) || die "Can't close $arg: $!\n";
    }
} else {
    print ($msg);
}
1;
```

# Experienced Hacker

```
#include <stdio.h>
#include <string.h>
#define S "Hello, World\n"
main(){exit(printf(S) == strlen(S) ? 0 : 1);}
```

# Seasoned Hacker

```
% cc -o a.out ~/src/misc/hw/hw.c
% a.out
Hello, world.
```

# Guru Hacker

```
% cat
Hello, world.
```

# New Manager (do you remember?)

```
10 PRINT "HELLO WORLD"
20 END
```

# Middle Manager

```
mail -s "Hello, world." bob@b12
Bob, could you please write me a program that prints "Hello, world."?
I need it by tomorrow.
^D
```

# Senior Manager

```
% zmail jim
I need a "Hello, world." program by this afternoon.
```

# Chief Executive

```
% letter
letter: Command not found.
% mail
To: ^X ^F ^C
% help mail
help: Command not found.
% damn!
!: Event unrecognized
% logout
```

# Research Scientist

```
    PROGRAM HELLO
    PRINT *, 'Hello World'
    END
```

# Older research Scientist

```
	WRITE (6, 100)
100 FORMAT (1H ,11HHELLO WORLD)
	CALL EXIT
	END
```
