This Website
category: projects; date: 7/13/2023;

This entry is split up into a couple parts because this is a relatively big
project:

- doing circles
- doing colors
- doing markdown
- fighting with pratyush
- doing static site generation
- accidentally deleting my static site generation
- and everything else

### circles
So in senior year of high school I was making a presentation for AP Lang and I wanted it to look nice but was too prideful to use a theme. So I made this title screen

![image of slideshow](slideshow.png)

The actual project got discontinued sadly. It was supposed to be a project about advertisements or something so I had the idea of making a fake charity for people whose names started with "ben" but Ms. Sher (best AP Lang teacher) pulled me aside and was like "uhh I know this is a joke but maybe someone somewhere could see it as insensitive" which was kinda sad because it would've been funny but whatever

Tangent aside, I like how it looks but it was a little too easy. That's why I made it generate this type of thing. How bad could it be I thought?

Honestly it wasn't that bad but there was some relatively interesting math behind it. First, I had to think about a general shape. Almost an average of these. From the start I've done what you see now by separating it into quadrants almost.

The way I get that quadrant-y distribution is I actually use a unit circle and basically slice it into quadrants. I do it in polar though so I can have a float from 0-1 that will result in a certain placement along the path of the circle. The distribution code looks like this:

```js
const distribute=t=>[
  Math.sin(Math.PI/2*(t+factor))+1,
  Math.cos(Math.PI/2*(t+factor))+(factor&1^1)]
```

where factor is `quadrant % 2 + 2` or basically 2 quadrant is odd and 3 if quadrant is even. This is weird for two reasons:

1. I have to shift up all the other quadrants of the circle into the first quadrant so that it actually shows up on screen, because the svg path thing only operates in the first quadrant

2. I only actually do stuff with the 3rd and 4th quadrants, for everything else I flip the svg 180deg. This allows me to let the svg take up the entire screen so I can have the circles overflow beyond the 100vh x 100vh box that would otherwise clip it. There was probably another way to do this but I didn't do that one and now it works so I'm not touching it lol

Then I deal with the distribution of the circles. To do this I kinda had to think generally about what I wanted the end result to look like. I came up with the following approximate rules:

1. we separate circles into three sizes tiers: big boys, med circles and small bois (this is how I reference them in the code so you have to deal with it)

2. there should be ~1 big boy but sometimes more, concentrated in the center
3. there should be ~2 medium circles sometimes more, concentrated on the outskirts
4. there should be ~5 small circles sometimes more sometimes less, concentrated on the outskirts

5. no circles in the same class should really overlap that much (except big boys because they're kinda too big not to overlap)

Yay now we just have to code all these rules. One thing I needed was a way to distribute things randomly but weight it to favor the center/the outskirts, and a way to weight things to favor one end or the other. The method for this I came up with was basically getting a random float and taking it to some power.

If I want a skewed random I can simply take a float and take it to the given power. a fractional power will result in generally higher numbers whereas a number > 1 will result in generally lower numbers. I then truncate it to the lower and upper bounds given.

To get my weighted random I basically just take that, cut it in half and mirror it. It's not quite that simple because I have to actually decide whether or not to mirror it as well, so I basically halve it and add back 0.5 if it was originally above 0.5. The two functions look like this:

```js
export const weighted_random=(w,l=0,u=1)=>{let r=Math.random(),g=r>0.5;return(((r-g/2)*2)**w/2*(1-2*g)+g)*(u-l)+l}
export const skewed_random=(w,l=0,u=1)=>(Math.random()**w)*(u-l)+l
```

look I don't touch `weighted_random` anymore. They don't really need to look like this, but I think it's cooler this way and they work so I'm leaving them like this. The beauty of personal projects is that instead of optimizing for readability I can optimize for coolness.

Calcing overlap was a lot easier than I thought it'd be. Originally I was going to do area overlap but the math for that is stupidly complex and I couldn't find a straight area online, so I just calced radius overlap by taking the distance between the two centers then taking the maximum radius / distance and used that as overlap.

I then would iteratively create new circles and each time check whether it was below the overlap threshold. If it wasn't, I'd just regenerate it and slightly decrease the overlap threshold (to prevent an impossible configuration from sending it into an infinite loop--I'd rather it look kinda bad then it crash).

Why don't I just generate all the circles at the same time and check for overlap then? Because I didn't wanna. Is it a better idea probably? Maybe. Would it eliminate the need for decreasing the overlap threshold each time? Probably. Do I care? a little but it's too much effort to fix it now :)

I finally scale everything by 0.4 in x and 0.9 in y generally because I think it looks cooler that way then I let it free.

### colors
okay so this is really stupid. Like super duper stupid. The theme thing is cool but like I could have done everything with the `hsl` css thing instead of making a whole ass hsl-rgb-hex color converter. But I did, and now I'm using it and I don't really care. I basically just ported [my lua color library](https://github.com/andOrlando/color) to javascript to get the hex -> hsl conversions that I wanted

Then I basically make a bunch of different color modification functions, which takes some base color and randomly converts it into a color of a general theme, like dark, darker, even darker and darkest.

I also try to preserve theme through navigation using a little helper function and a localStorage variable that's consumed whenever a navigation happens. I just keep the base theme color and rebuild colors off of that every time. All of this is done in `lib/theme.js`

### markdown
so initially I had a really simple markdown parser exclusively using regex. It looked like this and was beautiful:

```js
//I guess I just beat it into submission with regex?
let res = raw
  .replace(/### (.*)$/gm, "<h3>$1</h3>")
  .replace(/## (.*)$/gm, "<h2>$1</h2>")
  .replace(/# (.*)$/gm, "<h1>$1</h1>")
  .replace(/\!\[(.*?)\]\((.*?)\)/gm, "<img alt=\"$1\" src=\"$2\"></img>")
  .replace(/(?<!\!)\[(.*?)\]\((.*?)\)/gm, "<a href=\"$2\">$1</a>")
  .replace(/---/gm, "<hr>")
  .replace(/```\n?([\s\S]*?)```/gm, "<pre><code>$1</code></pre>")

  .replace(/((?:^- .*$\n?)+)/gm, "<ul>\n$1\n</ul>")
  .replace(/(?<=<ul>[\s\S]*?)- (.*)$(?=[\s\S]*?<\/ul>)/gm, "<li>$1</li>")
  .replace(/((?:^> .*$\n?)+)/gm, "<blockquote>\n$1\n</blockquote>")

  .replace(/(<pre>[\s\S]*?<\/pre>)|(?<=.*^[^<\n].*?)\n(?=[^<\n].*$)/gm, "$1 ")
  .replace(/^([^\n<]+?)?$/gm, "<p>$1</p>")

  .replace(/\*\*(.*?)\*\*/gm, "<strong>$1</strong>")
  .replace(/\*(.*?)\*/gm, "<em>$1</em>")
  .replace(/_(.*?)_/gm, "<u>$1</u>")
  .replace(/`(.*?)`/gm, "<code>$1</code>")
```

and beat it into submission I did.

So this thing was pretty great. It was stupid, yes, it wasn't by any means the best way to make a markdown parser, but I kept everything client-side and that was what I wanted. it also just looks sick. Look at all the characters.

See I don't really like static site generation. It makes things annoying to test and it doesn't really feel like actual code most of the time. Not that I've used anything like hugo or wordpress, but if it's not javascript I'm not super into it. It's really the same for most frameworks--they always come with some limitations which either require me compromising my vision or doing something hacky.

Then I got into a
### fight with pratyush
basically I was asking him a question about regex and the exchange which was probably a good hundred of texts boiled down to this:

**pratyush**: "this is stupid"

**me**: "yeah but it's fun"

**him**: "that's fair but what about non-scripters"

**me**: "I don't care about them"

**him**: "but what about SEO"

**me**: "ah shit you're right"

so I switched to static site generation. Basically since none of these blogs were originally actual pages on my website that could be crawled by a web scraper, they were just markdown files that were converted into HTML in real time, it's probably pretty terrible for SEO. It also wouldn't be possible to directly link to individual blogs. Not that I super duper care about SEO, but like if I ever write about something new or cool or something maybe it'd be worth seeing sometimes.

So I decided to do static site generation via a little nodejs and a little github actions.

### static site generation
This was, for the most part, pretty easy. For the blogs I would just crawl the `/blog/blogs` dir and feed them into marked. I did have to process the metadata (which is the first two lines) but that wasn't a challenge.

The only tricky thing that came up later was images and references to them. To deal with these I initially tried using marked-base-url but that didn't do what I wanted it to so I gutted it lol and basically forced it to do what I wanted in two lines instead of a whole node package

Before I did static site generation I had to generate my table of contents using a json file because you can't crawl directories in the browser, but I can in node so it let me do away with that which was nice.

The generated sites do actually all redirect you to /blog/ though under the hood though because that way I can have the seamless transitions between blogs and the cool sidebar without having to repeat a bunch of code which is nice.

### accidentally deleting my static site generation
So I had a fully functioning resume generator thing that would take a json file and turn it into a weird nested thing that I throw a bunch of CSS onto. The thing is, when I was testing something to do with the structure of my `static` directory, I accidentally did `rm -r scripts` instead of `rm -r static`. I had it backed up to before I made the resume generator but yeah I lost all the resume stuff which was pretty annoying

Luckily I still had the resume open so I just downloaded the HTML and rewrote it so that the output would be identical. It wasn't a particularly difficult algorithm it's just that there were a couple finicky bits.

It's kinda cool, it basically is just a bunch of nested objects, each can have a `title`, `subtitle`, `description` and `date`. The big bit is they can also have `content` though which is basically either child objects or the contents of a leaf node. It'll be defined as a leaf node either if it has a `type`, which is like `tags` or `bullets` or key value pairs or something, or if content is empty. This lets me have a clear hierarchy and makes it really easy to update my resume just by modifying the json file.

### resume styling

So now I've added an easy way to have a bunch of different styles which you can see by hitting the "switch style" button on the resume page. This is also all done with static site generation for one specific reason.

I never want to do file crawling clientside.

That's becuase you can't, unless you like generate a list of files to get beforehand which is annoying, so that means I have to crawl for the various styles, which are just css files in the `/resume/styles` directory, in my static site gen script, but also that means I have to have the buttons do their work with said results of crawling. This results in an abomination like this:

```js
const styles = fs.readdirSync(ROOT_DIR + RESUME_PATH + "styles/", "utf8")
const switch_script = `
const styles = [${styles.map(a => `"${a}"`).join(",")}]
let idx = styles.indexOf("default.css")

document.getElementById("switchbutton").addEventListener("click", () => {
  idx = (idx + 1) % styles.length
  document.getElementById("switchstyle").setAttribute("href", "${RESUME_PATH}/styles/" + styles[idx])
})`
```

where I have to generate a javascript array as text from a different javascript array which honestly is probably one of the most disgusting things I've ever written, but hey you gotta do what you gotta do and I think this is probably the most idiomatic solution save completely switching to a templating language (as Pratyush suggested) which I definitely won't do because I don't want to have to make it do the weird static→non-static (via script) redirection thing I got going.

### everything else
everything else I do to it will go here I guess. It's not done yet


