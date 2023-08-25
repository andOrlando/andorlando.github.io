My Dotfiles (nix)
date: 14/8; category: projects;

This will go over the general organization of my nixos dotfiles because
it took a lot of trial and error to get to where I am now, and hopefully
it'll help you skip some of those trials and errors

## flakes
What are they? dunno but it lets me use both nixpkgs stable and unstable.
How do I do this?

## overlays
What are they? dunno this either. Anyways, here's my current flake.nix and let's
go over it together. `...` denotes omitted code.

```nix
{
  description = "System configuration";

  inputs = {
    stable.url = "github:nixos/nixpkgs/nixos-23.05";
    unstable.url = "github:nixos/nixpkgs/nixos-unstable";

    home-manager.url = "github:nix-community/home-manager/release-23.05"; 
    home-manager.inputs.nixpkgs.follows = "stable";

    ...
  };

  outputs = { self, stable, unstable, home-manager, nix-matlab, ... }@inputs:
  let
    system = "x86_64-linux";
    config = { allowUnfree = true; };
    
    nixpkgs-overlays = ({ config, system, ...}: {
      nixpkgs.config.allowUnfree = true;
      nixpkgs.overlays = [
        # modifications to pkgs
        (final: _prev: {
          ...
          rebuild = final.callPackage ./programs/rebuild {};
          ...

          unstable = import inputs.unstable {
            system = final.system;
            config.allowUnfree = true;
          };
        })    
        ...
      ];
    });
  
  in {
  
    # normal stuff
    nixosConfigurations = {
      zephyrus = stable.lib.nixosSystem {
        inherit system;
        specialArgs = inputs;
        modules = [
          nixpkgs-overlays
          ./hosts/zephyrus/configuration.nix
        ];
      };
      ...
    };

    # home-manager stuff
    defaultPackage.x86_64-linux = home-manager.defaultPackage.x86_64-linux;
    homeConfigurations = {
      bennett = home-manager.lib.homeManagerConfiguration {
        pkgs = import stable { inherit system config; };
        extraSpecialArgs = { inherit inputs; };
        modules = [
          nixpkgs-overlays
          ./users/bennett/home.nix
        ];
      };
    };
  };
}

```

Let's start from the inputs. To actually have both stable and
unstable, we need both of them as inputs in the first place. I
also have home-manager following stable.

You can't directly use these inputs like `stable.chromium` or something,
you have to import them first. What data type are they? dunno, I just
know you gotta import them with `system` and `config` first.

Next we got this `nixpkgs-overlays` bit. This is actualy a module
I defined inline instead of a different file. It's the equivalent
of `configuration.nix` or `home.nix`. I'm putting it here because
I don't think there's enough stuff in it to really justify its own
file. I always put it in modules so I have easy acess to my unstable
packages.

If you take a look at the first unnamed overlay (there's others but
they're for app-specific overlays like matlab) you can see that there's
two important fields. I'll talk about `rebuild` a little later when I
talk about my super duper convenient aliases, but `unstable` is where
I actually turn it into a package.

How this overlay works is every property I add gets added to `pkgs` when
I import them in other modules. So `pkgs.rebuild` is my user defined package
and `pkgs.unstable` is all the unstable packages. This means I can do stuff
like `pkgs.unstable.osu-lazer` to get the most up-to-date version of osu so
it doesn't yell at me.

Finally we have the hosts/users. They're normal, just notice how I have
`nixpkgs-overlays` first in the modules thing. idk if the order matters,
probably not, but it's gotta be there for sure if I wanna do my `pkgs.unstable.*`
syntax.

## other cool stuff
First we got this neat little rebuild thing. It's just a shell script
that I made into a package that lets me rebuild my home manager config, 
my system config, both at the same time, and update my inputs.

rebuild/default.nix looks like this:
``` nix
{ stdenv
, lib
, bash
, makeWrapper
}:
let
  script = ./rebuild.sh;
  name = "rebuild";
in
stdenv.mkDerivation {
  inherit name;
  phases = ["installPhase"];
  buildInputs = [ bash ];
  nativeBuildInputs = [ makeWrapper ];
  installPhase = ''
    mkdir -p $out/bin
    cp ${script} $out/bin/${name}
    wrapProgram $out/bin/${name} \
      --prefix PATH : ${lib.makeBinPath [ bash ]}
  '';
}
```

As you can see it's just a simple way to package a shell script. Is there a
better way to do this? probably! Please let me know and I'll do that instead.

rebuild/rebuild.sh looks like this:
```bash
function config() { sudo nixos-rebuild switch --flake path:/etc/nixos#; }
function home() { nix run /etc/nixos switch -- --flake /etc/nixos; }
function update() { nix flake update path:/etc/nixos; }

if [ "$1" = "home" ]; then home; fi
if [ "$1" = "config" ]; then config; fi
if [ "$1" = "update" ]; then update; fi
if [ "$1" = "" ]; then config; home; fi
```

as you can see it simply builds it depending on what I tell it to do. It 
assumes /etc/nixos becasue that's kinda the only way to make it easily portable.
I just `chmod -R o+w /etc/nixos` whenever I'm on a new device so I don't need
to sudo everything all the time.

## everything else
you can probably just check out everything else in the actual repo, most of
it is pretty self explanatory. I factor out common stuff into modules for
`configuration.nix` and all my config stuff is shared between homes, also
as modules. I have a couple programs I've packaged myself and they sit in
`programs`.

It's taken me like a whole year to get to this state where I'm actually happy
with my config and it doesn't feel super slapdash so hopefully it'll be a little
of use to you.