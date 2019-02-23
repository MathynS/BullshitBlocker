## Overview

Tired of seeing articles about Megan's babyshower, or don't care which Kardashian is in the news now? 
Then this plugin is the perfect solution for you!
Filter these stupid articles from your favourite news website or blog and start reading the articles that matter.
This plugin allows you to enter a list of keywords that you want to filter and will try it's best to filter these 
articles for you on selected websites. 

![Before and After](https://mathyns.github.io/BullshitBlocker/images/before_after.png)

In the example image we can see on the left 2 articles about a marriage and the oscars. 
On the right side, we see the plugin active, with the keywords 'oscars', and 'oscars'.
As expected these 2 articles are filtered and we can focus on the important news! 

## Usage
When you are on a supported website (see next section) the plugin will try to filter out the items containing your keywords.
You can add keywords by clicking on the plugin button first (![Logo](https://mathyns.github.io/BullshitBlocker/images/icon16.png)).
A popup will be shown with an input field to enter new keywords.
Existing keybords can be removed by clicking on the '&times;' next to the keyword.

## Supported websites

Currently the following websites are supported:
- https://www.msn.com/
- https://www.nu.nl/
- https://tweakers.net/
- https://nos.nl/

You can help to expand the supported websites, by either requesting it on the github issues page or by adding the site 
yourself in a pull request. Next section will explain how to do this.

## Adding a site yourself

Create a pull request in which you modify the file 'config.json'.
In this file, add a key in the JSON file with the domain of the site. 
As value, include the xpaths of elements that need to be filtered.
In these xpaths you can use the string '\<keyword\>', which will be replaced by the plugin with keywords of the user.
Usually you want the xpath on an \<a\> tag or the parent of this tag.

Example xpath:

> //div[@id='ccm_notification_wrapper']

Note that a xpath will always start with '//', this double slash indicates to search for all nodes, no matter where they 
are located. 
Also make sure that the xpath does not remove important elements on a site such as navigation menus etc.
A good way to test your xpath is by inspect the webpage (press F12 or Crtl + Shift + I), search here by pressing 
Crtl + F and paste your xpath here.
