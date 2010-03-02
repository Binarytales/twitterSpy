// twitterlib test data
//twitterlib.debug({ search: 'js/twitterlib/test/test-data/search%page%.json?callback=callback' });

(function($){
  $.fn.twitterSpy = function(options) {

    var settings = $.extend({}, $.fn.twitterSpy.defaults, options);

    return this.each(function () {
      var $container = $(this),
          term = settings.term || $container.attr('data-twitterspy-term'),
          method = settings.method || $container.attr('data-twitterspy-term'),
          limit = settings.limit,
          lastID = 0,
          firstRun = true,
          interval = settings.interval;
      if(term === undefined){
        alert('You suck. Sorry.');
        return;
      }

      function getTweets() {
        twitterlib[method](term, {page : 1, since : lastID}, function (result) {
          var tweets = [], i = result.length;
          lastID = result.length ? result[0].id : lastID;
          while (i--){
            tweets.push(twitterlib.render(result[i]));
          }
          if (firstRun) {
            init(tweets, limit);
            firstRun = false;
          }
          if (tweets.length == 0) {
            setTimeout(getTweets, interval);
          }else{
            theLoop(tweets);
          }
        });
      }
      
      function init(tweets, length){
        for (var i = 0; i < length; i++) {
          $container.prepend(tweets.shift());
        }
      }
      
      function theLoop(tweets) {
        var loop = setInterval(function () {
          $nextTweet = $(tweets.shift()).hide().prependTo($container);
          $nextTweet.slideDown(1000);

          $container.children(':last').slideUp(1000, function () {
            $(this).remove();
          });
  
          if (tweets.length == 0) {
            clearInterval(loop);
            getTweets();
          }
        }, interval);
      }
      getTweets();
    });
  };
  
  $.fn.twitterSpy.defaults = {
    limit : 5,
    interval : 5000,
    method : 'search'
  };

})(jQuery);

$(document).ready(function() {

  $('#tweets').twitterSpy();

});