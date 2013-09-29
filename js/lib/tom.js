var tom = ( function()
{    
    return { // start of return
        
        waitForFinalEvent : ( function() 
        {
            var timers = {};
            return function (callback, ms, uniqueId) 
            {
                // must always include a unique ID.
                if (!uniqueId) uniqueId = "Don't call this twice without a uniqueId";
                // always clear it before setting it.
                if (timers[uniqueId]) clearTimeout (timers[uniqueId]);
                // set a new timer to trigger your resize function.
                timers[uniqueId] = setTimeout(callback, ms);
            };
        })()
        
        // this is how you call the above.
        // $(window).resize(function () 
        // {
        //     tom.waitForFinalEvent(function()
        //     {
        //       alert('Resize...');
        //       //...
        //     }, 500, "some unique string");
        // });
        
        ,MAX_DUMP_DEPTH: 10
        
        ,dump: function(obj, name, depth, indent) 
        {            
            if (depth > this.MAX_DUMP_DEPTH) 
            {
                return indent + name + ": <Maximum Depth Reached>\n";
            }
            indent = indent || '  ';
            
            if (typeof obj == "object") 
            {
                 var child = null;
                 var output = indent + name + "\n";
                 indent += indent;
                 for (var item in obj)
                 {
                       try {
                              child = obj[item];
                       } catch (e) {
                              child = "<Unable to Evaluate>";
                       }
                       if (typeof child == "object") {
                              output += this.dump(child, item, depth + 1, indent);
                       } else if (this.isFunction(child)) {
                              output += indent + item + ": Function\n";
                       } else {
                              output += indent + item + ": " + child + "\n";
                       }
                 }
                 return output;
            } else {
                 return obj;
            }
        }
        
        ,isFunction: function(functionToCheck) 
        {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
        }
        
    }; // end of return.
}());