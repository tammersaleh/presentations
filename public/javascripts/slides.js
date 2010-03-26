$(function() { 
  var podium = new Podium(); 
  podium.initialize();
});

self.Key = function(keyCode) {
  var self = this;
  self.key = keyCode;

  self.is_next = function() {
    return(self.key == 32 || self.key == 39 || self.key == 40)
  };
  self.is_prev = function() { 
    return(self.key == 37 || self.key == 38)
  };
  self.want_thumbnails = function() { 
    return(self.key == 67)
  };
  self.want_sections = function() { 
    return(self.key == 83)
  };
  self.want_slides = function() { 
    return(self.key == 27)
  };
};

function Keyboard(callbacks) {
  var self = this;
  self.commands = callbacks;

  //  See e.g. http://www.quirksmode.org/js/events/keys.html for keycodes
  self.keyDown = function(event) {
    if (event.ctrlKey || event.altKey || event.metaKey)
       return true;

    var key = new Key(event.keyCode);

    console.log('key: ' + key)

    if (key.is_next()) {                self.commands.next();
    } else if (key.is_prev()) {         self.commands.prev();
    } else if (key.want_thumbnails()) { self.commands.thumbnails();
    } else if (key.want_sections()) {   self.commands.sections();
    } else if (key.want_slides()) {     self.commands.slides();
    } else {                            return true;
    }
    return false 
  };
}

function Podium() {
  var self = this;
  self.initialize = function() {
    self.sections   = new Sections(self);
    self.slides     = new Slides(self);
    self.thumbnails = new Thumbnails(self);
    self.notes      = new Notes(self);

    self.sections.initialize();
    self.thumbnails.initialize();
    self.notes.initialize();
    self.slides.initialize();
    document.onkeydown = new Keyboard(self.commands).keyDown;
  };

  self.commands = {
    next:       function () { self.slides.next() },
    prev:       function () { self.slides.prev() },
    thumbnails: function () { self.thumbnails.toggle() },
    sections:   function () { self.sections.toggle() },
    slides:     function () { self.slides.show() },
  };

  self.hideAll = function() {
    $('#thumbnails').hide();
    $('#sections').hide();
    $('#slides').hide();
  };
};

function Slides(podium_reference) {
  var self = this;
  self.podium = podium_reference;

  self.initialize = function() {
    self.focusFirst();
  };

  self.show = function() {
    self.podium.hideAll();
    $('#slides').show();
  };

  self.focusFirst = function() {
    var hash = window.location.hash;
    var number = 0;
    if (hash != "") { number = hash.split("_")[1]; }
    self.focus($("#slides .slide").eq(number));
  };

  self.focus = function($slide) {
    if ($slide.first().hasClass("slide")) {
      window.location.hash = self.hash($slide);

      $("#slides .slide").removeClass("current");

      $slide.addClass("current");

      self.podium.sections.setCurrent();
      self.podium.thumbnails.setCurrent();
      self.center();
    };
  };

  self.hash = function($slide) {
    return "#slide_" + $("#slides .slide").index($slide);
  };

  self.next = function() {
    if ($("#slides .current .inc:hidden").length > 0) {
      $("#slides .current .inc:hidden").first().show("fast");
    } else {
      self.focus($("#slides .current").next());
    }
  };

  self.prev = function() {
    self.focus($("#slides .current").prev());
  };

  self.center = function() {
    var slide_height = $("#slides .current").height();
    var top = (0.5 * parseFloat($("#slides").height())) - (0.5 * parseFloat(slide_height));
    $("#slides .current").css('padding-top', top);
    $("#slides .current").css('padding-bottom', top);
  };
};

function Thumbnails(podium_reference) {
  var self = this;
  self.podium = podium_reference;

  self.initialize = function() {
    $('<div id="thumbnails"></div>').html($("#slides").html()).appendTo("body");
    $('#thumbnails .slide').hover(function() { $(this).addClass("hover")   }, 
                                  function() { $(this).removeClass("hover")});
    $('#thumbnails .slide').click(function() { 
      self.toggle();
      self.podium.slides.focus($("#slides .slide").eq($("#thumbnails .slide").index($(this))));
    });
    self.toggle();
  };

  self.toggle = function() {
    if ($('#thumbnails').is(':visible')) {
      self.podium.slides.show();
    } else {
      self.podium.hideAll();
      $('#thumbnails').show();
    }
  };

  self.setCurrent = function() {
    $("#thumbnails .slide").removeClass("current");
    $thumb = $("#thumbnails .slide").eq($("#slides .slide").index($("#slides .slide.current")));
    $thumb.addClass("current");
  };
};

function Sections(podium_reference) {
  var self = this;
  self.podium = podium_reference;

  self.initialize = function() {
    $('<div id="sections"><h2>Sections:</h1><ol></ol></div>').appendTo("body");

    $("#slides .slide").each(function(){ 
      var id = $(this).attr("id");
      if (id) {
        var human = String(id).replace(/_/g, ' ');
        $('<li class="section" rel="' + id + '">' + human + '</li>').appendTo("#sections");
      }
    });

    $('#sections .section').hover(function() { $(this).addClass("hover")   }, 
                                  function() { $(this).removeClass("hover")});
    $('#sections .section').click(function() { 
      self.toggle();
      self.podium.slides.focus($("#slides .slide#" + $(this).attr('rel')));
    });

    self.toggle();
  };

  self.toggle = function() {
    if ($('#sections').is(':visible')) {
      self.podium.slides.show();
    } else {
      self.podium.hideAll();
      $('#sections').show();
    }
  };

  self.setCurrent = function() {
    $("#sections .section").removeClass("current");
    $slide = $("#slides .slide.current");
    if ($slide.attr("id")) {
      $section = $("#sections .section[rel='" + $slide.attr("id") + "']");
      $section.addClass("current");
    }
  };
};

function Notes(podium_reference) {
  var self = this;
  self.podium = podium_reference;

  self.initialize = function() {
    // var notes_window = window.open("http://google.com", "podium-notes");
  };
};
