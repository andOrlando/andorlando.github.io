Overengineered Notion Stuff
category: stupid stuff; date: 13/7/2023;

So it's not even the first week of College and I get covid. I go home, isolate
myself on the third floor, have my entire family wait on me and do absolutely
nothing but stare at one of a couple screens and feel miserable for the next
two weeks. During that time of staring at screens and feeling miserable, however,
I got into notion.

I always was pretty bad with organization but with notion I would just put all
my assignments in for an entire semester and work on them one day/week/month
at a time, and notion was a pretty good tool for doing that. There were a couple
issues, however, and they led me to creating some pretty wack formulas

Feel free to steal any of these formulas btw, though I feel like only the time
formula is actually that useful.

## formulas are cool
Notion is all about tables. Everything is in a table. In these tables you can
have formulas. Formulas are basically javascript but only expressions and the
only variables you can access is stuff in the same row as you. Aside from that
they're pretty versatile and you are in fact allowed regular expressions which
means you can put together some really hacky stuff if need be (which I do lol).

### time formula
So the first issue I had with notion is I wanted to see everything that was due
this week. Notion at the time, however, didn't allow me to filter by "dates between
this monday and this sunday," it just let me see the next 7 days. Problem is, I would
finish a bunch of stuff one day and have it immediately replaced the next, making it
feel like neverending and terrible and it was actually an issue. So of course I made
a massive formula.

The idea is I'm going to have a single field with a bunch of indicators--different 
characters will mean its within different timespans:
- 🟦: today
- 🟪: tomorrow
- 🔵: this week
- 🟣: next week
- 🔷: this month

The formula is as follows
```typescript
//today start < end date < today end
(dateAdd(dateAdd(now(), -hour(now()), "hours"), -minute(now()), "minutes") <= prop("End Date Gen") and 
dateAdd(dateAdd(now(), 23-hour(now()), "hours"), 59-minute(now()), "minutes") >= prop("End Date Gen")
? "🟦" : "") +

//tomorrow start < end date < tomorrow end
(dateAdd(dateAdd(dateAdd(now(), -hour(now()), "hours"), -minute(now()), "minutes"), 1, "days") <= prop("End Date Gen") and
dateAdd(dateAdd(dateAdd(now(), 23-hour(now()), "hours"), 59-minute(now()), "minutes"), 1, "days") >= prop("End Date Gen")
? "🟪" : "") +

//monday start < end date < sunday end
(dateAdd(dateAdd(dateAdd(now(),
	-hour(now()), "hours"),
	-minute(now()), "minutes"),
	1-(day(now()) == 0 ? 7 : day(now())), "days") <= prop("End Date Gen") and
dateAdd(dateAdd(dateAdd(now(),
	-hour(now()), "hours"),
	-minute(now())-1, "minutes"),
	8-(day(now()) == 0 ? 7 : day(now())), "days") >= prop("End Date Gen")
? "🔵" : "") +

// next Monday start < end rage < next sunday end
(dateAdd(dateAdd(dateAdd(dateAdd(now(),
	-hour(now()), "hours"),
	-minute(now()), "minutes"),
	1-(day(now()) == 0 ? 7 : day(now())), "days"),
  1, "weeks") <= prop("End Date Gen") and
dateAdd(dateAdd(dateAdd(dateAdd(now(),
	-hour(now()), "hours"),
	-minute(now())-1, "minutes"),
	8-(day(now()) == 0 ? 7 : day(now())), "days"),
  1, "weeks") >= prop("End Date Gen")
? "🟣" : "") +

//1 start < end date < 31 (or whatever) end
(dateAdd(dateAdd(dateAdd(now(),
	-hour(now()), "hours"),
	-minute(now()), "minutes"),
	1-date(now()), "days") <= prop("End Date Gen") and
dateAdd(dateAdd(dateAdd(dateAdd(dateAdd(now(),
	-hour(now()), "hours"),
	-minute(now()), "minutes"),
	1-date(now()), "days"),
	1, "months"),
	-1, "minutes") >= prop("End Date Gen")
? "🔷" : "")
```

Yeah I told you it's crazy. This is still significantly less complicated than the next one,
however. Anyways I then just filter by when the formula contains the correct character and
it tells me what I want it to tell me.

It the property "End Date Gen" which is basically the end date but with default values if
the user doesn't input one. It takes in "End Date" and if it doesn't exist it just does like
Jan 1st 3000 or something. Formula for that is:

```typescript
empty(prop("End Date")) ? fromTimestamp(3.250378434e+13) : prop("End Date")
```

Anyways this is basically what kept me using notion for so long. I kinda dropped off second
semester because of reasons I'll elaborate on in the conclusion, but if I slightly modified
this formula or used better search queries it likely would have been super useful. Anyways,
if that formula is the core of my notion experience, this next formula is absolutely useless

### schedule
This thing is a monster. I was complaining with a friend about how notion is *almost* perfect,
but I would like to be able to use it as a calendar, not just a fancy todo list. I had already
made the timeformula and a couple others (which are also notable and very long but boring
so I'm not writing about them) and we were contemplating whether something like a calendar app
was possible to emulate in notion. My thoughts on its viability were something like "nah, oh wait,
nvm, oh actually no, wait yes, actually no, wait maybe" until I settled on a "probably."

The reason I deliberated so much was because there were a good number of barriers preventing this
from being possible, and the only way I overcame them was with some pretty insane regex hackiness.

First, how do I link two tables together? I need one table to display the schedule (the calendar)
and another to actually have the events, because there's no way I'm hardcoding events that's a copout.
The solution to this is to have a single column in events that hosts all the data and roll up every 
event to every row in the calendar view. By doing that, we would basically get a comma-separated string
of all of the events. It looks something like this:

```
HIS 112 mon 10:10-11:00 10/01/22-12/12/22, HIS 112 wed 10:10-11:00 10/01/22-12/12/22, HIS 112 fri 10:10-11:00 10/01/22-12/12/22, Math 233 mon 12:20-13:10 00/00/00-12/12/22, Math 233 wed 12:20-13:10 00/00/00-12/12/22, Math 233 fri 12:20-13:10 00/00/00-12/12/22, FYS 191 mon 13:25-14:15 00/00/00-12/12/22, BUILD UMass wed 17:30-18:30 00/00/00-12/21/22, CS187 Lab thu 17:30-18:20 00/00/00-12/12/22
```

So we've got the data from the tables, but now how do we filter it to specific time slots? Basically,
each row of the table will be a different time, like in a normal calendar, and each column will be a 
different day. So basically, given a time a day of the week, I need to determine if an event will be
within that time slot.

How do I do this? lots, and I mean lots, of regex. I don't think you understand exactly how much
regex--it's **lots**.

Day of week is pretty easy, we replace all entries with days other than monday with "".

Then we get to time. This is where it gets really difficult--First, we have to effectively
do integer comparison in regex. How do you do do that? Well you have to use dynamic regular
expressions. We basically prune all the times outside our window. We do this by using the fact
that `[0-5]` will match all numbers from 0 to 5. So if we do `[0-n]`, we can effectively match all
numbers less than `n`. Basically I do that 8 times, one for each digit of start time, and one for 
each digit of end time

Finally we do date which is much of the same. We prune any events where the current date is before
the event is supposed to start or after its supposed to end. After that we should only have one event
left, assuming we're not double-booked (which I didn't actually account for in the code).

So what does this monstrosity look like? Please, feast your eyes on the monday code.
```typescript
//full boyo
replaceAll(
replaceAll(
replaceAll(
replaceAll(
replaceAll(
replaceAll(", " + prop("Events"),

/* non-monday-stuff */
", [^,]*(?: (?:tue|wed|thu|fri|sat|sun) )[^,]*", ""),

/* if first one matches everything less than time, remove */
", [^,]*(?:" +
"["+format(prop("a")+1)+"-9]\\d:\\d\\d" +
(prop("b")<9 ? "|"+format(prop("a"))+"["+format(prop("b")+1)+"-9]:\\d\\d" : "") +
"|"+format(prop("a"))+format(prop("b"))+":["+format(prop("c")+1)+"-9]\\d" +
(prop("d")<9 ? "|"+format(prop("a"))+format(prop("b"))+":"+format(prop("c"))+"["+format(prop("d")+1)+"-9]" : "")
+ ")-\\d\\d:\\d\\d[^,]*", ""),

/* if second one matches everything less than time, remove */
", [^,]*\\d\\d:\\d\\d-(?:" +
slice(
(prop("a")>0 ? "|[0-"+format(prop("a")-1)+"]\\d:\\d\\d" : "")+
(prop("b")>0 ? "|"+format(prop("a"))+"[0-"+format(prop("b")-1)+"]:\\d\\d" : "")+
(prop("c")>0 ? "|"+format(prop("a"))+format(prop("b"))+":[0-"+format(prop("c")-1)+"]\\d" : "")+
(prop("d")>0 ? "|"+format(prop("a"))+format(prop("b"))+":"+format(prop("c"))+"[0-"+format(prop("d")-1)+"]" : "")
,1) + ")[^,]*", ""),

/* match all first ones greater than day*/
", [^,]*(?:" +
slice(
(year(prop("m"))%100/10<9 ? "|\\d\\d\\/\\d\\d\\/["+format(floor(year(prop("m"))%100/10)+1)+"-9]\\d" : "") +
(year(prop("m"))%10<9 ? "|\\d\\d\\/\\d\\d\\/"+format(floor(year(prop("m"))%100/10))+"["+format(year(prop("m"))%10+1)+"-9]" : "") +
((month(prop("m"))+1)/10<9 ? "|["+format(floor(month(prop("m"))/10+2))+"-9]\\d\\/\\d\\d\\/"+formatDate(prop("m"),"YY") : "") +
((month(prop("m"))+1)%10<9 ? "|"+format(floor(month(prop("m"))/10+1))+"["+format(month(prop("m"))%10+2)+"-9]\\/\\d\\d\\/"+formatDate(prop("m"), "YY") : "") +
(date(prop("m"))/10<9 ? "|"+formatDate(prop("m"),"MM")+"\\/["+format(floor(date(prop("m"))/10)+1)+"-9]\\d\\/"+formatDate(prop("m"),"YY") : "") +
(date(prop("m"))%10<9 ? "|"+formatDate(prop("m"),"MM")+"\\/"+format(floor(date(prop("m"))/10))+"["+format(date(prop("m"))%10+1)+"-9]\\/"+formatDate(prop("m"),"YY") : "")
,1) + ")-\\d\\d\\/\\d\\d\\/\\d\\d", ""),

/* match all second ones less than day */
", [^,]*\\d\\d\\/\\d\\d\\/\\d\\d-(?:" +
slice(
(year(prop("m"))/10>=1 ? "|\\d\\d\\/\\d\\d\\/[0-"+format(floor(year(prop("m"))%100/10)-1)+"]\\d" : "") +
(year(prop("m"))%10>=1 ? "|\\d\\d\\/\\d\\d\\/"+format(floor(year(prop("m"))%100/10))+"[0-"+format(year(prop("m"))%10-1)+"]" : "") +
((month(prop("m"))+1)/10>=1 ? "|[0-"+format(floor((month(prop("m"))+1)/10-1))+"]\\d\\/\\d\\d\\/"+formatDate(prop("m"),"YY") : "") +
((month(prop("m"))+1)%10>=1 ? "|"+format(floor((month(prop("m"))+1)/10))+"[0-"+format((month(prop("m"))+1)%10-1)+"]\\/\\d\\d\\/"+formatDate(prop("m"),"YY") : "") +
(date(prop("m"))/10>=1 ? "|"+formatDate(prop("m"),"MM")+"\\/[0-"+format(floor(date(prop("m"))/10)-1)+"]\\d\\/"+formatDate(prop("m"),"YY") : "") +
(date(prop("m"))%10>=1 ? "|"+formatDate(prop("m"),"MM")+"\\/"+format(floor(date(prop("m"))/10))+"[0-"+format(date(prop("m"))%10-1)+"]\\/"+formatDate(prop("m"),"YY") : "")
,1) + ")", ""),

"(?:mon|tue|wed|thu|fri|sat|sun).*", "")
```

So I never actually used this. It's great to talk about and it was really fun to make, but 
it's like really really slow. It has to run a lot of regex on a lot of things and I don't
think notion was really optimized for this. Notion wasn't really made for this kind of thing
in the first place

## Conclusion
So I didn't really use notion my second semester of college because with all my formulas it was
starting to get slow and unorganized--it was almost like a messy bedroom. Additionally, basically
all my work was assigned at a much slower pace. Most of my assignments were on a biweekly basis
and since my time thing only would show stuff one week at a time, it resulted in me missing stuff,
and because of that I started to wean off notion. I was overly reliant the first semester, so when
the second semester came and it wasn't up to snuff, I kinda suffered for it.

That's not to say it's not redeemable, however! I might pick it back up next semester and just add
a biweekly view if I have biweekly stuff. It's relatively easy to do and likely doesn't even require
rewriting anything. That being said, notion is still an electron app and is definitely a little
slow and bloated for my taste.

I'm vaugely considering writing my own cute little cli/tui todo list (maybe rust?) or switching
to Obsidian.md, but my adventures in notion have been pretty fun regardless, and if nothing else
I really enjoyed writing those formulas.
