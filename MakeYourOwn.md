# Make your own.

Making your own Jobs and Notifiers is very simple.  
We start off with a job!  

#### Jobs
Every job need to follow the `JobInterface`.  
And it looks like this:  

```javascript
module.exports {
    runJob: function(callback) {},
    getName: function() {},
    getVersion: function() {},
    getDescription: function() {}
};
```
Quite simple, eh?  
So, when implementing, what do you need to know?  

Lets start from the bottom.  
  
######`getDescription`
This function is supposed to return a string containing a simple description of the script.  
Its not currently used in the application, but it need to be implemented for API changes reasons.  
So please do!

######`getVersion`
The get version function needs to return the version of the job. I prefer a four digit string, seperated with dots, e.g., `"1.0.0.0"` for my scripts.
But this is not strictly enforced. As long as the `getVersion` function return a string!  
  
######`getName`
The get name function needs to return the name of the job. This is preferably the same or similar to the script file.  
But, as with `getVersion`, this is not very strict either. As long as `getName` returns a string.  
  
######`runJob`
This is the function that the job is done in.  
You can do whatever you want here, really. I don't mind!  
As long as you report it! By passing the following data into the callback function:  
  
`error` - If an error, this needs to be set with the error message, else it should be set to undefined.  
`message` - If no error, this should be the result message.  
`time` - The time it took to execute the job, in ms.  
  
So, your `runJob` function should look something like:

```javascript
MyScript.prototype.runJob = function runJob(callback) {
    var start = (new Date().getTime());
    // Crazy code that makes all kinds of nasty stuff!!!11
    callback(error, message,  (new Date().getTime()) - start);
}
```
And all will be fine!  
  
Thats it. Its not harder than that!  

#### Notifiers
Notifiers are not much harder to create than the jobs.  
As long as you follow the super simple `NotifierInterface`, which looks like this:  
  
```javascript
module.exports = {
    "getName": function() {},
    "getVersion": function() {},
    "sendError": function(string, callback) {},
    "sendSuccess": function(string, time, callback) {}
    "sendMessage": function(string, callback) {}
}
```

There are a few more functions to implement here, but they are not too bad...  
  
######`getName` & `getVersion`  
These two functions works exactly the same as the two for `jobs`.  
Returns strings, `getVersion` preferably in the following formate: `#.#.#.#` and the `getName` preferably similar to its filename.  
  
######`sendError`
This function will recieve a string and a callback as params.  
The string will contain a error message from a job.  
This is where the notifier kicks in, it will do its job to notifiy whatever service it is you have decided to let it talk to!  
Whenever its done, the callback have to be called. No params are needed.  

######`sendSuccess`
This function is more fun, cause it has nothing to do with errors, but rather with successfull runs!  
Whenever a job is successfully done, it will call this function on all notifiers.  
The `string` param is the message/output that the job produced, the `time` param is the time it took to execute the job (in ms).  
And the `callback` param is just a callback that has to be fired when the notifier is done.

######`sendMessage`
This function is not used by the application yet.  
Its intended to be used to pass any message that the jobs find interesting to pass to notifiers.  
The function need to exist to keep the script working whenever the API change is made to introduce the usage of this.  
But it don't really have to do anything.  


#### Examples
For a very basic Notifier example, check out the `ConsoleNotifier.js` script in the examples folder.  
For a very basic Job example, check out the `IllMulderYou.js` script in the examples folder.