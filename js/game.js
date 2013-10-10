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
    var bads = [2,4,5,6,10,12,13,14,15,16,17,18,19,20]; // 8 & 11 not included.
    var goods = [9,7,3];
    var startTime,endTime,timeScore;
    
    return { // start of return

        score: 0,
        number: 0,
     
        startAgain: function()
        {      
            $('#feedback').fadeOut();      
            $('.again').css({visibility:'hidden'});
            startTime = new Date();
            
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
                    number = table * (1 + Math.floor(Math.random()*12));
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
                endTime = new Date();
                timeScore = Math.max(0 , 5 - Math.floor((endTime - startTime)/1000));
                console.log((endTime - startTime));
                console.log((endTime - startTime)/1000);
                console.log(Math.floor((endTime - startTime)/1000));
                console.log(timeScore);
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
        ,incrementScore: function()
        {
            this.number++;
            this.score+=timeScore;
            $("#score").html(this.score+' / '+this.number);
        }
        
    }; // end of return.
}());        