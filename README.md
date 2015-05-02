# Continual
###  Run tasks on interval.

Simple task runner written in node js.  
  
  
## Installation  
Continual is preffered to be installed globally.  
```
[Installation command here whenever package is published]
```
  
  
## Usage
Continual needs to be intiailized in the directory where its job will be run from.  
You could of course run jobs from anywhere, and let them do whatever they want, so its not in any type of "jail".  
Initialization is easy, just point your terminal to the directory where you want it to run and summon it with the following magic words:

```
> continual -init
```

This will initialize continual in the folder.  
And by initialize, I mean, create some folders and a config file under '.continual'.  
If you are not working alone, and your co-workers are not using continual, you might want to put that folder in the ignore file!  
  
When continual is intialized, it will allow you to run the 'start command', which is even easier!

```
> continual
```

Yay, it starts!  
But... we have a small issue here. No jobs nor notifiers are installed..!  
Sooo... how to install a job or a notifier?

##### Installation of Jobs.

First off, we need to find a job for continual to do (you can test one of mine, examples are in the example folder).  
As of now, there is no super cool command to install a job, but be sure that I am working on it!  
So for now, you will have to browse to the folder that continual just created (`.continual`) inside this folder we have a `config.json` file and two folders:  
`Notifiers` and `Jobs`.  

Place your Jobs in the `Jobs` folder (waaat?!).  
Then open the `config.json` file.  
  
A fresh config file should look something like:  

```json
{
    "notifiers": [],
    "jobs": []
}
```

In the `jobs` array, we want to create a new json object for the job.  
Each job requires two properties: `path` and `interval`.  
The path is the path to the job script and is relative to the .continual folder.  
And the interval property specifies how often to run the job.  
The interval object takes two key value pairs: `value` which is a number, and `unit` which have to be one of the following:  
  
* 'd' : Days - (1 day - 24h)
* 'h' : Hours
* 'm' : Minutes
* 's' : Seconds
* 'ms' : Milliseconds
  
To add a script that currently dwells in the `jobs` folder, make your file look something like:  
  
```json
{
    "notifiers": [],
    "jobs": [
      { 
        "path": "Jobs/superawesomejob.js",
        "interval": {
            "value": 5,
            "unit": "m"
        }
      }
    ]
}
```

Thats it, your job will now run every 5 minutes!  

  
But... Without a notifier it won't let you know that its done!  
So next we try install a notifier.

##### Installation of Notifiers.

Find a notifier (can test one of the example ones if you wish).  
As with jobs, there is currently no command to install notifiers, so for now, browse to the `.continual` folder.  
Open the `Notifiers` folder and place you notifier script there.  
Return to the `config.json` file.  
Now, instead of editing the `jobs` list, we want to edit the `notifiers` list.  
  
Notifiers is only a string, a path to the script. Nothing more, so when a script is added, the config should look something like:  
  
```json
{
    "notifiers": [
      "Notifiers/superawesomenotifier.js"
    ],
    "jobs": [
      { 
        "path": "Jobs/superawesomejob.js",
        "interval": 5
      }
    ]
}
```

Then start continual again, and it should load the notifier.  
  
The start up text should look something like...

```
Info    (20:39:56): Loaded notifier: superawesomenotifier (1.0.0.0)
Info    (20:39:56): Loaded job: superawesomejob (1.0.0.0) - Interval: 5
Info    (20:39:56): Continual loaded and ready. Starting jobs.
Info    (20:39:56): All jobs started.
```

## Make your own damn jobs!
Okay, that was uncalled for.  
But I would really recommend writing your own, its super simple, and its a bit more customisable than using my example scripts...  
So how to do it?  
  
For description on how to implement a job, check out the following [Wiki](https://github.com/Johannestegner/node-continual/wiki/Create-Jobs) entry.  
For description on how to implement a notifier, check out the following [Wiki](https://github.com/Johannestegner/node-continual/wiki/Create-Notifier) entry.

## Planned and in dev.

Planned new features can be found in the issue tracker under either [`feature`](https://github.com/Johannestegner/node-continual/labels/feature) or [`enhancement`](https://github.com/Johannestegner/node-continual/labels/enhancement) tags.  

##### Request!
If there is any changes you wish to see, please add a request in the [issue tracker](https://github.com/Johannestegner/node-continual/issues), or even 
write it yourself and create a pull request!

---

## License
```
The MIT License (MIT)

Copyright (c) 2015 Johannes Tegnér

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
