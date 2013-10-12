$(document).on('ready',function()
{
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
});

