  // ******************************************************************************
  // @licstart
  // The following is the entire license notice for the JavaScript code in this page.
  //
  //  Poemario.js
  //  Copyright (C) 2014  Nuno Ferreira - self@nunof.eu
  //
  //  The JavaScript code in this page is free software: you can
  //  redistribute it and/or modify it under the terms of the GNU
  //  General Public License (GNU GPL) as published by the Free Software
  //  Foundation, either version 3 of the License, or (at your option)
  //  any later version.  The code is distributed WITHOUT ANY WARRANTY;
  //  without even the implied warranty of MERCHANTABILITY or FITNESS
  //  FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
  //
  //  As additional permission under GNU GPL version 3 section 7, you
  //  may distribute non-source (e.g., minimized or compacted) forms of
  //  that code without the copy of the GNU GPL normally required by
  //  section 4, provided you include this license notice and a URL
  //  through which recipients can access the Corresponding Source.
  //
  // @licend
  // The above is the entire license notice for the JavaScript code in this page.
  //
  // ******************************************************************************
  //
  //
  if (typeof jQuery === "undefined") {
    //making sure that jquery is available
    var script = document.createElement('script');
    script.src = 'http://code.jquery.com/jquery-latest.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
}

  //Public consts
  const POEM_STATIC = 1;
  const POEM_TYPED = 2;
  const FLOW_STATIC_ONE = 1;
  const FLOW_GROWING = 2;
  const FLOW_STATIC_ALL = 3;
  const TYPE_CONSTELLATION = 0;
  const TYPE_LINE = 1;
  const TYPE_CHAR = 2;

/*

********** How to use ***********

Poemario constructor parameters:

  * first_mode (default=1):
    1  => static poem
    !1 => typed poem

  * flow_mode (default=2):
    1 => static length poem, each time replacing one word in one vers
    2 => growing length_poem
  3 => static length poem, each time replacing all words in one vers
  # TODO: static length poem, each time replacing all words in all verses

  * type_mode (default=2):
  0  => text as graphics on 2d canvas
    1  => line at a time
    >1 => char at a time

  * poem_speed (default=100):
    frequency in milisenconds for generating new verses

  * type_speed (default=100):
    type writer speed in milisenconds

  * list_poems (default=["poem1.xml"]):
    array with list of poems in the form of file names that should be used

  * top_pixels (default=0):
    how many pixels should be left untouched in the top side of the window

  * has_audio (default=false):
    boolean to determine if audio can be played or not

  * sounds_origin (default=(empty)):
    if string, then use dir with index files; if supressed, then it uses XML; only matters is has_audio is true.

  * font_config (default = {family: 'arial, sans-serif', pixels: 16, style\: 'normal', alpha: 1})
  javascript object that defines font following font properties
    - family => <font name, generic family name> (font name is intended font, family name is there to let browser choose similar based on family)
      fonts are names such as times, courier, arial, etc
      family names are one of serif, sans-serif, cursive, fantasy or monospace
    - pixels => <number> (size of font)
      can be an integer or a range of integers (such as 12-24) to be randomly used
    - style => <string> (of font)
      can be normal, italic or bold
    - alpha => <number> (transparency level)
      a fractional number between 0.1 and 1
    - color => <string> (font color)
      same syntax as CSS

********** Poemario.js ***********

*/

//Poemario class javascript style
function Poemario(first_mode, flow_mode, type_mode, poem_speed, type_speed, list_poems, top_pixels, has_audio, sounds_origin, font_config) {


    // Private vars
    //constants to describe internal state
    const RUNNING = 1;
    const GRACEFUL = 2;
    const STATEFUL = 3;

    var DEBUG = false;
    var w_height = 0;
    var w_width = 0;
    var timers = new Array();
    var saved_state = new Array();
    var txt_running = undefined;
    var snd_running = undefined;
    var audio1 = undefined;
    var audio2 = undefined;
    var audio_func1 = undefined;
    var audio_func2 = undefined;
    var audio_tmr1 = undefined;
    var audio_tmr2 = undefined;
    var audio_fade_tmr = undefined;
    var snd_arr_a = undefined;
    var snd_arr_b = undefined;
    var snd_freq = 2000;
    var min_cfont = 0;
    var max_cfont = 0;
    var live = new Array();

    //Internal global vars serving as private storage for properties
    var _firstp, _flow_mode, _type_mode, _poem_speed, _type_speed, _num_poems, _list_poems, _top_pixels, _has_audio, _sounds_origin, _font_config;
    typeof first_mode === 'undefined' ? _first_mode = 1 : _first_mode = first_mode;
    typeof flow_mode === 'undefined' ? _flow_mode = 2 : _flow_mode = flow_mode;
    typeof type_mode === 'undefined' ? _type_mode = 2 : _type_mode = type_mode;
    typeof poem_speed === 'undefined' ? _poem_speed = 100 : _poem_speed = poem_speed;
    typeof type_speed === 'undefined' ? _type_speed = 100 : _type_speed = type_speed;
    typeof list_poems === 'undefined' ? _list_poems = ['poem1.xml'] : _list_poems = list_poems;
    typeof top_pixels === 'undefined' ? _top_pixels = 0 : _top_pixels = top_pixels;
    typeof has_audio === 'undefined' ? _has_audio = false : _has_audio = has_audio;
    _sounds_origin = sounds_origin;

    if (typeof font_config === 'undefined')
      _font_config = {family: 'arial, sans-serif', pixels: 16, style: 'normal', alpha: 1};
    else  _font_config = validate_font_config(font_config);

    _num_poems = _list_poems.length;

    //Public properties

    Object.defineProperty(Poemario.prototype, "flow_mode", {
        configurable: true,
        get: function() {
            return _flow_mode;
        },
        set: function(newval) {
            _flow_mode = newval;
        }
    });

    Object.defineProperty(Poemario.prototype, "type_mode", {
        configurable: true,
        get: function() {
            return _type_mode;
        },
        set: function(newval) {
            _type_mode = newval;
        }
    });

    Object.defineProperty(Poemario.prototype, "poem_speed", {
        configurable: true,
        get: function() {
            return _poem_speed;
        },
        set: function(newval) {
            _poem_speed = newval;
        }
    });

    Object.defineProperty(Poemario.prototype, "type_speed", {
        configurable: true,
        get: function() {
            return _type_speed;
        },
        set: function(newval) {
            _type_speed = newval;
        }
    });

    Object.defineProperty(Poemario.prototype, "top_pixels", {
        configurable: true,
        get: function() {
            return _top_pixels;
        },
        set: function(newval) {
            _top_pixels = newval;
        }
    });

    Object.defineProperty(Poemario.prototype, "font_config", {
        configurable: true,
        get: function() {
            return _font_config;
        },
        set: function(newval) {
            _font_config = newval;
        }
    });

    //Public method for stoping everything
    Poemario.prototype.all_stop = function() {
        if (txt_running !== undefined) {
            stop_timers();
            $(".container p").remove();
        }
        if (_has_audio) {
            if (snd_running !== undefined) {
                if (DEBUG) console.log("AUDIO ALL: stopping...");
                audio1.removeEventListener('ended', audio_func1, false);
                audio2.removeEventListener('ended', audio_func2, false);
                if (audio_tmr1 !== undefined) clearTimeout(audio_tmr1);
                if (audio_tmr2 !== undefined) clearTimeout(audio_tmr2);
                audio1.pause();
                audio2.pause();
                delete audio1;
                delete audio2;
                snd_running = undefined;
                if (DEBUG) console.log("... now");
            }
        }
    };

    //Public method for starting things
    Poemario.prototype.txt_start = function() {

        if (txt_running === undefined) {
            txt_running = RUNNING;
          //  $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', 'css/Poemario.css'));
            $("#body").append("<div id=\"free-top\"></div>");
            
            //index 0 will always be empty because we're using pnum as an index - it starts with 1
            live.push(new Array());
            for (i = 1; i <= _num_poems; i++) {
                $("#body").append("<div class=\"container\" id=\"container" + String(i) + "\" style=\"overflow-y: scroll;\"></div>");
                if (_type_mode == 0)
                    $("#container" + String(i)).append("<canvas class=\"canvas\" id=\"canvas" + String(i) + "\" style=\"display: block;\"></canvas>");
                timers.push(0);
                timers.push(0);
                window["block_counter" + i] = 0;                
                if (DEBUG) console.log("type_mode => " + String(_type_mode));
                live.push(new Array());
                go_poem(i, new Array(), timers.length - 2, timers.length - 1, true);                
            }
        }
    };

    //Public method for stopping poem generation.
    //Does nothing if not running. Only flags Poemario to stop, but effectively it only stops when it reaches end of current poem
    Poemario.prototype.txt_stop_graceful = function() {
        if (txt_running !== undefined)
            if (txt_running == RUNNING) txt_running = GRACEFUL;
    };

    //Public method for stopping poem generation.
    //Does nothing if not running. But flags Poemario to stop immediately and save state on the next timeout function
    Poemario.prototype.txt_stop_stateful = function() {
        if (txt_running !== undefined)
            if (txt_running == RUNNING) txt_running = STATEFUL;
    };

    //Public method for resuming poem generation. It knows if it's being called after STATEFUL or GRACEFUL stop
    //Does nothing unless Poemario is initialized and stopped
    Poemario.prototype.txt_resume = function() {

        if (txt_running !== undefined) {
            if (txt_running == GRACEFUL) {
                txt_running = RUNNING;
                for (i = 1; i <= _num_poems; i++) go_poem(i, new Array(), i * 2 - 2, i * 2 - 1, false);
            }
            if (txt_running == STATEFUL) {
                txt_running = RUNNING;
                resume_stateful();
            }
        }
    };

    //Public method for resetting poem
    //Does nothing unless Poemario is initialized
    Poemario.prototype.txt_reset = function() {

        if (txt_running !== undefined) {
            stop_timers();
            $("p").remove();
            txt_running = RUNNING;
            for (i = 1; i <= _num_poems; i++) go_poem(i, new Array(), i * 2 - 2, i * 2 - 1, true);
        }
    };

    //Public method to start playing two audio streams.
    Poemario.prototype.audio_start = function(frequency) {

        if (_has_audio) {
            if (snd_running !== undefined) {
                if (snd_running != RUNNING) {
                    snd_freq = frequency;
                    go_audio();
                    snd_running = RUNNING;
                }
            }
        }
    };

    //Public method to stop plying the two audio streams
    Poemario.prototype.audio_stop = function(stop_now) {

        if (_has_audio) {
            if (typeof stop_now === 'undefined') stop_now = true;
            if (snd_running !== undefined) {
                if (DEBUG) console.log("AUDIO ALL: stopping...");
                if (snd_running == RUNNING) {
                    if (stop_now) {
                        if (DEBUG) console.log("... now");
                        audio1.pause();
                        audio2.pause();
                        snd_running = STATEFUL;
                    } else {
                        if (DEBUG) console.log("... later");
                        audio1.removeEventListener('ended', audio_func1, false);
                        audio2.removeEventListener('ended', audio_func2, false);
                        snd_running = GRACEFUL;
                    }
                }
            }
        }
    };

    //Public method to start fading out audio streams
    Poemario.prototype.audio_fade_out = function(steps, callback) {

        if (_has_audio) {
            if (typeof steps === 'undefined') steps = 200;
            if (snd_running !== undefined) {
                if (DEBUG) console.log("AUDIO ALL: fading out...");
                if (snd_running == RUNNING) {
                  audio_fade_tmr = setInterval( function() {
                    var tmp_volume = audio1.volume;
                    if (tmp_volume > 0) {
                      tmp_volume -= .1;
                      audio1.volume = Math.floor(tmp_volume * 10) / 10;
                      audio2.volume = audio1.volume;
                    }
                    else {
                      clearInterval(audio_fade_tmr);
                      if ($.isFunction(callback)) callback();
                    }
                  }, steps);
                }
            }
        }
    };


    //Public method to resume audio streams
    Poemario.prototype.audio_resume = function() {

        if (_has_audio) {
            if (snd_running !== undefined) {
                if (snd_running != RUNNING) {
                    if (DEBUG) console.log("AUDIO ALL: resuming");
                    if (snd_running == STATEFUL) {
                        audio1.play();
                        audio2.play();
                    } else {
                        audio1.addEventListener("ended", audio_func1 = function() {
                            audio_again(1);
                        }, false);
                        audio2.addEventListener("ended", audio_func2 = function() {
                            audio_again(2);
                        }, false);
                        audio_again(1);
                        audio_again(2);
                    }
                    snd_running = RUNNING;
                }
            }
        }

    };

       // Public method to post to local WP - the instantaneous poem with the associated image
    Poemario.prototype.image_wp = function(pnum) {
        if (_flow_mode == 3) {
          if (typeof pnum === 'undefined') pnum = 1;

          var ptxt = "";
          for (var i = 0; i < live[pnum].length; i++) {
              ptxt += live[pnum][i][1] + "\n";
          }

          var wp_req = new XMLHttpRequest();
          wp_req.open("POST", "/cgi-bin/wp_image.pl", true);

          wp_req.onload = function (obj_event) {
            //console.log("inside 2");
            // uploaded.
          };

          var obj_canvas = document.getElementById('canvas' + pnum);

          var ctx_canvas = document.getElementById('canvas' + pnum).getContext('2d');
          ctx_canvas.globalCompositeOperation = "destination-over";

          var img = new Image();
          img.onload = function() {

            //console.log("inside 1");
            ctx_canvas.drawImage(img, 0, 0);
            wp_req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            //var fd = new FormData();
            //fd.append("txt", encodeURIComponent(ptxt));
            //fd.append("img", obj_canvas.toDataURL("image/png"));
            //wp_req.send(fd);
            wp_req.send('txt=' + encodeURIComponent(ptxt) + '&img=' + encodeURIComponent(obj_canvas.toDataURL("image/png")));
          };

             //TODO - get the the image through the style attribute instead of directly from the filesystem
          //console.log(document.getElementById('canvas' + pnum).style.background);
          //tmp_style = window.getComputedStyle(obj_canvas),
          //tmp_bc = tmp_style.getPropertyValue('background');
          //console.log("background is " + tmp_bc);
          //img.src = tmp_bc;
          img.src = 'css/pcanvas.jpg';

          //wp_req.send(obj_canvas.toDataURL("image/png"));
        }
    };

    // ------------------------------------------------------Private Methods ----------------------------------------------

    //Private method for (re)starting or resuming poem generation
    function go_poem(pnum, poem, id_timer1, id_timer2, reset) {

      //We empty live array array because we could be resuming and we don't want the array to grow
      live[pnum] = [];

      $.ajax({
          type: "GET",
          url: _list_poems[parseInt(pnum) - 1],
          dataType: "xml",
          success: function(xml) {
              var $parsed = $(xml);
              var $texto = $parsed.find("texto");

              //load element texto into 2 lists, poem (unchanging verso, ordem e taxon) and live (changing, verso and indentation)
              $texto.each(function() {
                  var $entry = $(this);
                  var verso = $entry.attr("verso");
                  var ordem = $entry.attr("ordem");
                  var taxon = $entry.attr("taxon");
                  poem.push(new Array(verso, ordem, taxon));
                  live[pnum].push(new Array(verso, 0));
              });

              //load element categorias into objs stored in DOM window dictionary
              var $cats = $parsed.find("categorias");
              $cats.contents().each(function(i, el) {
                  if (el.nodeType == 1) {
                      $element = $parsed.find(el.nodeName);
                      window[el.nodeName] = new Array();
                      $element.contents().each(function() {
                          var $elem = $(this);
                          elem = $.trim($elem.text());
                          if (elem.length > 0) window[el.nodeName].push(elem);
                      })
                  }
              });

              //load element audio into objs stored in DOM window dictionary
              var $audio = $parsed.find("audio");
              $audio.contents().each(function(i, el) {
                  if (el.nodeType == 1) {
                      $element = $parsed.find(el.nodeName);
                      window[el.nodeName] = new Array();
                      $element.contents().each(function() {
                          var $elem = $(this);
                          elem = $.trim($elem.text());
                          if (elem.length > 0) window[el.nodeName].push(elem);
                      })
                  }
              });

              //update live
              for (var i = 0; i < poem.length; i++) {
                  live[pnum][i][0] = count_initial_spaces(poem[i][0]);
                  live[pnum][i][1] = poem[i][0];
              }

              if (reset) {
                  //make div sizes and positions dynamic according to main window size
                  resize_window(null, pnum);
                  $(window).bind('resize', resize_window(null, pnum));

                  //show original poem
                  window["block_counter" + pnum] = window["block_counter" + pnum] + 1;
                  if (_first_mode != 1) {
                      for (var i = 0; i < live[pnum].length; i++) {
                          _type_mode == 0 ? add_vers_canvas(new Array(live[pnum][i][0], " "), pnum, i) : add_vers(new Array(live[pnum][i][0], " "), pnum, i);
                      }
                      //start poem animation
                      first_poem(poem, pnum, 0, 0, id_timer1, id_timer2);
                  } else {
                      for (var i = 0; i < live[pnum].length; i++) {
                          _type_mode == 0 ? add_vers_canvas(new Array(live[pnum][i][0], live[pnum][i][1]), pnum, i) : add_vers(new Array(live[pnum][i][0], live[pnum][i][1]), pnum, i);
                      }
                      timers[id_timer1] = setTimeout(main_task(poem, pnum, 0, id_timer1, id_timer2), _poem_speed);
                  }
              } else {
                  timers[id_timer1] = setTimeout(main_task(poem, pnum, 0, id_timer1, id_timer2), _poem_speed);
              }

              //init audio streams and load sounds array
              if (_has_audio) {
                  if (snd_running === undefined) {

                      typeof _sounds_origin !== 'undefined' ? snd_arr_a = create_array_from_url_sync(_sounds_origin + "/sndsa_index.txt") : snd_arr_a = window["snds_a"];
                      typeof _sounds_origin !== 'undefined' ? snd_arr_b = create_array_from_url_sync(_sounds_origin + "/sndsb_index.txt") : snd_arr_b = window["snds_b"];

                      audio1 = document.createElement('audio');
                      audio2 = document.createElement('audio');
                      //audio1 = document.getElementById('audio1');
                      //audio2 = document.getElementById('audio2');
                      $("#audio1").loop = false;
                      $("#audio2").loop = false;
                      $("#audio1").volume = .5;
                      $("#audio2").volume = .5;
                      snd_running = GRACEFUL;
                      Poemario.prototype.audio_start.call(this, 2000);
                  }
              }
          }
      });

    };

    //Private method for rendering first poem, before generation, in an aestheticaly appropriate way
    function first_poem(poem, pnum, lnum, typing_pos, id_timer1, id_timer2) {

        if (txt_running == STATEFUL) {
            saved_state.push(first_poem);
            saved_state.push([poem, pnum, lnum, typing_pos, id_timer1, id_timer2]);
            stop_timers();
            return;
        }

        switch (_type_mode) {
            case 0: //html canvas
                if (lnum >= live[pnum].length - 1) {
                    clearTimeout(timers[id_timer2]);
                    add_vers_canvas(live[pnum][lnum], pnum, lnum);
                    timers[id_timer1] = setTimeout(function() {
                        main_task(poem, pnum, 0, id_timer1, id_timer2)
                    }, _poem_speed);
                }
                //not last vers
                else {
                    add_vers_canvas(live[pnum][lnum], pnum, lnum);
                    timers[id_timer2] = setTimeout(function() {
                        first_poem(poem, pnum, lnum + 1, typing_pos, id_timer1, id_timer2)
                    }, _poem_speed);
                }
                break;
            case 1: //vers by vers
                //if last vers
                if (lnum >= live[pnum].length - 1) {
                    clearTimeout(timers[id_timer2]);
                    if (_flow_mode == 1) set_vers(live[pnum][lnum][1], pnum, lnum);
                    else add_vers(live[pnum][lnum], pnum, lnum);
                    timers[id_timer1] = setTimeout(function() {
                        main_task(poem, pnum, 0, id_timer1, id_timer2)
                    }, _poem_speed);
                }
                //not last vers
                else {
                    if (_flow_mode == 1) set_vers(live[pnum][lnum][1], pnum, lnum);
                    else add_vers(live[pnum][lnum], pnum, lnum);
                    timers[id_timer2] = setTimeout(function() {
                        first_poem(poem, pnum, lnum + 1, typing_pos, id_timer1, id_timer2)
                    }, _poem_speed);
                }
                break;
            default: //char by char
                typing_task(poem, pnum, 0, 0, id_timer1, id_timer2, true);
                break;
        }

    };

    //Private method for effectively stopping text generation
    function stop_timers() {
        for (var i = 0; i < timers.length; i++) clearTimeout(timers[i]);
    };

    //Private method for resuming text generation after stateful stop
    function resume_stateful() {
        if (saved_state.length > 0) {
            saved_state[0].apply(this, saved_state[1]);
            saved_state = [];
        }
    };

    //Private method for main cycle of poem generation
    function main_task(poem, pnum, typing_pos, id_timer1, id_timer2) {

        if (txt_running == GRACEFUL) return;
        if (txt_running == STATEFUL) {
            saved_state.push(main_task);
            saved_state.push([poem, pnum, typing_pos, id_timer1, id_timer2]);
            stop_timers();
            return;
        }

        //FIRST PHASE, work the lists
        //static length poem, replace on vers each time
        if (_flow_mode == 1) {
            //process random vers
            i = Math.floor(Math.random() * live[pnum].length)
            var empty_space = count_initial_spaces(poem[i][0]);
            var words = poem[i][0].trim().split(" ");
            var orders = poem[i][1].split(",");
            var taxons = poem[i][2].split(",");
            live[pnum][i][0] = empty_space;

            //process random word
            var j = Math.floor(Math.random() * orders.length);
            var taxons_list = window[taxons[j]];
            if (orders[0].length > 0 && taxons[0].length > 0) {
                words[orders[j] - 1] = taxons_list[Math.floor(Math.random() * taxons_list.length)];
                live[pnum][i][1] = words.join(" ");
            } else live[pnum][i][1] = poem[i][0];

        }
        //dynamic length poem, add one poem instance each time
        else {
            for (i = 0; i < poem.length; i++) {
                var empty_space = count_initial_spaces(poem[i][0]);
                var words = poem[i][0].trim().split(" ");
                var orders = poem[i][1].split(",");
                var taxons = poem[i][2].split(",");
                if (orders[0].trim().length > 0 && taxons[0].trim().length > 0) {
                    for (j = 0; j < orders.length; j++) {
                        var taxons_list = window[taxons[j]];
                        words[orders[j] - 1] = taxons_list[Math.floor(Math.random() * taxons_list.length)];
                    }
                }
                live[pnum][i][0] = empty_space;
                live[pnum][i][1] = words.join(" ");
            }
        }

        if (_flow_mode == 3) i = Math.floor(Math.random() * live[pnum].length);

        //SECOND PHASE, render display

        //text on canvas
        if (_type_mode == 0) {
            window["block_counter" + pnum] = window["block_counter" + pnum] + 1;
            i = Math.floor(Math.random() * live[pnum].length);
            add_vers_canvas(live[pnum][i], pnum, i);
            timers[id_timer1] = setTimeout(function() {
                main_task(poem, pnum, typing_pos, id_timer1, id_timer2)
            }, _poem_speed);
        }
        //static length poem, vers by vers
        else if ((_flow_mode == 1 || _flow_mode == 3) && _type_mode == 1) {
            set_vers(live[pnum][i][1], pnum, i);
            timers[id_timer1] = setTimeout(function() {
                main_task(poem, pnum, typing_pos, id_timer1, id_timer2)
            }, _poem_speed);
        }
        //dynamic length poem, vers by vers
        else if (_flow_mode == 2 && _type_mode == 1) {
            window["block_counter" + pnum] = window["block_counter" + pnum] + 1;
            for (i = 0; i < live[pnum].length; i++) {
                add_vers(live[pnum][i], pnum, i);
            }
            timers[id_timer1] = setTimeout(function() {
                main_task(poem, pnum, typing_pos, id_timer1, id_timer2)
            }, _poem_speed);
        }
        //static and dynamic length poem, char by char
        else {
            clearTimeout(timers[id_timer1]);
            typing_pos = 0;
            //static length poem
            if (_flow_mode == 1 || _flow_mode == 3) {
                set_vers("", pnum, i);
                timers[id_timer2] = setTimeout(function() {
                    typing_task(poem, pnum, i, typing_pos, id_timer1, id_timer2, false)
                }, _type_speed);
            }
            //dynamic length poem
            else {
                window["block_counter" + pnum] = window["block_counter" + pnum] + 1;
                for (i = 0; i < live[pnum].length; i++) {
                    add_vers(new Array(live[pnum][i][0], " "), pnum, i);
                }
                timers[id_timer2] = setTimeout(function() {
                    typing_task(poem, pnum, 0, typing_pos, id_timer1, id_timer2, false)
                }, _type_speed);
            }
        }

    };

    //Private method for rendering poems or verses one char at a time
    function typing_task(poem, pnum, lnum, typing_pos, id_timer1, id_timer2, is_initial) {

        if (txt_running == STATEFUL) {
            saved_state.push(typing_task);
            saved_state.push([poem, pnum, lnum, typing_pos, id_timer1, id_timer2, is_initial]);
            stop_timers();
            return;
        }

        //add one char to previously rendered text
        partial = live[pnum][lnum][1].substr(0, ++typing_pos);

        //if we have reached the end of the text to be rendered, we'll start new main_task
        if ((lnum >= live[pnum].length - 1 && typing_pos > live[pnum][lnum][1].length) || (typing_pos > live[pnum][lnum][1].length && _flow_mode == 1)) {
            //if first_poem we always print it whole
            if (is_initial && lnum < live[pnum].length - 1) {
                if (live[pnum][lnum][1].length == 0) set_vers("", pnum, lnum);
                timers[id_timer2] = setTimeout(function() {
                    typing_task(poem, pnum, lnum + 1, 0, id_timer1, id_timer2, is_initial)
                }, _poem_speed);
            } else {
                clearTimeout(timers[id_timer2]);
                set_vers(partial, pnum, lnum);
                timers[id_timer1] = setTimeout(function() {
                    main_task(poem, pnum, 0, id_timer1, id_timer2)
                }, _poem_speed);
            }
        } else {
            //we are still in the middle of a vers
            if (typing_pos <= live[pnum][lnum][1].length) {
                set_vers(partial, pnum, lnum);
                timers[id_timer2] = setTimeout(function() {
                    typing_task(poem, pnum, lnum, typing_pos, id_timer1, id_timer2, is_initial)
                }, _type_speed);
            }
            //we are going to start a new vers
            else {
                if (live[pnum][lnum][1].length == 0) set_vers("", pnum, lnum);
                timers[id_timer2] = setTimeout(function() {
                    typing_task(poem, pnum, lnum + 1, 0, id_timer1, id_timer2, is_initial)
                }, _type_speed);
            }
        }
    };

    //Private method for changing contents of named HTML paragraph
    function set_vers(line, pnum, lnum) {

        if (line.length > 0) {
            //show aggregated words as individual words
            var clean_line = line.replace(/_/g, " ");
            $("#pvers" + pnum + "-" + String(window["block_counter" + pnum]) + "-" + String(lnum)).text(clean_line);
            //we update scroll after every first char in a vers
            if (line.length == 1) scroll_bottom("#container" + pnum);
        }
        //render empty line as new line
        else $("#pvers" + pnum + "-" + String(window["block_counter" + pnum]) + "-" + String(lnum)).html("<BR>");

    };

    //Private method for changing contents of named text on canvas
    function set_vers_canvas(line, pnum, lnum) {
        //Probably won't be used
    };


    //Private method for adding named HTML paragraph
    function add_vers(arr, pnum, lnum) {

        $("#container" + pnum).append("<p id=\"pvers" + pnum + "-" + String(window["block_counter" + pnum]) + "-" + String(lnum) + "\" style=\"text-indent: " + arr[0] + "em;\" class=\"vers\"></p>");
        set_vers(String(arr[1]), pnum, lnum);
        scroll_bottom("#container" + pnum);
    };

    //Private method for adding named text on canvas
    function add_vers_canvas(arr, pnum, lnum) {
        var clean_line = arr[1].replace(/_/g, " ");
        var ctx = document.getElementById('canvas' + pnum).getContext('2d');

        if (_font_config.pixels == 0) pxs = String(Math.floor(Math.random() * (max_cfont - min_cfont)) + min_cfont) + 'px';
        else pxs = String(_font_config.pixels) + 'px';
        ctx.font = _font_config.style + " " + pxs + " " + _font_config.family;

        ctx.globalAlpha = _font_config.alpha;

        y = Math.floor(Math.random() * ($('#canvas' + pnum).height() - 1) + 1);
        x = Math.floor(Math.random() * ($('#canvas' + pnum).width() - 1) + 1);

        ctx.fillStyle = _font_config.color;
        var t_width = ctx.measureText(clean_line).width;
        //TODO: fix me: this is not really accurate. Saving 20 pixels as workaround
        if (x + t_width >= w_width) x = w_width - t_width - 20;
        ctx.fillText(clean_line, x, y);
    };


    //Private method for making sure we're at the bottom of the DIV hosting the poem(s)
    function scroll_bottom(container) {

        var scr = $(container)[0].scrollHeight;
        $(container).scrollTop(scr);
        if (DEBUG) console.log("scroll height is " + scr + " and scrolltop is " + $(container).scrollTop());
    };


    //Private method made HTML event handler to resizing windows. Making sure we adapt positions and sizes to context
    function resize_window(e, pnum) {
        w_height = $(window).height();
        w_width = $(window).width();

        $('#free-top').height(_top_pixels) + 'px';
        $('#free-top').width(w_width) + 'px';
        $("#free-top").parent().css({
            position: 'relative'
        });
        $("#free-top").css({
            top: 1,
            left: 1,
            position: 'absolute',
            "z-index": "1"
        });

        $('#container' + pnum).height(w_height - _top_pixels) + 'px';
        $('#container' + pnum).width(w_width / _num_poems) + 'px';
        $("#container" + pnum).parent().css({
            position: 'relative'
        });
        $("#container" + pnum).css({
            top: 1 + top_pixels,
            left: (pnum - 1) * (w_width / _num_poems),
            position: 'absolute',
            "z-index": "1"
        });

        if (_type_mode == 0) {
            $("#canvas" + pnum).attr('height', ($('#container' + pnum).height() - 20) + 'px');
            $("#canvas" + pnum).attr('width', ($('#container' + pnum).width() - 20) + 'px');
        } else scroll_bottom("#container" + pnum);
    };


    //Private method for counting prefix spaces in a string
    function count_initial_spaces(str) {

        var res = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charAt(i) == " ") res++;
            else break;
        }
        return res;
    };

    //Private method for generating an empty string with specified size. (currently unused)
    function empty_string(len) {
        len = Number(len);
        var str = "";
        for (var i = 0; i < len; i++) str += " ";
        return str;
    };

    //Private method for starting audio streams
    function go_audio() {

        if (DEBUG) console.log("AUDIO ALL: starting from scratch");
        snds_idx = Math.floor(Math.random() * snd_arr_a.length);
        audio1.setAttribute("src", snd_arr_a[snds_idx]);
        //audio1.addEventListener("loadedmetadata", function(){ duration = audio1.duration }, false);
        audio1.addEventListener("canplay", function() {
            if (snd_running == RUNNING) {
                if (DEBUG) console.log("AUDIO1: playing new");
                audio1.play()
            }
        }, false);
        audio1.addEventListener("ended", audio_func1 = function() {
            audio_again(1);
        }, false);

        snds_idx = Math.floor(Math.random() * snd_arr_b.length);
        audio2.setAttribute("src", snd_arr_b[snds_idx]);
        //audio2.addEventListener("loadedmetadata", function(){ duration = audio2.duration }, false );
        audio2.addEventListener("canplay", function() {
            if (snd_running == RUNNING) {
                if (DEBUG) console.log("AUDIO2: playing new");
                audio2.play()
            }
        }, false);
        audio2.addEventListener("ended", audio_func2 = function() {
            audio_again(2);
        }, false);

        audio1.load();
        audio2.load();

    }

    //Private function to change audio stream it has finished
    function audio_again(id) {

        switch (id) {

            case 1:
                if (DEBUG) console.log("AUDIO1: rescheduling");
                audio_tmr1 = setTimeout(function() {
                    snds_idx = Math.floor(Math.random() * snd_arr_a.length);
                    audio1.setAttribute("src", snd_arr_a[snds_idx]);
                    if (DEBUG) console.log("AUDIO1: loading new");
                    audio1.load();
                }, snd_freq);
                break;
            case 2:
                if (DEBUG) console.log("AUDIO2: rescheduling");
                audio_tmr2 = setTimeout(function() {
                    snds_idx = Math.floor(Math.random() * snd_arr_b.length);
                    audio2.setAttribute("src", snd_arr_b[snds_idx]);
                    if (DEBUG) console.log("AUDIO2: loading new");
                    audio2.load();
                }, snd_freq);
                break;
            default:
                console.log('weird thing happened in audio land!');
                break;
        }

    }

    //Private method for creating and filling array with the contents of a txt file with URL
    function create_array_from_url_sync(src_url) {
        var txt_array = [];
        var txt_url = new XMLHttpRequest;
        txt_url.open("GET", src_url, false);
        txt_url.send();
        txt_string = txt_url.responseText;
        txt_array = txt_string.split(/\r\n|\n/);

        if (txt_array[txt_array.length - 1] == "") {
            txt_array.pop()
        }
        return txt_array;
    }

    function validate_font_config(fc) {

      if (!'color' in fc) fc.color = 'black';

      if (!'family' in fc) fc.family = 'arial, sans-serif';

      if ('pixels' in fc) {
        var pattern = /(\d+)-(\d+)/;
        var match = pattern.exec(fc.pixels);

        if (match === null) {
          if (typeof fc.pixels != 'number' || fc.pixels < 0 || fc.pixels > 48) fc.pixels = 16;
        }
        else {
          if (match[1] >= match[2])
            fc.pixels = match[1];
          else {
            fc.pixels = 0;
            min_cfont = parseInt(match[1]);
            max_cfont = parseInt(match[2]);
          }
        }
      }
      else fc.pixels = 16;

      if ('style' in fc) {
        if (typeof fc.style !== 'string' || (fc.style != 'normal' && fc.style != 'bold' && fc.style != 'italic'))
          fc.style = 'normal';
      }
      else fc.style = 'normal';


      if ('alpha' in fc) {
        if (typeof fc.alpha !== 'number' || fc.alpha < 0 || fc.alpha > 1) fc.alpha = 1;
      }
      else fc.alpha = 1;

      return fc;

    }
}