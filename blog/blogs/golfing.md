Code Golf
category: stupid stuff; date: 7/20/2023;

Code golf. Its cool. I write code golf. That makes me cool. I'm gonna talk about all
the code golf's I've done and you're going to listen whether you like it or not. There's
really not that many so do bear with me.

### radix sort (124 chars)
This was probably one of the more fun ones. I made it for a bet between me and another
dude who now goes to northeastern in our senior year of high school. It was the 
[spoon game](https://registerforum.org/3949/humor/developing-spoon-game-expose/) and
neither of us had kills yet, and we were going to have to get some fast otherwise we
would both be out. We decided whoever golfed better would get to kill the other so they
could live on.

I'm only gonna share a couple of the key versions because some of the changes are only minor
increments and some of the changes I've simply just lost.

I usually start with a basic implementation with a mind for what the end result should look
like. It's not all in one line yet, but it's pretty close:

```python
def radix(a):
    m=len(str(max(a)));a=[f"%0{m}d"%i for i in a];s=lambda n:sum([[j for j in a if j[n]==i]for i in"0123456789"],[])
    for i in range(m):a=s(~i)
    return[*map(int,a)]
```
Let's talk about it. This is radix sort, so `m` is the number of digits of the largest number, which is what we're going
to pad every other number to with zeros. You can see me doing that when I do `f"%0{m}d"%i` which does just that. Now that
we have ea bunch of strings each of length `m`, we can actually sort them using radix which is what `s` does. After we apply
`s` to everything in `a`, we map it all from strings into ints and we're done.

I then put it into one line to cut down on tab characters:
```python
def radix(a):m=len(str(max(a)));a=[f"%0{m}d"%i for i in a];s=lambda n:sum([[j for j in a if j[n]==i]for i in"0123456789"],[]);[a:=s(~i)for i in range(m)];return[*map(int,a)]
```

I then cut it down a bunch and now we're at this:
```python
# before
def radix(a):m=len(str(max(a)));a=[f"%0{m}d"%i for i in a];s=lambda n:sum([[j for j in a if j[n]==i]for i in"0123456789"],[]);[a:=s(~i)for i in range(m)];return[*map(int,a)]
# after
def radix(a):m=len(str(max(a)));[a:=sum([[k for k in[f"{l:0>{m}}"for l in a]if k[~i]==j]for j in"0123456789"],[])for i in range(m)];return[*map(int,a)]
```
I completely cut out the need for a for loop and `s` by using list comprehension. I forgo mapping everything in `a` into 
a `m` length string once in favor of formatting the elements when I need them formatted. I also, instead of applying `s`
to `a`, I partially sort it for every run through of the list comprehension so after all `m` sorts it'll be sorted
completely.

I then turn it into a single expression:
```python
# before
def radix(a):m=len(str(max(a)));[a:=sum([[k for k in[f"{l:0>{m}}"for l in a]if k[~i]==j]for j in"0123456789"],[])for i in range(m)];return[*map(int,a)]
# after
radix=lambda a:[*map(int,[a:=sum([[k for k in[f"{l:0>{i+1}}"for l in a]if k[~i]==j]for j in"0123456789"],[])for i in range(len(str(max(a))))][-1])]
```
This wasn't too bad to do since the result of the list comprehension is just going to be the sort at various stages, so
I can just take the last one and it'll be the sorted list.

Finally, after a bunch more changes we have the final golf:
```python
# before
radix=lambda a:[*map(int,[a:=sum([[k for k in[f"{l:0>{i+1}}"for l in a]if k[~i]==j]for j in"0123456789"],[])for i in range(len(str(max(a))))][-1])]
# after
radix=lambda a:[a:=sum([[j for j in a if f"{j:0{i+1}}"[~i]==k]for k in"0123456789"],[])for i in range(len(str(max(a))))][-1]
```
It's considerably shorter. There's a couple optimizations, the biggest one being I don't do any conversions, like anywhere.
I really don't remember how I did that and most of this looks like magic to me now so I honestly just don't touch it and leave
it be.

For what it's worth, I did actually run it through chatGPT to see if it could cut it down any further and it couldn't
lol so I guess that's kinda cool.

### tic-tac-toe
I'm working at Digital Ready the summer that I'm writing this. It's mostly for people with
little to no prior computer science experience, so one of my coworkers is doing a code-along
for a little tic-tac-toe game (that I wrote :3). I didn't have a whole lot to do in the mean
time so I golfed it just because I could.

To start off, I just wrote it as multiple functions, keeping in mind the fact that
it would be eventually combined into a single lambda, which is why I used \_\_setitem\_\_
over just normally setting it, used a bunch of walrus operators instead of normal
variables and used `quit` instead of throwing exceptions.

```python
from random import choice

def game_won(g):
    dog=[g[:3],g[3:6],g[6:],g[0::3],g[1::3],g[2::3],g[0::4],g[2:7:2]]
    # dog=sum([[g[i//3::3],g[i:i+3]]for i in[0,3,6]],[g[0::4],g[2:7:2]])

    return sum(map(lambda b:b[0]==b[1]==b[2]!="_",dog))

def tictactoe():
    grid=[*"_"*9]
    free=[*range(9)]
    while not game_won(grid):
        grid.__setitem__(user:=int(input("Enter a number: ")),"X")
        if user-1 not in free: quit("Invalid input")
        free.remove(user)
        free.remove(comp:=choice(free))
        grid.__setitem__(comp,"O")
        [print("|".join([grid[i*3+j] for j in range(3)])) for i in range(3)]

    print("game over")
```

It's pretty simple, I just keep track of the available moves and pick a random
one of those with `choice` from `random`. Then I print out the grid. The game_won
thing is kinda sad because I can't find a way to shorten it, but basically all of
those slices are each row, column and diagonal which I then check to see if any
of them show that the game is over

Then I remove everything that would prevent it from being a lambda (other than `game_over`):
```python
def tictactoe():
    grid=[*"_"*9]

    free=[*range(9)]
    [[
        (user:=input("Enter a number: ")).isdigit()or quit("Not a number"),
        (user:=int(user)-1)in free or quit("Spot taken"),
        free.remove(user),
        grid.__setitem__(user,"X"),
        len(free)and[free.remove(comp:=choice(free)),grid.__setitem__(comp,"O")],
        [print("|".join([grid[i+j] for j in[0,1,2]])) for i in[0,3,6]]
    ]for _ in" "*5 if not game_won(grid)]

    print("game over")
```
this wasn't too tricky of a process because it was already basically formatted like this.
I just use a list comprehension as a for loop with max length 5 (because tic-tac-toe never
exceeds 10 turns) unless the game is already won, at which point I stop early.

To execute multiple lines, I just put them all next to each other in a list. It executes
them all the same and I think it's the shortest way to execute them all in series like this
and still keep it an expression

Current final result:
```python
import random
tictactoe=lambda g=[*"_"*9],f=[*range(9)]:[[[d:=g.__setitem__,e:=f.remove,
        (u:=input("Enter a number: ")).isdigit()or quit("Not a number"),
        (u:=int(u)-1)in f or quit("Spot taken"),
        e(u),
        d(u,"X"),
        len(f)and[e(c:=choice(f)),d(c,"O")],
        [print("|".join(g[i:i+3]))for i in[0,3,6]]
    ]for _ in" "*5if 1>sum(map(lambda b:b[0]==b[1]==b[2]!="_",[g[:3],g[3:6],g[6:],g[0::3],g[1::3],g[2::3],g[0::4],g[2:7:2]]))]
    ,print("Game over")]
```
For one, it's a lambda now. All the variables are also a single letter now. Aside from that,
there were a couple changes:
- there's better input validation so it shouldn't throw any exceptions like ever
- a lot of the longer functions (`__setitem__`, `remove`) are made into variables
- the print statement is made way shorter because I was being stupid before
- uses `random.choice` because `random.` < `from choice` (`import` and `random` stay)

and all of this in one line:
```python
import random;tictactoe=lambda g=[*"_"*9],f=[*range(9)]:[[[d:=g.__setitem__,e:=f.remove,(u:=input("Enter a number: ")).isdigit()or quit("Not a number"),(u:=int(u)-1)in f or quit("Spot taken"),e(u),d(u,"X"),len(f)and[e(c:=choice(f)),d(c,"O")],[print("|".join(g[i:i+3]))for i in[0,3,6]]]for _ in" "*5if 1>sum(map(lambda b:b[0]==b[1]==b[2]!="_",[g[:3],g[3:6],g[6:],g[0::3],g[1::3],g[2::3],g[0::4],g[2:7:2]]))],print("Game over")]
```

## Ones I forget how I wrote but are still cool

### Wordle
```python
wordle=lambda a,x=6:\
    (x<1or(\
        (b:=input())and\
        (c:={i:a.count(i)for i in a})and\
        (g:=[j==b[i]and(c.__setitem__(j,c[j]-1)or 1)for i,j in enumerate(a)])and\
        print(\
            "\033[1A"+\
            "".join(f"\033[{g[i]and 42or(g[i]^1)&(b[i]in a)and(c.__setitem__(b[i],c[b[i]]-1)or c[b[i]]>-1)and 43or 100}m{b[i]}"for i in range(5))+\
            "\033[0m")\
        or sum(g))>4\
    )and 1or wordle(a,x-1)
```

### Fibonacci
I did this one with the [aspine](https://aspine.cpsd.us) guys
```javascript
f=n=>{a=0;b=i=1;for(;i++<n;)a=(b+=a)-a;return b}
```
