/* This is the main code for the website */

var clickEvent; // to distinguish between mouse and touch.

var chshow = 1;     // used to keep track of showing character.
    
var game = ( function()
{
    var timer;      // used to change the character.
    var number = 0;
    var divisor = 0;
    var answer = 0;
    var tables = [];
    var operations = [];
    var formats = {
        'add': [
             "What is %n% plus %d%?"
            ,"What is %n% add %d%?"
            ,"What is %n% + %d%?"
        ],
        'sub': [
             "What is %n% take away %d%?"
            ,"What is %n% minus %d%?"
            ,"What is %n% subtract %d%?"
            ,"What is %n% - %d%?"
        ],
        'mul': [
             "What is %n% times %d%?"
            ,"What is the product of %n% and %d%?"
            ,"What is %n% &#215; %d%?"
        ],
        'div': [
             "What is %n% divided by %d%?"
            ,"What is %n% shared between %d%?"
            ,"What is %n% &#247; %d%?"
        ]
    };
    
    return { // start of return

        score: 0,
     
        startAgain: function()
        {            
            $('.again').css({visibility:'hidden'});
            
            this.grabSettings();
            
            var table = tables[Math.floor(Math.random()*tables.length)];
            var operation = operations[Math.floor(Math.random()*operations.length)];
            
            switch(operation)
            {
                case "add":
                    number = Math.floor(Math.random()*100);
                    divisor = Math.floor(Math.random()*100);
                    answer = number + divisor;
                    break;
                    
                case "sub":
                    number = Math.floor(Math.random()*100);
                    divisor = Math.floor(Math.random()*number-1);
                    answer = number - divisor;
                    break;
                    
                case "mul":
                    number = 1 + Math.floor(Math.random()*12);
                    divisor = table;
                    answer = number * divisor;
                    break;           
                    
                case "div":
                    number = 1 + table * Math.floor(Math.random()*12);
                    divisor = table;
                    answer = number / divisor;
                    break;                             
            }
            
            // number = 2 * Math.ceil((Math.random() * 50));
            // divisor = 2;                        
            // answer = number/divisor;

            var format = formats[operation][Math.floor(Math.random()*formats[operation].length)];
            format = format.replace('%n%', number);
            format = format.replace('%d%', divisor);
            $('#question').html(format);                        
            $('#answer').text('');
            
            this.startCharacters();
            this.showChar(1);
        }
        
        ,startCharacters: function()
        {
            console.log('starting timer');
            clearInterval(timer);
            timer = setInterval(function()
            {
                var num = bads[Math.floor(Math.random()*bads.length)];
                game.showChar(num);
            
            },3000);            
        }
    
        ,checkAnswer: function()
        {
            var num;
            var val = parseInt($('#answer').text(),10);
            if (val == answer)
            {
                $('#feedback').fadeIn().html('Well done!').addClass('grn').removeClass('red');
                $('.again').css({visibility:'visible'});
                num = goods[Math.floor(Math.random()*goods.length)];
                this.showChar(num);
                clearInterval(timer);
                console.log('stopping timer');
            } else {
                $('#feedback').fadeIn().html('Not quite! Keep trying').addClass('red').removeClass('grn');
                $('.again').css({visibility:'hidden'});

                console.log(timer);
                num = bads[Math.floor(Math.random()*bads.length)];
                game.showChar(num);
                this.startCharacters();
            }
        }
        ,showChar: function(num)
        {
            if (num != chshow)
            {
                var cut = $('.characters .showing');
                var cin = $('.char'+num);
                
                var tl = new TimelineMax();
                tl.to(cin, 0.5, {css:{opacity:1}});
                tl.to(cut, 0.5, {css:{opacity:0}},-0.4);
                
                cut.removeClass('showing');
                cin.addClass('showing');

                chshow = num;            
            }   
        }
        ,grabSettings: function()
        {            
            if (tables.length) tables.length = 0;
            $('#settings .numbers a.chosen').each(function()
            {
                var n = $(this).text();
                tables.push(n);
            });            
            
            if (operations.length) operations.length = 0;
            $('#settings .operations a.chosen').each(function()
            {
                var n = $(this).data('operation');
                operations.push(n);
            });            
        }
        
    }; // end of return.
}());        

$(document).on('ready',function()
{    
    clickEvent = (Modernizr.touch) ? 'touchstart' : 'click' ; // decide between mouse and touch.
    
    $('#again').on(clickEvent, function(e)
    {
        e.preventDefault();        
        $('#feedback').fadeOut();
        game.startAgain();
        game.score++;
        $("#score").html(game.score);
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
    });
    
    $('#save').hide().on(clickEvent, function()
    {
        $('#game').fadeIn(); 
        $('#save').fadeOut();
        game.startAgain();
    });
    
    // sorting out the orientation error message.
        var OrientationError = function()
        {
            if(window.orientation == 90 || window.orientation == -90)
            {
                $('#orient').fadeIn(500);
                $('#orient .center-message span').text('Please turn your iPad around to continue.');            
            } else {
                $('#orient').fadeOut(1000);
                $('#orient .center-message span').text('Thank you.');

            }
        };
        $(window).on('orientationchange',function(e){OrientationError();});
        OrientationError();
    
    $('.question').css('opacity',0);
    $('.characters').css('opacity',0);
    
    $("#start-button").on(clickEvent, function(e)
    {
        e.preventDefault();
                
        $('.characters > div').css({opacity:0});
        $('.characters .char1').css({opacity:1, top:300}).addClass('showing');
        
        var tl = new TimelineMax();
        tl.to($('.welcome'), 0.5, {css:{opacity:0}});
        tl.to($('.question'), 0.5, {css:{opacity:1}},-0.2);
        tl.to($('.characters'), 0.5, {css:{opacity:1}},-0.2);        
        tl.to($('.char1'), 1, {css:{top:0}, ease:Quint.easeOut},-0.5);
        
        game.startAgain();
    });
});

var bads = [2,4,5,6,10,12,13,14,15,16,17,18,19,20]; // 8 & 11 not included.
var goods = [9,7,3];

$(window).on('load',function()
{
    setTimeout(function()
    {
        $('#loading').fadeOut(1000);        
        $('.welcome').show();
    },500);
}); 
