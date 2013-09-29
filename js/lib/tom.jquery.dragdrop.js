/*! My drag and drop plugin what I did wrote! */
(function( $ ){

    $.fn.dragdrop = function( options ) 
    {  
        var settings = $.extend({
             axis  : 'both'
            ,onStart    : function(){}
            ,onEnd      : function(){}
            ,limitsLeft : []
            ,limitsTop  : []
            ,debug      : false
        }, options);       
      
        var methods = {
            touchstart: function(e)
            {                        
                var el = $(this);
                el.stop(true,false);
                var touch = e.originalEvent.targetTouches[0];            
                                
                // var rootP = $(el).offset(); // doesn’t seem to be used                
                
                // grab the starting position of the element.
        		var cp = el.position();
        		settings.ElStartX = cp.left;
        		settings.ElStartY = cp.top;		
        		settings.TouchStartX = touch.pageX;
                settings.TouchStartY = touch.pageY;
                // settings.z = parseInt(el.css('z-index'),10);
        		settings.z = el.css('z-index');

        		// callback function.
        		settings.onStart.call(this,settings);        		
            }
            
            ,touchmove: function(e)
            {                
        		e.preventDefault();
        		e.stopPropagation();
        		
        		var el = $(this);
        		var touch = e.originalEvent.targetTouches[0];
        		if(touch == null){return;}
        		
        		// grab current touch position.
        		var CurrentTouchX = touch.pageX;
        		var CurrentTouchY = touch.pageY;

                // work out distance from first touch.
        		var DistanceX = CurrentTouchX - settings.TouchStartX;
        		var DistanceY = CurrentTouchY - settings.TouchStartY;

                // Calculate new position for element.
                var newX,newY;
        		if (settings.axis == 'both' || settings.axis == 'horizontal') 
        		{
        		    newX = settings.ElStartX + DistanceX;        		            		    
        		    // if horizontal limits have been set apply them.
        		    if (settings.limitsLeft.length)
        		    {
            		    if (newX < settings.limitsLeft[0]) newX = settings.limitsLeft[0];
            		    if (newX > settings.limitsLeft[1]) newX = settings.limitsLeft[1];        		        
        		    }
        		    // apply new position.
        		    el.css({left:newX+ 'px'});
    		    }
        		if (settings.axis == 'both' || settings.axis == 'vertical') 
        		{
        		    newY  = settings.ElStartY + DistanceY;
        		    // if horizontal limits have been set apply them.
        		    if (settings.limitsTop.length)
        		    {
            		    if (newY < settings.limitsTop[0]) newY = settings.limitsTop[0];
            		    if (newY > settings.limitsTop[1]) newY = settings.limitsTop[1];        		        
        		    }
        		    // apply new position.
        		    el.css({top:newy+ 'px'});
    		    }

                // $('.debug').text('newX: '+newX+' newY: '+newY );

                // apply new position to element.
                

                // if (p.axis == 'vertical')
                // $('.debug').text('rs:'+rs.top+' ry:'+p.ry+' ty:'+p.ty+' DistanceY:'+DistanceY+' CurrentTouchY:'+CurrentTouchY);
                // else
                // $('.debug').text('rs:'+rs.left+' rx:'+p.rx+' tx:'+p.tx+' DistanceX:'+DistanceX+' CurrentTouchX:'+CurrentTouchX);

        		//scroll window
                // if(p.scroll)
                // {
                //  s = this.getScroll(CurrentTouchX, CurrentTouchY);
                //  if((s[0] != 0) || (s[1] != 0))
                //  {
                //      window.scrollTo(window.scrollX + s[0], window.scrollY + s[1]);
                //  }
                // }

        		//check droppables
        		// TM - don't think I need this as I don't care whether it's dropped onto another region.
                // webkit_drop.check(CurrentTouchX, CurrentTouchY, r);

        		//save position for touchEnd
        		settings.LastTouchX = CurrentTouchX;
        		settings.LastTouchY = CurrentTouchY;
            }
            ,touchend: function(e)
            {
                var el = e.data.el;
                
                // TM - again don't really care whether it was dropped.
                // var dropped = webkit_drop.finalize(settings.lastCurrentTouchX, settings.lastCurrentTouchY, r, event);

                // TM - don't need this as I don't use "revert" at the moment.
                // if(((settings.revert) && (!dropped)) || (settings.revert === 'always'))
                // {
                //  //revert root
                //  var rs = r.style;
                //  if (p.axis == 'both' || p.axis == 'vertical') rs.top = (p.ry + 'px');
                //  if (p.axis == 'both' || p.axis == 'horizontal') rs.left = (p.rx + 'px');
                // }

                el.css({'z-index':settings.z});
                
                // grab the last position of the element to pass back.
                var cp = el.position();
                settings.ElLastX = cp.left;
        		settings.ElLastY = cp.top;
        		
        		settings.direction = ['none','none'];
                
                // note whether it's moved left or right.
                if (settings.ElLastX > settings.ElStartX) settings.direction[0] = 'right';
                else if (settings.ElLastX < settings.ElStartX) settings.direction[0] = 'left';
                
                // note whether it's moved up or down.
                if (settings.ElLastY > settings.ElStartY) settings.direction[1] = 'down';
                else if (settings.ElLastY < settings.ElStartY) settings.direction[1] = 'up';             
                
                // end callback function (pass all settings in case they're of use).
        		settings.onEnd.call(this,settings);
            }
        };
      
        return this.each(function() 
        {                        
            // make sure if the element it's positioned absolute then it's positioned relative.
            var pos = $(this).css('position');
            if (pos !== 'absolute') $(this).css({position:'relative'});
            
            // assign all the event listeners.
            $(this).on('touchstart', {el:$(this)}, methods.touchstart);
            // $(this).on('touchstart', {el:$(this)}, function()
            // {   
            //     $(this).hide();
            // });
            $(this).on('touchmove', {el:$(this)}, methods.touchmove);
            $(this).on('touchend', {el:$(this)}, methods.touchend);
        });        
    };
    
})( jQuery );
