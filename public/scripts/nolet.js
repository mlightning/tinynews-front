jQuery(document).ready(function() {
  $('.follow').click(function() {
    //$( this ).toggleClass( "btn-success btn-default following");
    //if($( this ).hasClass('following')) {
    if ($( this ).text() == 'following') {
      $( this ).text('follow').removeClass('following').removeClass('btn-success').addClass('btn-default');
    } else {
      $( this ).text('following').addClass('following').removeClass('btn-default').addClass('btn-success');
    }
  });

  $('i.tags').click(function() {
    $(this).toggleClass('fa-square-o fa-check-square-o');
  });

  $('.tag').click(function() {
    var msg = '';
    msg += '<h5>Tag: ' + $( this ).text() + '</h5>'; 
    msg += '<div style="width: 200px;">';
    msg += '<p>Articles <span class="badge badge-success" style="float: right;">1,000</span></p>';
    msg += '<p>Rating <span class="badge badge-success" style="float: right;">3</span></p>';
    msg += '<p>Comments <span class="badge badge-success" style="float: right;">435</span></p>';
    msg += '</div>';
    msg += '<p>View topic: <a href="' + $( this ).attr('name') + '">' + $( this ).text() + '</a></p>';
    msg += '<p><small>(This is a prototype for a tag popup for when users click in error. A control panel with stats and functions.)</small>';
    bootbox.alert( msg );    
  });


  $('.related-topics a').click(function() {
    
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "positionClass": "toast-top-right",
      "onclick": null,
      "showDuration": "1000",
      "hideDuration": "1000",
      "timeOut": "3000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
    //bootbox.alert('test');
    //alert('toastr');
    toastr.info( $( this ).attr('name'), 'Link to:');
    $.notific8( $( this ).attr('name'), {heading: 'This should link to:', horizontalEdge: 'bottom', verticalEdge: 'left', life: 1000});
  });

  /*
  $('.page-sidebar').append( "<div class='well well-sm'><h5>Page size</h5>page-sidebar: " + $('.page-sidebar').width()
  + "<br/>page-content: " + $('.page-content').width()
  + "<br/>page-container: " + $('.page-container').width()
  + "<br/>col-md-12: " + $('.col-md-12').width()
  + "<br/>col-md-9: " + $('.col-md-9').width()
  + "<br/>col-md-3: " + $('.col-md-3').width()
  + "<br/>col-sm-12: " + $('.col-sm-12').width()
  + "<br/>col-sm-9: " + $('.col-sm-9').width()
  + "<br/>col-sm-3: " + $('.col-sm-3').width() + "</div>");
  */
  
});
