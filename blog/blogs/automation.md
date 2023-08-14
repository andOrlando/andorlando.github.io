Homework Automation
category: school; date: 13/7/2023;

It all started when I was using an online textbook for a really 
easy class. It was really boring. I was talking to a couple other
students taking the class and we were all under the impression
that, since it was an online interactive textbook that was basically
entirely graded on completion, it was possible to write a script that
could just finish it immediately. It's just that no one ended up doing
it.

Apparently another guy I knew wrote a script with selenium to do it but
selenium is yucky and gross and I didn't really feel like using it, so
I figured I'd give it a shot on my own. This sent me down a rabbit hole
that I'll be falling through for as long as I have stupid homework
assignments

So I made a script for zybooks. And I made it so that it could go to 
the next assignment once it finished one. And then I let it run. And then
I never did zybooks ever again. That was the first one.

## General overview
Basically I didn't wanna make a chrome extension but I had to host the
data somewhere, so I used github. Basically, it queries the raw github
and evaluates it using a fetch thing, e.g.
```js
fetch("https://raw.githubusercontent.com/andOrlando/homework-scripts/main/khc.js").then(a=>a.text()).then(eval)
```

Then you can bookmark this and just run it by clicking the bookmark. It's
really pretty convenient. Anyways, here's a summary of all of them so far.
Maybe I'll keep adding to this as I make more lol

### Zybooks
This was the first one I created. Initially it was a greasemonkey script that
I ran through qutebrowser but eventually I transitioned into what I've got
today where it's just a bookmark. It basically would just run through and
click everything until it was correct. Even the short answers had a `show all`
button that it could just get the answer immediately from. It's actually one of
the most satisfying things in the world seeing it complete a zybooks assignment.

### MyMathLab
Linear Algebra had us do work in this platform called MyMathLab. I already
took Linear Algebra at Harvard in my junior year of high school so I wasn't
really keen on doing a bunch of busywork. So basically I wrote a script
that would rip the matrices from the text on the screen, put them into
global javascript variables as matrix objects I created, and pop up a little
command prompt where it would execute raw javascript (not the safest thing,
I know, but none of this really is lol)

This one was actually pretty fun because it meant implementing a matrix
class which could perform all the useful operations one would normally
want to perform on matrices. I'm not gonna sit here and pretend it was
particularly efficient, but boy was it fun to write.

Add to the fact that I didn't actually have my laptop for a while and I
was doing most of the work in the library while sick and it made for a
pretty good time.

I had a little console as well for it and it made for a pretty good base
for a more involved console I made

### Perusall
Perusall worked on a point system--if you do stuff you get points. One
time me and another dude in the class noticed that our points would sometimes
randomly jump without us making comments or responding to stuff, and we were
like "I wonder how high we can get our score by not doing anything?" So
obviously I automated the process of doing basically everything that didn't
require any intelligence. Basically it would scroll through the doc as well as
enter and exit it a bunch of times. I think the max I got up to by doing nothing
was like 2.5/4 or something lol

Anyways it's not particularly useful but it was fun to write and I made a golfed
version just for fun as well. I think it's still in there as a comment lol

### Webassign
This was actually a hackathon project that I folded into this because we didn't
end up finishing it, but basically it converts rendered latex into actual latex.
You could theoretically hook wolfram alpha or a language model up to it and
actually automate the homework, but for now it's just kinda cool

### Kendal Hunt Content
I started by doing these normally and was doing great until like the 3rd one
which I really couldn't be bothered to study for. I think I said out loud to
the people I was studying with, "If I don't do well on this I'm automating 
it." Since I've since automated it, you can guess how well I did on the quiz.

The way it works is that all the quiz questions come from a bank of practice
quiz questions, and they let you retake the practice quizzes an unlimited
number of times. So if I just save the practice quiz and answer pairs in a
json string in local storage I've then got a way to automate the quizzes.

## Ethicality
So, uhhh, I should probably address whether this is ethical or not. I
obviously wouldn't be doing it if I didn't think it is. What I'm doing
is basically just slightly more specific versions of things we're already
allowed to do.

For zybooks are we allowed to be running extensions that interact with
the webpage? Well yeah. Are we allowed to leave our computer while the
stupid animations that you have to watch the entirety of are going?
I mean obviously. Can we try all the multiple choice questions and see
if they're right instead of actually doing the question? There's a
"show answer" button there for a reason.

the MyMathLab one is basically just a glorified calculator, it's nothing
that wolfram alpha couldn't do. We were already allowed to use the good
ol' TI-84 so I don't see why my calculator can't be used either.

The webassign one I don't think I even have to justify--I didn't even
use it that much, it's mostly just in there so I can say I have another
website covered

Perusal I'm not convinced even does that much and the actions it just
makes it so I don't have to be at my computer while idly clicking buttons
over and over again.

Kendall Hunt Content I can kinda understand it looking a little shady,
but we are actually allowed to take notes on the questions and use our
notes on the quiz. I'm just hastening that process. I'm sure there's
something about "cheating myself out of practice" or something but I
got an A in the class without it so I guess I was fine.

That being said if you're a school administrator and you end up banning
these I mean that's perfectly understandable, you don't want stuff to
make students lives easier to be able to be used. That being said, there's
something to be said for not handing out the kind of busywork that can be
literally automated.
