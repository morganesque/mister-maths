/* This is the main code for the website */

var clickEvent; // to distinguish between mouse and touch.

var chshow = 1;     // used to keep track of showing character.
    
$(document).on('ready',function()
{   
    $('#game').hide();

    console.log('app.js ready!'); 
    clickEvent = (Modernizr.touch) ? 'touchstart' : 'click' ; // decide between mouse and touch.
    
    $('#again').on(clickEvent, function(e)
    {
        e.preventDefault();        
        game.incrementScore();
        game.startAgain();
    });
    
    $('.keyboard .key').on(clickEvent, function(e)
    {
        e.preventDefault();
        
        var num = $(this).text();
        var current_value = $('#answer').text();
        var len = current_value.length;
        
        if (num == '<')
        {
            len--;
            $('#answer').text(current_value.substr(0,len));
            
        } else if (len < 3) {        
            
            $('#answer').text(current_value + num);    
            len++;
        }
        
        if (len == 3 ) {        
            $('.keyboard').addClass('blocked');
        } else {
            $('.keyboard').removeClass('blocked');
        }
                
        if ($(this).attr('id') !== 'again') game.checkAnswer();        
    });
    
    var easeDuration = 1000;
    var easeFunc = 'easeOutBack';    
    $('.numbers a').dragdrop({      // enable drag.drop for the number controls.
         axis:'horizontal' 
        ,limitsLeft: [-190,0]         
        ,onEnd:function(s)
        {           
            if (!$(this).hasClass('chosen')) 
            {
                $(this).addClass('chosen').stop(true,false).animate({left:-150},{duration:easeDuration, easing:easeFunc});
            } else {
                $(this).removeClass('chosen').stop(true,false).animate({left:-190},{duration:easeDuration, easing:easeFunc});
            }            
            // $('.debug').text(tom.dump(s.direction, 'settings', 2));
        }        
    });
    
    $('.operations a').dragdrop({
         axis:'horizontal' 
        ,limitsLeft: [0,200]         
        ,onEnd:function(s)
        {           
            if (!$(this).hasClass('chosen')) 
            {
                $(this).addClass('chosen').stop(true,false).animate({left:140},{duration:easeDuration, easing:easeFunc});
            } else {
                $(this).removeClass('chosen').stop(true,false).animate({left:200},{duration:easeDuration, easing:easeFunc});
            }
            
            // $('.debug').text(tom.dump(s.direction, 'settings', 2));
        }        
    });
    
    $('#cog').on(clickEvent, function()
    {   
        $('#game').fadeOut(); 
        $('#save').fadeIn();
        $(this).fadeOut();
    });
    
    $('#save').hide().on(clickEvent, function()
    {
        $('#game').fadeIn(); 
        $('#cog').fadeIn(); 
        $(this).fadeOut();
        game.startAgain();
    });
    
    $('.question').css('opacity',0);
    $('.characters').css('opacity',0);
    
    var timer,seconds=0;

    $("#start-button").on(clickEvent, function(e)
    {
        e.preventDefault();

        $('.instructions').fadeOut();
        $('#game').fadeIn();
                
        $('.characters > div').css({opacity:0});
        $('.characters .char1').css({opacity:1, top:300}).addClass('showing');
        
        var tl = new TimelineMax();
        tl.to($('.welcome'), 0.5, {css:{opacity:0}});
        tl.to($('.question'), 0.5, {css:{opacity:1}},-0.2);
        tl.to($('.characters'), 0.5, {css:{opacity:1}},-0.2);        
        tl.to($('.char1'), 1, {css:{top:0}, ease:Quint.easeOut},-0.5);
        
        game.startAgain();

        clearTimeout(timer);
        timer = setInterval(function()
        {
            seconds++;
            var sec = ''+(seconds%60);
            if (sec.length == 1) sec = '0'+sec;
            var min = Math.floor(seconds/60);
            $('#time').html(min+':'+sec);

        },1000);
    });


});

$(window).on('load',function()
{
    $('#loading').fadeOut(1000);        
    $('.welcome').show();
}); 
