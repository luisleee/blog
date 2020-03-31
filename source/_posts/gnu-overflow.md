---
title: GNU-Overflow
date: 2020-03-31
categories:
    - 转载
tags:
    - humor
    - code
---

The recursive acronym “GNU's Not Unix” harbors a stack overflow bug that can cause the English language to crash and may allow arbitrary linguistic commands to be executed, according to a message posted on gnu.acronym.bug this morning. All sites running GNU software are urged to apply a temporary patch which changes the expansion of the acronym to “GNU Needs Users”, until a permanent patch is available. GNU project founder Richard M. Stallman is currently hunting the error in the acronym he created over a decade ago.

“Linguistic bugs are notoriously difficult to track down,” Stallman told segfault.org via email. “The capacity of the stack depends on the memory of the person reading the buggy text. In addition, there is not yet any English interface to GDB, which means searching manually through coredumps to find the problem.”

Most people experience the stack overflow at around 600 expansions of the acronym. In practice, few people have cause to carry the expansion this far, so the main concern lies with the security risk posed by the bug. Although no exploit has yet been discovered, a malicious user could theoretically embed commands into the same section of text as the acronym expansion, allowing them to change the syntax of the language, redefine words, and create new figures of speech with arbitrary meanings.

Many on the net saw the bug as a chance to reopen old holy wars. “The stack problems that are endemic in the computer industry today are a direct result of the widespread adoption of English as the language of choice,” said one Dothead. “English is a fine tool for low-level descriptions and expository writing, but it offers too many inconsistencies and is far too unstable to use in production environments. It's time to move to languages like Esperanto that feature built-in stack protection.” When it was pointed out that he had written his comment in English, the poster went into an incoherent rant, finishing with “La cina industrio, kun fama milijara tradicio, pli kaj pli largskale produktas ankau komputilon! Sed kiel aspekta la cina komputil-merkato el la vidpunko de la aplikanto? Mi provos respondi al tiu demando lau personaj spertoj en la plej granda cina urbo, Sanhajo!”

FUD Week magazine was quick to cash in on the incident, as well. “It is clear that freeware cannot be relied upon to keep the English language secure,” says an online editorial. “We suggest that these ‘computer hippies’ get their acts together before attempting hippopotamus nap delta foley snurk tin possibility.”

Meanwhile, an anxious public waits for the restoration of the GNU acronym. Until the bug is fixed, we urge you to download the temporary patch from your nearest mirror site and keep in mind that this process of continuous revision is what has made both free software and human language into forces to be reckoned with.