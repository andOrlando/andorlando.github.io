HackUMASS 2024
category: school; date: 5/13/2025;

- [X] devpost is [here](https://devpost.com/software/unicall)
- [X] github is [here](https://github.com/BananaMiku/HackUMASSXII)

I sacrificed a potential honors thesis idea for this hackathon and all I got was a microphone

### Here's the idea

I thought it would be cool to be able to basically create language-agnostic functions. You could do this by basically continually running said other language in the background as a subprocess, almost like a server, and pass function call/return information back and forth through a local socket (unix domain socket in our case)

The messages would be passed in a compressed binary format, where the function calls would indicate which function you're calling and send the arguments in one packet, and the return would too send back a binary packet. The binary encoding and decoding would have to be implemented in every language we support

We would also need an initial handshake between the parent process and subprocess, since we need to establish both (a) the location of the shared socket and (b) the function spec we're providing.

I'll spare you the gripping story--if you're into that I think my Sophomore year hackathons are a little more interesting in that regard. This one we executed rather efficiently and I think the architecture is more interesting in this case. Honestly the most interesting part of it is how bad we were at coming up with a name: We had unicall (call one function??) and onedef (define it in one language??) but I think if I keep working on it I'll rebrand it to eRPC (easy RPC, since this is basically just gRPC but with zero learning curve)

### Let's start with the API

I wanted to make it as simple to use as possible. We had python and javascript fully working, so I'll show these as examples. Recall we have the server side (that provdes the functions to be called) and the client side (that calls the functions)


Python server side
```py
from onedef.server import typed, serve

@typed(int, returns=int)
def addfive(a):
    return a+5

@typed(float, list, returns=list)
def addtoarray(a, b):
    return [a+i for i in b]

serve()
```

This suffices to have this code working as a server. Furthermore, as long as it's not called with a specific argument (so that we know where the shared socket is on the system) it will function as normal python code with minimal overhead otherwise.

Javascript client side
```js
import { load } from "./onedefJS/client/load.mjs"
const obj = await load.py("test.py")

console.log(await obj.addfive(5)) // prints 10
console.log(await obj.addtoarray([1, 2, 3], 5)) // prints [6, 7, 8]

obj.close()
```

And here we have the corresponding client side for the javascript. Notice we have to specify the entrypoint, as a python file, so we know what we actually want to spin up. When we do so, we'll basically construct a javascript object that has a property (method) for each function that has the `@typed` annotation. Furthermore, everything is awaited because we have to wait on the socket communication to go back and forth (IPC is not particularly fast, though it's certainly fast enough to be imperceptable for a single function call). Also note that we close it afterwards--load will open a socket, and obj.close will close it.

### and the reverse

```js
import { serve } from "./onedefJS/server/server.mjs"
import { Magic } from "./onedefJS/magic.mjs"

function addfive(a) {
  return a + 5
}

function addtoarray(a, b) {
  return a.map(c => c+b)
}

serve(
  [addfive, [Magic.INT], Magic.INT])
  [addtoarray, [Magic.ARRAY, Magic.INT], Magic.ARRAY]
)
```

This syntax is certainly not as nice as python's, but javascript doesn't give us annotations so what can you do. Furthermore, we use the internal magic numbers that we use to represent each type in the packets we send rather than types directly, I don't think for any particular reason other than it feels less idiomatic to pass in `Array` directly in javascript than it does passing in `list` in python.

And for the python client code:

```py
from onedef import client
from onedef import library
import asyncio

async def main():
    obj = await client.load.js("test.mjs")
    print(await obj.addfive(5)) # prints 10
    print(await obj.addtoarray([1, 2, 3], 5)) # prints [6, 7, 8]

asyncio.run(main())
```

This should be unsurprising as well. The only thing I find surprising is that I'm pretty sure we just forgot to write code to close the socket, so while the subprocess will die I think we'll just accidentally leave a broken socket on our sytem...

Either way, the syntax is incredibly concise and clean. The only issue I ith it is lack of type annotations, but those can't be done without either explicitly writing them out (say a dummy function we annotate and supplant in python, I'm not totally sure how we'd do it in javascript) or code generation (eww), but otherwise for the python it's as simple as annotating your code.

### behind the scenes

We created a pretty extensive IPC spec. I can't actually be bothered writing out the entire thing here though, [so just check out the document we used for implementing it](https://docs.google.com/document/d/1RCwpScpNrckpkjZb3BTv6py7wGsYBm5xBbVE6-v-iPE/edit?tab=t.19eh8iub9niz). I'll try to transcribe it here at a later date.


### results

We didn't actually do particularly well, but that's okay actually. Apparently the way it goes is, if I need something, I win it in a hackathon. I ended up needing a keyboard since I built a computer the summer after HackUMass 2023, I (desperately) needed a backpack before HackHer 2024, and I was thinking about buying a mic since my newly built PC of course didn't come with one. We didn't win any real prizes, but we got "Best .tech domain" which I think just means the best project out of all the ones with .tech domains, which ended up being a decent amount of them. We basically just set up our demo website on a .tech domain in the hopes that we could get those mics, and lucky us, we did. I think it was also probably kinda difficult to explain to the judges in the time we were allocated, but what can you do.

Also, apparently this idea already exists, just none of us knew it at the time of making this. They're called Remote Procedure Calls and are usually made for actual across-net client-server communication in a language-agnostic manner, and it's similar to messaging systems like gRPC or ZeroMQ. I maintain that it has a reason for its existance since all of those seem like a pain to use and mine has a beautifully simple programmer interface (I love annotations) but we'll see if I ever end up finishing it.

Either way, it was fun implementing this idea of mine and I'm glad I could convince all my friends to be my code monkeys for yet another hackathon! Here's to future code-monkeying


```
 me
         my e̶m̶p̶l̶o̶y̶e̶e̶s̶ friends     
  o                        
| \    o  /\   |\   o
+=+|   |=\\/    \|\=|          
| |       o  /\    |\   o                 
          |=\\/     \|\=|    
                
```




