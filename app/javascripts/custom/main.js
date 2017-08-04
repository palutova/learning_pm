$(function() {
    testFctn('ololoo lololo main');

    if ($('.b-cbox').length > 0) {
        $('.b-cbox').colorbox({
            rel: 'b-cbox',
            transition: "fade",
            maxWidth: "75%",
            maxHeight: "75%"
        });
    }

});

testFctn = function(msg) {
    console.log("show message:"+msg);
};