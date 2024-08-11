HackHer413 2024
category: school; date: 4/30/2024;

- [X] [watch the video!](https://www.youtube.com/watch?v=P6NUBAzFOSc)
- [X] devpost is [here](https://devpost.com/software/bad-apple-but-google-calendar)
- [X] github is [here](https://github.com/PianoPanda/2024_HackHer413)

This is actually a story I've told to my friends, family, extended family, neighbors, coworkers, extraterrestrial aliens, dogs, etc. since it's just such a great story. Up there with Homer's Odyssey, War and Peace, Shark Tales, etc. And so I'll add "whoever sees this blog post" to the list of poeple I've told this story to.

### important backstory
Humans are complex. Decisions are made based on both years of their lives shaping who they are, but also their conditions--why am I making the decision to make bad apple in google calendar philosophical

Suffice it to say there were very specific conditions leading to our project.

Firstly, I get unlimited fountain drinks at school. This means that when I went to a dining hall to hang out with some friends, I brought my backpack with a waterbottle in it, with the intention of leaving with either fruit punch or hibiscus tea or whatever else I was fancying. I did not leave with either, instead I left without my backpack, and only later in the day did I realize my mistake.

Of course I went back expecting it to be in lost and found, but it wasn't. It wasn't where I sat, it wasn't in lost in found, I honestly have no idea why anyone would take that old worn out backpack with nothing but a $20 used waterbottle in it, but regardless of how it was gone. Poof, I now didn't have a backpack. This all happens ~1 week before the hackathon.

Secondly, I was actually doing the hackathon. One of my friends (who happened to be an organizer) was trying to get my roommate to do it and he needed a team so I was kinda conscripted. I was reluctant until we had an idea I would actually enjoy coding, but as you'll see later in this blog this ceases to be a problem.
 
Secondly, it would have actually been my third hackathon at this point. I've already written about the second one, but me and my team kinda just lost in the first one. The only thing is, we totally could have won at least a prize--the "Best use of Google Cloud" prize. You can probably see where this is going. We were originally targeting it, so we tried using lamda functions and firebase, but since we were freshmen who'd never used those technologies before, we couldn't set them up in time before the deadline. We submitted something, but it didn't feel honest to submit our project for that prize, even though we did at least kinda use a bit of it I think?

Either way, there wasn't a single other proejct who submitted to that prize, so if we had just ticked that box we would've won the prize: Google Cloud branded backpacks. You can definitely see where this is going now.

the backpack in question\
![a google cloud backpack](googleinit.jpeg)

So it's a week before the competition and I really want those backpacks. Both to redeem myself for the first hackathon, and because like honestly I really seriously need a backpack... there was still a few months left of school and it'd definitely suck to keep having to carry around my laptop in a tiny CICS-branded tote bag.

### the idea
No one submits to this prize. Literally no one did for the first hackathon we did, so it should be pretty easy. All we really had to do to win it was to make a generally competent project using google cloud as a backend and we basically had it in the bag. But that's not enough. That's not any fun, and I don't know if I'd find it any fun if we were just banging out some boring frontend for the sole purpose of having google cloud as a backend.

I started looking through the google cloud API options, just scrolling down their offering list. Everything was kinda just cloud computing and data management stuff, and you can't really do anything particularly interesting with that, but eventually I landed upon [their anti-money laundering AI](https://cloud.google.com/anti-money-laundering-ai). Now you could do something with this! I was thinking maybe some kinda game where you try to commit money-laundering sucessfully (add hatsune miku and it's the foil to [that game where you do your taxes with an anime girl](https://taxheaven3000.com/)). But alas, it was invite only. I signed up for a demo key or something, but they only called me a couple days after the event had ended ("nono it was just for a stupid hackathon idea I don't actually have billions of dollars to give to google") so we needed a new idea.

Then it hit me. I don't know why exactly, but I saw the google cloud api and I realized, "you can run bad apple on this."

### a bit of history I barely know anything about
In case you didn't know, people put bad apple on everything. The closest comparison I can give you is how people try to run doom on literally anything with a microcontroller. If you don't believe me, here's a playlist of [bad apple running on 145 (as of writing) different things](https://www.youtube.com/watch?v=cuMkI6cDKMs&list=PLajlU5EKJVdonUGTEc7B-0YqElDlz9Sf9). A surprising amouont of them were done by [Junferno](https://www.youtube.com/@Junferno) who's easily a top 3 cs-related content creator imo.

For a reason known only to God I was just struck with the brain wave that you could totally do this on google calendar. It would be the first of its kind (exempting [this](https://www.youtube.com/watch?v=YulFifQifr4) but 1. I didn't actually know it existed until now and 2. they just changed the css, we actually created the calendar)! Bad apple on google calendar! Each pixel could be an event, and each week could be a day!

I was absolutely hyped about this idea. It was a guaranteed win for the google cloud prize if we pulled it off--no one submits anything to it, and when they do they only submit to it because they just happen to be using google cloud! We'd basically bagged those bags from the start!

## the hackathon
The day had come. HackHer413 was originally exclusively woman and non-binary people, but for the past couple years it had been opened up to all genders, so me and my team from the last hackathon were clear to enter. It was a day shorter than HackUMASS at just 24 hours instead of 36, but it was okay because this project should be significantly less techincally complex than [making a browser-based cpu emulator](/static/blogs/hackumass2023).

Our team was mostly the same, with two of my roommates Steven and Jun, and Max and Eric, our friends. No Marshall this time though, I'm pretty sure he was sailing (though that's kinda the default for him if it's the spring semester and it's a weekend). They were all on-board (though surprisingly I had to do some history lessons on bad apple for everyone except Max iirc) and we all agreed: if we could pull this off, we just win.

### the overview
We checked in and we got straight to work. In the early stages of a hackathon it's important to have explicit function definitions and have a lot of em. You want to seperate everything as much as possible to minimize dependancies, and you need them all well defined so that, in case they do depend on anything, you can just treat them like a black box.

Luckily for us, our project is basically a pipeline, starting from the Bad Apple mp4 and ending with a bunch of google cloud API calls.

Let's go over the pipeline and talk about the inputs and outputs at each point. Having defined this so well almost certainly contributed to us actually finishing on time and having every teammate being worked for as much as we could work them for.

1. We need to turn BadApple.mp4 into it's constituent frames, which we do with a shell script that basically just calls ffmpeg.

**inputs**: location of mp4 file\
**outputs**: writies a bunch of pngs to a specific director\
Max did this
 
2. We need to turn each frame (now png) into a pixel matrix. Seeing as Bad Apple is exclusively black and white (exempting some gray for shadows) we made it two-colored for ease of writing the api calls, so we end up with simply a 2D array of 1s and 0s.

**inputs**: location of a png file\
**outputs**: 2d array of pixels\
Jun and Steven did this

3. We need to scale the pixel matrix to an appropriate size. Bad has a reasonable resolution for a video that we definitely cannot match on google calendar (I think we were working with ~100x100).

**inputs**: 2d array of pixels, new width and height\
**outputs**: 2d array of pixels\
Eric did this

4. Once we have the pixel matrix, we need to turn it into what we called "blocks" but would I guess be better defined as "events." More on this later, but for now suffice it to say that a block is defined as a start time, an end time, and a date, and it basically just gets fed into the API.

**inputs**: 2d array of pixels\
**outputs**: array of "blocks"\
Max did this

5. We have to feed the blocks into the API, or in other words actually write to our calendars.

**inputs**: array of "blocks"\
**outputs**: none, it makes makes the api calls\
I did this!!

6. We have to record our result. For this we used puppeteer and just had it take a screenshot, then

**inputs**: uh a webpage?\
**outputs**: a ton of frames\
Max did this

7. We have to recompile our result back into a video, with yet another ffmpeg script

**inputs**: a ton of frames\
**outputs**: a video (though without sound, I edited it in later)\
idk who did this and the script isn't on the github so I can't check the blame, but it was like a single ffmpeg command so it really doesn't matter too much

Of course we also needed to pipe everything together in a little `index.js` of couse, but it was all very parallizable as hopefully is apparent. As someone who's (spoiler alert) won decent prizes in a couple hackathons at this point, this is probably the #1 strategy to do well.

### actually writing the code
And so once we defined this outline it was off to the races! You can probably tell who was assigned what tasks by who completed what. We were pretty consistantly working for the first maybe 6ish hours? until we had something to test. Steven Jun and Eric did preprocessing, Max was on the block algorithm, and I was fighting Google Cloud for all the backpacks it was worth.

Most of it isn't particularly interesting, for google cloud I had to do a little bit of auth, a little bit of cloud console configuring, none of it was that fun, but eventually I got it working. For the pixel matrix stuff Steven Jun and Eric had it done in short order with tests to boot (all the testing of course being trauma from CS220: Programming Methodology).

Probably the most interesting part of this whole process was

### the block algorithm
Me and Max whiteboarded the basic idea for the pixel matrix -> block algorithm since it's not an immediately obvious algorithm. We can schedule ~15 events at the same time for them to still look like pixels, and we can differentiate events by a minimum of 15 minutes.

We also need to order these events, as it happens, since if we're treating them like pixels we obviously care about the ordering. As it happens, the earliest event within a 15 minute window (which as stated earlier will be rendered in the same row) will be rendered first. Thus, if we want to order them, we need to stagger each consecutive event in a timeslot by a minute.

Where the algorithm comes in is mostly for optimization. If we had infinite time to get this thing to run (and if google let us haha) then we could simply have 15 events in every 15 minute row which would truly look like a bunch of pixels. We had a total of 48 hours, however, so optimizations must be made.

Obviously, if you have an entire day colored in, you can just have an all day event. If you have just part of a day all colored in, you can do the same there. Somewhat less obviously, if we have a per-day resolution of 15, and we can group all pixels into some factor of those, then we can actually combine those events as well. This means we can combine both vertically and horizontally, and sometimes we can even do both.

Once we worked out the logistics, I basically just told Max "code this algorithm :3" and he just did it, so massive props to him. More on this algorithm later.

## We were ready to start running it!
It really didn't take us too long to get it running! We were ready to start making the API calls before dinner. It was looking like it'd be smooth sailing. I had done some quick math and determined that, at the rate the API calls were going, it'd take just two hours to finish! We could see it starting to fill out the calendars in super high definition and at this rate we wouldn't even have to pull an all-nighter!

We went to get pizza, came back, and it was basically in the exact same place. What's worse, some of the api calls had failed to make it though. Turns out google doesn't actually like it when you spam hundreds (in total hundreds of thousands) of requests at them rapid fire. It said we should be able to have a throughput of something like 1000 requests/minute, but we were being throttled to barely 100.

Add to the fact that I was actually completely wrong about my math (I accidentally counted frames/weeks instead of blocks) and when we recomputed it it would have taken a couple days assuming google would actually let all our requests through.

We had to make some
### drastic changes
First, we cut the resolution. We were originally doing 15 pixels/row but we dropped it down to 12, both because that's just a 20% pixel decrease, but also because 12 has way more factors (2x as many even!) as 15 does which should make it easier to horizontally combine.

original resolution
![original resolution](highfidelity.png)

Max also made a pretty interesting change to the block algorithm--we would allow for some amount of "mistakes." Basically we would say, "if I am allowed to flip x colors, what would result in the fewest blocks." Obviously this is a little more computationally intensive (something like `n^2`) but we weren't computationally limited, we were limited by the cloud api.

We also were getting backed off. Google had a specific way they wanted you to deal with their exponential backoff, but we just didn't end up implementing it becuase we were under such a time crunch and if we didn't fix it correctly the first time it would be absolutely catastrophic. At this point we were racing against the clock to get all our frames in, even after the massive decrease in fidelity.

The biggest issue was the backoffs though. It was backing us off even at 5s/request which is well below the threshold of our 1000 requests/minute mark, but Google just didn't like getting thousands of requests at 5s intervals I guess. Which I can totally understand and if we'd just implemented exponential backoff as they asked us to it wouldn't be a problem, but at the time we thought it'd just be easier to sit and watch it.

So sit and watch it we did. Whenever a request failed, it would wait for user input to continue the requests. Me, Jun, Steven and Max split up the frames and over the course of the next six-ish? hours we very painstakingly fought google for our frames.

There's a point in every hackathon where you just reach nirvana, and this was it for sure. We were exhausted mentally and physically and for six hours we mostly just sat at our computers, watched the log output, and when it breaks wait for some indeterminate amount of time and then hit enter once and get back to watching the logs

It was kinda fun though. Me and Max played a bit of minecraft while we were waiting, me and Steven did pushups with Meenu (the organizer who dragged us into this in the first place), and we all took turns driving the HackHer413 golf cart with Larissa (also an organizer) which is nice because that was on my bucket list of things to do in college.

What really kept us going more than anything else though was seeing it very slowly come together. There were a lot of "I can totally tell what that is!" and "Look you can see the animation!"s and while it definitely wasn't the most detailed ever, it was definitely coming together.

## and then it was done
We had finished every frame. We spliced it all together by running the puppeteer script on each of our computers (and ensuring the frame number outputs were correct) and then just ffmpeg'd it all back together. I added the music back in with shotcut, as well as the actual video for reference. We uploaded it to youtube, Steven wrote the little devpost blog thing and we were ready to go. I went back and slept but Max (I don't remember why) pulled the all-nighter.

### judging
I didn't get much sleep though because we had to go straight back to judging. I don't really remember too many other projects, one group had like a text-based RPG that was managed by chatGPT that was cool, another guy had a rc roomba with knives, there was some cool stuff for sure

Anyways at this point we were absolutely hyped to show it off. I'd realized at this point we had some daylight savings time mistakes that we'd just have to brush off but otherwise it was as good as it was gonna look. We set up our table, made a little google slides presentation and were ready to go.

Our first judge was Larissa's boyfriend Khiem, and I'd already hyped up our project to him but didn't say exactly what it was yet. When we played the video in front of the judge the first time all of us were just going like "omg its sooo cool" and "bro look at that IT LOOKS LIKE FIRE" and just really hamming it up for him haha

Anyways our pitch for the prizes were pretty simple. We were realistically just going for the "Most innovative use of Google Cloud" prize but you can submit to a couple prizes, so we did. Specifically, our presentation said this:

**Cutest hack**, look at us, we’re the cutest team. And some random person called it cute so if nothing else that should qualify us.\
**Google Cloud**, If this isn’t innovative I don’t know what is\
**Best UI/UX**, We arguably have the best animated google calendar in existence so that should be at least worth something

Yea we were kinda stretching for the first and third but what can you do haha

Khiem did ask "so what's the practical use of this" and we were like "uhhh" but other than that the presentation was great! We had a bunch of other people (and we had to explain the bad apple history to all of them...) who appreciated it to varying degrees.

Everyone acknowledged it was an impressive techincal feet, it's just that some people saw it like we did, as a cool thing we hacked together for a hackathon--just coding for the love for coding. Other people wanted to see something more practical, which we quite frankly did not have.

One judge who we were waiting for with baited breath was our CS220 professor (and my CS311 professor) Marius Minea. We were all massive fans, he's kinda a celebrety amongst the cs students--equally loved and hated. We were on the side that loved him though and so the pressure was on when we were presenting.

The presentation was great, we did get the impression he wanted to see a use, but he did think our optimization algorithm was cool (we did some complexity analysis and stuff since he's the algorithms professor) and I think was impressed.

He did, at the end of it, say basically "you're all guys in a hackathon targeted at women and non-binary people, did you like consider having one of them on your team??" which was kinda terrifying. I was kinda like "uh this is just the same team as the last hackathon bc it was last minute uh and we were dragged into it by our organizer friend--" which I think he kidna accepted?? And like it's true that we were just using the same team as last time, and that team didn't have any women becasue it was kinda just my roommates (all guys) + the people I knew who were into OS and low-level stuff (marshall and max) (both guys) since we were doing a CPU emulator, but it was terrifying being questioned by Marius Minea in the flesh. Funny in retrospect, but I was definitely stuttering in the moment haha

### the results
I was actually awake this time. We didn't actually care about most of the prizes, we were under no illusion that we'd win the grand prize or anything. We were basically certain that we'd be getting those backpacks. Max had promised that he'd just buy me a backpack if we didn't win, but I wasn't worried about that.

We were even discussing the possibility of maybe winning two prizes! Our project had come out really cool after all, and you could I guess describe it as cute--best case scenario we win both cutest hack and google cloud, since the cutest hack prize was projectors, which would make for a nice addition to our dorm.

Anyways the first prize we care about comes up--best UI/UX. We obviously lose it, we weren't really expecting anything from it. A bit later, they announce cutest hack.

### we win it.
![me and my teammates being the cutest](winners.jpeg)

We were kinda in disbelief--this was actually a competitive prize... Something like 30 teams had all submitted to that category and we weren't expecting anything other than the google cloud one. At this point we were absolutely over the moon--both the projectors and the backpack?? It literally could not be better. We'd looked at the challengers in the google cloud category and they had barely done anything with it at all, it was all just on the level of hosting their stuff with firebase. It was absolutely in the bag. A couple prizes later and it's the google cloud prize:

### we lose it.
To a team that hadn't even submitted to that category--there were only four projects that submitted to it including ours, and it was none of them--but used google cloud storage and serverless functions. Don't get me wrong they absolutely deserve it, their project was cool, but it was kinda a normal use of google cloud. I don't think it would be crazy to argue that ours was at least more "innovative."

And it was over. I was clutching my projector, definitely with mixed feelings. Of course cutest hack was cool, it was a way more competeive prize compared to the google cloud one, but uh I kinda needed a backpack.

Anyways after it's all over we head down to chat with the organizers that we knew. Now I did have one possible saving grace--the team that won only had two people, and so only took two backpacks. In other words there were two left. I begged Meenu to get the extra one and she talked to someone who talked to someone, and eventually it came down to this:

Trade in your projector and you get the backpack.

I did actually really want that projector though, and it was probably a more expensive prize than the backpack, right? Well I asked Aditi and she said it was ~$50, I looked at the backpack, found a price tag, saw $80, and promptly switched it out.

And that's the story of how I got a google cloud backpack.

I'm not even sure how much I'll use it anymore, since over the course of my summer internship I did get an intel backpack and like it only feels right to be repping the people who hired me (though the google cloud backpack is way higher quality, sorry intel--) but no matter what it'll always have a special place in my heart

<div style="layout: grid; grid-template-columns: 1fr 1fr"><div>the incumbent<img src="/blog/assets/hackher2024/google.jpeg"></div><div>the challenger<img src="/blog/assets/hackher2024/intel.jpeg"></div>.</div>

I was clutching that thing like it was my baby afterwards. Every time I looked at it for the next like three days I'd just be awash with happiness. It was definitely worth the projector

## so why didn't we win though??
According to sources whom I will not name I got to hear a bit of what the judging decision was like. Everyone did agree our project had lots of techincal merit, and also everyone agreed that it wasn't actually practically useful at all. They thought we should win *something*, just not the google cloud prize apparently, so they gave us a more competitive prize. It would also be I guess a little weird if a team of all boys won 2/9 prizes in a hackathon targeted towards women and non-binary ppl, so that was probably out of the question.

Not that I care because I have a backpack. That's literally all that matters. Sure our project was cool, sure projectors would be nice, sure we didn't win the prize we were specifically targeting, but I have a backpack. Literally could not have come out better. I even got a google cloud waterbottle that came with it!

### what happened next
Max actually continued to optimize the block algorithm! I'll update this with the new video when we run it, probably on Jun's rpi overnight, but he fixed the backoff issues and significantly improved the algorithm. He's writing a blog at some point as well, and he might write about the algorithm specifically, so I'll link it on this page when he does his writeup

### conclusion
I have a cool backpack




