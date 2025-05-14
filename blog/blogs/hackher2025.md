HackHer413 2025
category: school; date: 5/13/2025;

- [X] devpost is [here](https://devpost.com/software/gitcoin-8i4o1k)
- [X] github is [here](https://github.com/BananaMiku/Gitcoin)
- [X] base of the chain is [here](https://github.com/BananaMiku/Gitcoin_base/commits/main/)

### Gitcoin

Commit hashes depend on the contents of the commit and the previous commit hash, creating an immutable ledger. You know what else wants an immutable ledger? That's right, ~~scam artists~~ cryptocurrencies! 

Let me preface this with the fact that none of us have ever done any crypto stuff before except one dude who took a class on it, and I don't actually think it's *the future of finance* or whatever. That being said, as soon as we came up with the name, we knew we had to do it.

I also think it follows well from the spirit of the last hackathon--something fun to talk about and implement that's realistically completely useless. I think the best part though, was that we could put some private keys in pastebins in QR codes that we then 3d printed to give to the judges, so we could physically give them gitcoin and try to bribe them to like us (it didn't work) (also it's worthless lol)

### Implementation details

Basically, a node would be valid if it has the required number of 0s in the first commit hash. Since commit hash is dependant on the commit message, we can put a randomly generated string header at the top of our commit message (block of transactions) and the challenge would be to find a header that results in the commit message having enough zeros.

To use someone else's chain we basically "rebase" on theirs, then we can continue mining. We can validate the chain by just crawling through each commit and verifying that all the transactions are sound and the previous transactions they reference are sourcing the money correctly.

All that is wrapped up in a cute little CLI that includes some very nice animations that Austin made, which we then converted to ASCII to play in the terminal while it's mining/transferring/etc.

TODO: add animation gifs

tbh I'm only semi-convinced that our explanation on the devpost isn't chatgpt'd, why is the word "delve" in there. I mean the information is accurate, we did watch a bunch of 3 blue 1 brown but I feel like I'd avoid that word if I was writing a blog lol. I guess it's in the sprit of a tech-bro so I guess it's fine for this project lol

I don't have too much to write here, it was a 24 hour hackathon and honestly it probably went the smoothest out of all of them. Since I've been working with the same team this whole time we're pretty efficient at this point. Max did most of the mining work which I know because he wrote the CUDA slides. I think I did rebasing? My commit messages really aren't helping me remember, since half of them look like `removes rsa.pub to ???` or `makes verification work!!!` I really ought to write better commit messages for the sake of my future self.





