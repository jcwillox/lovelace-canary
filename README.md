# 🐤 Canary

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)

The idea behind Canary is to extend the functionality of Lovelace in a non-drastic way. This is done mainly, by adding extra configuration options (extensions) to pre-existing Lovelace elements.

This plugin could be thought of as almost a staging ground for features that if suitable could end up in core Lovelace, hence the name borrowed from Chrome Canary. It's unclear how well that statement will hold, it could also be called "Extensions".

## Usage

Much like [card-mod] Canary extends the default lovelace cards, so you don't need to actually define a `canary-card` for these options to work. The options are added to their respective cards as 'extensions'.

###  Available Extensions

* [Generic Entity Row](https://github.com/jcwillox/lovelace-canary/wiki/Generic-Entity-Row)
	* [`secondary_info`](https://github.com/jcwillox/lovelace-canary/wiki/Generic-Entity-Row#secondary_info)
	* [`canary_style`](https://github.com/jcwillox/lovelace-canary/wiki/Generic-Entity-Row#canary_style)
	* [`canary_theme`](https://github.com/jcwillox/lovelace-canary/wiki/Generic-Entity-Row#canary_theme)
	* [`hide_warning`](https://github.com/jcwillox/lovelace-canary/wiki/Generic-Entity-Row#hide_warning)
* [Generic Card](https://github.com/jcwillox/lovelace-canary/wiki/Generic-Card)
	* [`no_card`](https://github.com/jcwillox/lovelace-canary/wiki/Generic-Card#no_card)
	* [`canary_style`](https://github.com/jcwillox/lovelace-canary/wiki/Generic-Card#canary_style)
	* [`canary_theme`](https://github.com/jcwillox/lovelace-canary/wiki/Generic-Card#canary_theme)
* [Glance Card](https://github.com/jcwillox/lovelace-canary/wiki/Glance-Card)
	* [`align`](https://github.com/jcwillox/lovelace-canary/wiki/Glance-Card#align)
* [Vertical Stack](https://github.com/jcwillox/lovelace-canary/wiki/Vertical-Stack)
	* [`in_card`](https://github.com/jcwillox/lovelace-canary/wiki/Vertical-Stack#in_card)
* [Canary Card](https://github.com/jcwillox/lovelace-canary/wiki/Canary-Card)
	* `style`
	* `theme`

For more information head over to the [wiki](https://github.com/jcwillox/lovelace-canary/wiki).

## Credits

I'd like to recognise Thomas Lovén's influence on this card, his work on [card-tools] made the creation of this vastly quicker and easier. Reference to his and other people's lovelace cards is, at this point, like 90% of my knowledge on JavaScript and polymer UI. Code from Thomas Lovén's [card-mod] is the backbone of the extensions to lovelace and what gave me this idea in the first place.

## Installation

```yaml
resources:
  - url: /hacsfiles/lovelace-canary/canary.js
    type: module
```

[card-mod]: https://github.com/thomasloven/lovelace-card-mod
[card-tools]: https://github.com/thomasloven/lovelace-card-tools
