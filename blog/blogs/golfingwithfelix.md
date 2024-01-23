Golfing with Felix
category: stupid stuff; date: 1/23/2024;

[Check out the sister blog post by felix!](https://fprasx.github.io/articles/encryption-golf-with-bennett/)

So it's winter break and one of my roommates is like "lets do a coding competition, MITIT." I'm like "we have no prep, we are not experienced with competitive progrmming, we will get absolutely blown out of the water, but ok". I go to said programming competition with him and another one of my friends, and just randomly I see Felix as an organizer.

Obviously we get blown out of the water like I was expecting--highschoolers are scary--but it wasn't all bad because me and Felix had a chance to catch up and see a couple of my other MIT friends while I was there. We used to golf together in high school and he happened to have something coming up he needed to golf for--apparently he was going to give his girlfriend a note in solitaire cipher for her birthday (becasue she'd already implemeneted the encryption algorithm in haskell) and hes like "wanna golf this with me" and I was like "hell yeah"

So a couple days later we just go to the Cambridge Public Library and just grind it out in 9 hours, from 3:45 to like 1:00 the next day. But you probs don't care too much about that if you're on my blog, you're here for the code golf.

# solitaire cipher
It's a really stupid algorithm, for sure. Basically, you take a 52 card deck with two jokers and create a keystream of numbers ranging from 1-52 to add to each character mod 26. To do so, there's basically 4 steps we have to take, each basically shuffling the deck in a certain way.

If you already know the algorithm or just wanna [read wikipedia's explanation instead](https://en.wikipedia.org/wiki/Solitaire_(cipher)) just skip this bit.

You can think about it like shuffling the deck in a specific way each time such that if you know the initial conditions of the deck you can recreate it exactly each time. So here's the algorithm:

1. Locate the two jokers, they must be distinct. One is the `A` joker, the other the `B` joker. `A` doesn't necessarily have to before `B` in the deck, however.Move the `A` joker down one and the `B` joker down two, but if you reach the end of the deck send it to the top, but as the second card instead of the first. A joker can never be the top of the deck after this step

2. Swap everything below the first joker with everything after the second joker. Importantly, we don't actually know what joker is first unless we index our deck.

3. Peek the bottom card. Take that many cards off the top of the deck and put them right before the bottom card.

4. Peek the first card, and take the card'th index from the deck. If it's a joker, run the algo again. If it's anything else, that's our offset which we'll add to our character to mod 26 later.

Since at each step we're mutating the deck, our algorithm is basically going to do exactly this, just each step in as few characters we can get.

## first intuitions
Obviously we're going to need a keystream function, becuase we're going to have to recursively call it if we hit a joker (or not, but that comes way later). Then we'll have a different function, I think I called it `algo` at this point in time, that will actually get the deck and run the algorithm.

We were also going to work off a seeded, randomly generated deck which is just a set of numbers from 1 to 54 inclusive, with 53 and 54 being the jokers. This was my initial setup

```python
from random import shuffle, seed
seed(5318008) # inspired by nyt connections
shuffle(d:=[*range(1,55)]) # our deck is d, this does work lol

def keystream():
  # shuffle the deck a bit, clap your hands twice and there ya
  # go you've got the encryption number
  return offset_number

def algo(string):
  # we'll build on this string
  result = "" 
  for character in string:

    # encrypt that john

  return result

# and call it on our encrypted method
print(algo("hifelix")) # hopefully prints `miyhjat`
```

Both mine and felix's keystream functions at the start were largely the same, except for the first bit--pushing down the jokers. Let's take it step by step:

### step 1, pushing down the jokers
My idea was to simply extract the joker and slot it in, much as you would a real card, whereas felix's was to have a single function, `push`, which just pushes the card down, and you call it once on the `A` joker and twice on the `B` joker. I don't actually have my old code but I think it looked kinda like this

A lot of the golfing optimization is omitted for readability--obviously in the final product I didn't take the length of `d`

```python
# ia is the index of a
del d[(ia:=d.index(53))]
# ia=1 actually was ia=2 for a while which took me a sec to realize in testing lol
if (ia == len(d)-1): ia=1
else: ia+=1
d.insert(ia, 53)

del d[(ib:=d.index(54))]
# these were also broken lol
if (ia == len(d)-2): ia=0
elif (ia == len(d)-1): ia=1
else: ia += 1
d.insert(ia, 54)
```

Felix's, significantly more elegant at the time (though arguably mine woulda been better than it looks now bc I woulda actually golfed it but yeah its worse).

```python
index=lambda l,x:l.index(x)
push=lambda l,i:l[:i]+[l[i+1]]+[l[i]]+l[i+2:]

# he had an index function which we found out later was a negative even after making it a closure with d
a = index(d, A)
d = push(d, a) if a != DECKSIZE - 1 else [d[0],d[a],*d[1:a]]

b = index(d, B)
d = push(d, a) if a != DECKSIZE - 1 else [d[0],d[a],*d[1:a]]
b = index(d, B)
d = push(d, a) if a != DECKSIZE - 1 else [d[0],d[a],*d[1:a]]
```

Before we talk about implementation, let's just make clear exactly what the push function does and the `false` case of the ternary do.

We want to push it down which you can treat as basically just switching the joker and the character behind it. We hold everything before the joker constant, then add the card after it, then the joker, then everything after it. In plain text, it looks like this:

```
new deck is gonna be: everything before joker, card after joker, joker, everything 2 after joker
```

For the `false` case of the ternary, since we know the joker is the last card, we can just say first card, last card (joker), and then everything after the first card just before the last.

For a bit we were working on our own different implementations, but when I got to the testing stage my deck push was actually so annoying to work with that I kinda just gave up, especially given some optmimzations we got going for Felix's implementation.

There's a couple obvious ones: 
1. index can become a closure with d given that d is in scope. 
2. our push function can include all the repeated code with the ternary on deck size
3. the ternary itself can be converted to a `cond and x or y` instead of using `x if cond else y`
4. `a!=DECKSIZE-1` can become `a<DECKSIZE-1` which can become `a<A` because if you remember, the `A` joker is 53 and our deck size is 54, thus `DECKSIZE-1=A`
5. Slightly less obvious, but if we, instead of indexing outside the `push` function, index inside of it, we'll save 2 `index` calls. Since we'll then just be passing in the joker we want to push down, we can simply use that variable whenever we have to add the joker back into the list. This bit will get a little more clear when looking at actual code

Then there's a couple more obvious ones that are optimizations to our slicing. Basically, when constructing a list from both values and lists there's two real ways we employ here. Either we **add lists** or we **have a list of elements and unwrapped lists**.

Let's say we have `a=1; b=[2, 3]; c=4` and we want `[1, 2, 3, 4]`. Basically, our two methods are as follows:

```python
d=[a,*b,c]
d=[a]+b+[c]
```

After all our optimizations, this is what we get!

```python
#             + this condition is reversed so I save a space by doing `)and`
#             |
#             |                    + here, as you can see, we use the second
#             |                    | method. Everything before the joker, the
#             |                    | card after the joker, the joker, then
#             |                    | everything after.
#             |                    |
#             |                    |             + we don't index for the joker 
#             |                    |             | here because we already know 
#             |                    |             | what it's gonna be, namely, 
#             |                    |             | thh joker
#             |                    |             |
push=lambda j:A>(i:=d.index(j))and d[:i]+[d[i+1],j]+d[i+2:]or[d[0],j]+d[1:i]
d=push(A); d=push(B); d=push(B)
```

This push you see here is (close to) what we have in our final golf. There were a couple hurdles along the way though. I suppose it's probably time to talk about what `d` actually is.

### a ~~brief~~ interlude about `d`
At this point in time, we had a global `d` defined outside all our functions, as you could see in the setup code in the **first intuitions** section. To access this global, we'd need to have `global d` at the top of the `keystream` function. There were a couple theories on how we could get rid of this. There, in reality, was only one, though.

The reason we're allowed to do `d=whatever` is because d is global. Should it be passed in as an argument, `def keystream(d):` or whatever, it will not mutate the deck, just assign a new list to the function-bound variable, `d`. The only way to actually mutate it would be `d[:]=whatever` due to how slicing works, but this is pretty costly, specifically by 3 characters, `[:]`.

Another thing we wanted to do was to turn the entire thing into a lambda to get rid of the return, but we ran into the same issue with d. We tried having it be a lambda closure thing and then I thought we'd be able to set d using a walrus operator `:=`, but that seems to create a new variable `d` in a scope limited to inside the lambda. In a lambda we also wouldn't be able to do `d[:]=whatever` because assignment, which is what that is, isn't allowed inside lambdas.

Basically, for now, the `d` was staying global.

### step 2, triple cut

The next two sections are going to be a little bit shorter, since these next two steps, as hard as we tried, basically just stayed the same the entire time.

We're basically just going to slice the deck a bunch using python's aptly named slicing syntax and do a frankenstein-esque reconstruction, swapping the bottom and the top. Basically we'll just take the `[start, first joker)` and swap it with `(second joker, end]`

You will notice, however, that we don't actually know which joker is which. The cheapest way to find this, infuriatingly, is just doing the following:

```python
lo, hi=sorted([d.index(A), d.index(B)])
d = d[:hi+1] + d[lo:hi+1] + d[lo:]
```

The second line is great, it's just the first that's so annoying. We tried a billion different things to get `lo` and `hi` in different ways but `sorted` is just so goddamn character efficient. We really really wanted to do something like finding the lo, then like xoring both indices and lo to get hi (`a^b^one=the other` where `one` is either `a` or `b`), but literally nothing we could find could do this shorter so this is where it stands to this day.

### step 3, count cut

Similar deal, pretty simple. We're always going to be keeping the bottom card the same so that's gonna stay at the end. The one thing we have to watch out for is what do we do if we hit the `B` joker. Our cut is as follows:

```python
c=min(d[-1],A)
d=d[c:-1]+d[:c]+[d[-1]]
```

where `c` is the amount we want to cut by. We take everything from C until the last element (exclusive) which will be the new top of the deck, since we're putting everything before it right before the last card, then we have the last card. We do the whole min c thing to avoid cutting 54 characters, which would result in `d[:c]` being the entire deck, which it would add `[d[-1]]` to, resulting in a 55 card deck. Which is bad.

Except as of writing this, I actually realied we could golf this more lol, specifically the last bit. We can cut out the min thing entirely due to two facts:

1. `d[:c]` will never include the last character
2. if we slice beyond the end of a list, it'll just slice until the end of the list, e.g. `d[:1000000]=d`. The same applies for the start, `d[100000:]=[]`

That means, if we were to say, try to cut 54 cards out of a deck that was only 53 cards in the first place, we would only get the 53 cards. This means I can have, instead of `d[:c]`, `d[:-1][:d[-1]]`, meaning we no longer have any actual need to do the whole min thing. Our new code is as follows:

```python
c=d[-1]
d=d[c:-1]+d[:-1][:c]+[c]
```

We still have the `c=d[-1]` thing because we use `c` thrice, saving us a metric ton of characters.

### step 5, picking our offset

To get offset we take the first card and just get the card'th card in the deck. Both jokers are counted as 53, which would just be the last card. We're going to have to deal with the `B` joker again.

If the card we pick is a joker, we're gonna have to run the whole keystream algorithm again to get a new deck. Our simple code to do this was as follows:

```python
o=d[min(d[0],A)]
return o<A and o or keystream()
# remember we can just keystream() again because
# d is global and keystream mutates the deck
```

### encrypting the characters

encryption was actually pretty simple. We have our offset, so we just have to convert the char to a number, subtract 96 so our bounds are 1-26, add our offset, clamp it to 1-26 again then just convert it back to a character.

```python
res += chr((ord(c)-96+keystream()%26or 26)+96)
```

At this point though, Felix was like "oh I remember my girlfriend did something clever here" so we shamelessly stole her idea and basically just subtracted 1 before and added 1 after, effectively ensuring that the result of the modulo could never be 0 which was the whole reason we had the `or 26`.

```python
res += chr((ord(c)-97+keystream())%26+97)
```

### and that's an algorithm!

This was my first working attempt, still not totally optimized (not even push was, and that was probably our longest standing function).

```python
x=lambda i:d.index(i)
p=lambda j:53>(i:=x(j))and d[:i]+[d[i+1],j]+d[i+2:]or[d[0],j,*d[1:i]]
def keystream():
    global d

    d=p(53);d=p(54);d=p(54)
   
    l,h=sorted([x(A),x(54)]);
    d=d[h+1:]+d[l:h+1]+d[:l]

    c=min(d[-1],53)
    d=d[c:-1]+d[:c]+[d[-1]]

    t=min(d[0],53)
    return 53>d[t]and d[t]or keystream()

def algo(s):
  res = ""
  for c in is:
      res += chr((ord(c)-97+keystream())%26+97)

  return res
```

## things we tried

We really had a huge push for lamda-fying everything, and I even got the code fully working, but it just wasn't fewer characters. Having to use `def a(x):global d;d[:]=x` in order to mutate `d` just wasn't working at all.

Another thing I really really wanted to do was to map push somehow over `[53,54,54]` since I just see so much code repetition here and it physically hurts me. This also wouldn't really work for the same reason, you can't assign within a lambda.

We also really wanted to get rid of the `global d` but we just didn't know how to.

### we're geniuses 

It was like 12:00 and we'd just eaten and moved from the library to some random MIT classroom. We'd done a bunch of optimizations and at this point we we thoguht we had gotten it about as good as this method of solving the problem goes. Optimization is basically just a hill-climbing problem, and we certainly were starting to reach a peak.

This meant if we wanted to save substantially more characters after this point, we'd have to make a pretty drastic change. That `global d` was glaring at us, and we were sort of thinking of doing some kind of more functional-esque approach where we successively apply `keystream`, now `k`, to its own output. I was thinking it could kinda like have a stream of deck configurations rather than a stream of keys and each 5 calls we'd have something we could parse our offset out of but we never ended up using it.

Back to 12:00, we're thinking about functional programming, specifically tail-end recusion. Felix writes up on the board `f(x, y, z) = cond ? f(x', y', z') : base case` to explain it and after seeing this we start to realize: we don't actually need to have two seperate functions at all.

1. We chop down the string by 1 each call and just act on the first character-- our base case will be when the string is completely empty
2. We'll keep the total decrypted string as another argument to construct it from each recursive call and it can be what we return when we hit our base case
3. We'll have the deck as our second argument and we'll simply construct a local d and pass it into the next k as we need to.

With this, both of us immediatley got to work and ended up writing basically the exact same code lol. And thus we have (basically) our final product, at least as of day 1.

```python
A=53
p=lambda j,d:A>(i:=d.index(j))and d[:i]+[d[i+1],j]+d[i+2:]or[d[0],j]+d[1:i]
def e(s,d,t=""):
  d=p(54,p(54,p(A,d)))

  l,h=sorted([d.index(A), d.index(54)])
  d=d[h+1:]+d[l:h+1]+d[:l]

  c=min(d[-1],A)
  d=d[c:-1]+d[:c]+[d[-1]]

  o=d[min(d[0],A)]
  return s and(A>o and e(s[1:],d,t+chr((ord(s[0])-97+o)%26)+97)or e(s,d,t))or t
encrypt=e
```
golfed
```python
A=53
p=lambda j,d:A>(i:=d.index(j))and d[:i]+[d[i+1],j]+d[i+2:]or[d[0],j]+d[1:i]
def e(s,d,t=""):
  d=p(54,p(54,p(A,d)));l,h=sorted([d.index(A), d.index(54)]);d=d[h+1:]+d[l:h+1]+d[:l];c=min(d[-1],A);d=d[c:-1]+d[:c]+[d[-1]];o=d[min(d[0],A)];return s and(A>o and e(s[1:],d,t+chr((ord(s[0])-97+o)%26)+97)or e(s,d,t))or t
encrypt=e
```

You'll notice a couple things maybe. First, we only have a global var for `A` and not for `B`. This is because, for us to actually save characters by defining a variable for a 2-digit number we have to use it >=6 times, which we exactly meet for `A`.

You'll also notice how goddamn cool this tail recursion is. It's basically like a manual multi-variable reduce over our string and that's just so cool to me. At this point we're at 328 characters, which we think is absolutely stellar. It is almost 1:00 though, and I need to catch the last red-line train home, so we call it for the day soon-ish after.

### future optimizations

As of writing, I've found a couple. One of them I talked about in step 2, but let's talk about the other couple.

First, I realized that you can have numbers directly to the left of boolean operators (e.g. `53or` is valid). That means in ouor return statement where we do `A>o or` we can actually just do `o<53or` and it'll be the same number of characters. This means we only have 5 instances of `A` that actually save us characters, meaning the `A=53` is now an equal trade. This will become negative with the next optimization, however:

After I cut the first min, I had my eyes set on the second one. The purpose of `o=d[min(d[0],A)]` is basically to make the `A` and `B` jokers do the same thing and ensure we don't get any index out of boundses from the `B` joker. In either case, we want both 53 and 54 to index the end of the array.

But we can actually do that without using min. Specifically, since 54 is our only edge case, we can mod by 54 and `or` it. Since `d[0]` is never going to be 0, our only falsy case will be 54. This means we've now got these two:

```python
o=d[min(d[0],A)]
o=d[d[0]%54or-1]
```

which, while at this point equal, given the fact that we've changed all the `A`s back to 53s, is actually going to be a one-character save. With that, we now have our true current golf:

```python
p=lambda j,d:53>(i:=d.index(j))and d[:i]+[d[i+1],j]+d[i+2:]or[d[0],j]+d[1:i]
def e(s,d,t=""):
    
    d=p(54,p(54,p(53,d)))
    
    l,h=sorted([d.index(53),d.index(54)])
    d=d[h+1:]+d[l:h+1]+d[:l]
    
    c=d[-1];d=d[c:-1]+d[:-1][:c]+[c]

    o=d[d[0]%54or-1]
    return s and(o<53and e(s[1:],d,t+chr((ord(s[0])-97+o)%26+97))or e(s,d,t))or t
encrypt=e
```
and fully golfed:

```python
p=lambda j,d:53>(i:=d.index(j))and d[:i]+[d[i+1],j]+d[i+2:]or[d[0],j]+d[1:i]
def e(s,d,t=""):d=p(54,p(54,p(53,d)));l,h=sorted([d.index(53),d.index(54)]);d=d[h+1:]+d[l:h+1]+d[:l];c=d[-1];d=d[c:-1]+d[:-1][:c]+[c];o=d[d[0]%54or-1];return s and(o<53and e(s[1:],d,t+chr((ord(s[0])-97+o)%26+97))or e(s,d,t))or t
encrypt=e
```


And that's it for now! I'll keep it updated if I break characters and me and Felix are thinking about throwing at some golf Stack Overflow to see if random people on the internet can cut it down even further.

Anyways code golf's fun, Felix is cool and there aren't too many better ways to spend 9 consecutive hours than code golfing with the boy~~s~~ 














