# Continual
###  Run tasks on interval.
  
  
## Installation  
Continual is supposed to be installed globally.  
```
npm install -g continual
```
  
  
## Usage
Continual needs to be initialized in the directory where its supposed to run.  
You could of course run jobs from anywhere, and let them do whatever they want, its not jailed in the folder where its initialized.  
Initialization is easy, just point your terminal to the directory where you want it to run and type:

```
continual -init
```

This will initialize continual in the folder.  
When continual initializes, it creates a `.continual` folder, with a few sub folders and a `config.json` file.  
If you are not working alone, and your co-workers are not using continual, you might want to put that folder in the ignore file!  
  
When continual is initialized, it will allow you to start by typing:

```
continual
```

##### Installation of Tasks.
Installing a task is done by editing the `config.json` file.  
A newly initialized config file should look something like the following:  

```json
{
    "notifiers": [],
    "tasks": []
}
```

In this file, no tasks nor notifiers are added by default.  
A task is a JavaScript file which implements a given interface.  
For a detailed description on how to create a tasks, check out the following [Wiki](https://github.com/Johannestegner/node-continual/wiki/Create-Tasks) entry.  

When you got a task, it should be placed in the `.continual/tasks` folder (this is optional, a task can be placed anywhere, but its easier to have it in the installation, especially if adding it to source-control etc).  
After the file has been placed in the tasks folder, the config have to be edited.  
  
In the `tasks` property in the config file, each task is added.  

A task requires a `path`, a set of `notifiers` and a `interval` object.  
  
The `path` is the path to the task script, relative to the .continual folder.  
The interval is a object which specifies how often or at which occurrences the task should be ran.  
  
There is two type of intervals/occurrences; `at` and `in`. The `at` occurrence defines a timestamp on which the task should be ran, and the `in` simply means "in how long".  
See [in](#in), [at](#at) and [once](#once) for description on how the different interval types works.  
  
The notifiers is an array with numbers, the numbers references a notifier ID (which is further explained in the [notifiers](#installation-of-notifiers) part of the readme.  
  
When a task is added, the config should look something like:  

```json
{
    "notifiers": [],
    "tasks": [
      {
        "path": "path/to/task.js",
        "notifiers": [],
        "interval": {
          "at": [
            "*:*:*"
          ]
        }
      }
    ]
}
```
  
###### In
The `in` type has two properties: `unit` and `value`.  
Available units are the following:  
  
* `d` : Days - (24h)
* `h` : Hours
* `m` : Minutes
* `s` : Seconds
* `ms` : Milliseconds

And the `value` specifies how many of a given unit.  
Example:

```
"interval": {
  "unit": "s",
  "value": 10
}
// every 10 seconds.
```

###### at  
The `at` type has a single property... `at`, which is an array of strings.  
Each string specifies a time at which the job should be fired in a `h:m:s` format where the hour entry is in 24h format.  
Its possible to use the `*` character instead of a hour, minute or second.  

Observe: if a job takes a long time to run, it might skip entries, so if its vital to be ran at a given point, create more than one task for it.

Example:

```
"interval": {
  "at": [
    "10:25:1",
    "*:*:20"
  ]
}
// every day at 10:25:1, AND every 20th second of every minute.
```

###### once
If a task is only supposed to be ran once, the `once` property can be added to the interval object.  
The `once` property need to be set to `true` if its supposed to run once, else it will default to false and keep on ticking.   


##### Chaining Tasks
An important part of continual is the ability to chain tasks.  
This means that when a given task is done, another can be invoked by continual automatically.  
This is done by adding the `then` property to a given task; `then` is an array which in turn contains tasks, as many as wanted.  
When the parent task is finished, it will invoke all its subtasks async, so all the tasks will run as soon as they can.  
Each subtask can in turn have its own subtasks, and so on.  
  
Observe: the parent task will not reset until all subtasks are done.

Example:  

```json
"tasks": [
  { 
    "path": "tasks/task.js",
    "interval": {
        "value": 5,
        "unit": "m"
    },
    "then": [
      {
        "path": "tasks/subtask.js",
        "interval": {
          "value": 3,
          "unit": "s"
        }
      }
    ]
  }
]
// In this case, the 'task.js' task will be fired after 5 minutes. When its done, 3 seconds will pass, then the subtask will fire.
```


##### Installation of Notifiers.
Notifiers is a small JavaScript that will get called on whenever a task is done or failed.  
For a detailed description on how to create a notifier, check out the following [Wiki](https://github.com/Johannestegner/node-continual/wiki/Create-Notifier) entry.  
  
To add a new notifier, start by putting the notifier script in the `.continual/notifiers` folder (just as with tasks, this is not forced).  
Each notifier entry has two properties, `id` and `path`.  
The `path` is the path to the script, and the `id` is a unique number which is later referenced in the tasks.  
  
When a notifier have been added, the config should look something like:  
  
```json
{
    "notifiers": [
      {
        "id": 0,
        "path": "path/to/notifier.js"
      }
    ],
    "tasks": [
      {
        "path": "path/to/task.js",
        "notifiers": [],
        "interval": {
          "at": [
            "*:*:*"
          ]
        }
      }
    ]
}
```

For a task to use the notifier, add the notifier id to the `notifiers` property in the task object.

----

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
