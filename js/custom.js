$(document).ready(function(){

  $(".eng_btn").click(function(){
      sendBasicStatement("http://adlnet.gov/expapi/verbs/selected", "selected", "English Track", "User selected " + "English Track")
      let videoHalfWay = 0;

    $("#english_video video").attr('autoplay',true);
    $(".video_player.eng_version").show();
    $(this).parents(".choose_lang_wrap").hide();

    // TODO loadedmetadata doesn't get called?
    $("#english_video video").on("loadedmetadata",function(){
        console.log("loadedmetadata");
        durationTime = Math.round($(this).duration);
        videoHalfWay = Math.round(durationTime/2);
        sendBasicStatement("http://adlnet.gov/expapi/verbs/completed", "initialized", "Video 1", "User initialized " + "Video 1" + " video.")
    });

    $("#english_video video").on("play",function(){

      sendBasicStatement("http://adlnet.gov/expapi/verbs/played", "played", "Video 1", "User played " + "Video 1" + " video.")
    });

    $("#english_video video").on("pause",function(){

      sendBasicStatement("http://adlnet.gov/expapi/verbs/paused", "paused", "Video 1", "User paused " + "Video 1" + " video.")
    });

    $("#english_video video").on("ended",function(){
      $(".btns_next_logo.eng_ver").show();
      $(".com_logo").removeClass("width100");
        sendBasicStatement("http://adlnet.gov/expapi/verbs/completed", "completed", "Video 1", "User completed " + "Video 1" + " video.")
    });

    $("#english_video video").on("timeupdate",function(){
        durationTime = Math.round($(this)[0].duration);
        videoHalfWay = Math.round(durationTime/2);

        currentTime = Math.round($(this)[0].currentTime);
        console.log("timeupdate: ", videoHalfWay, " : ", currentTime);
        let video = document.getElementById('english_video');
        // console.log($(this).duration);

        // // Halfway
        // if(currentTime === videoHalfWay){
        //     console.log("HALFWAY")
        //     sendBasicStatement("http://id.tincanapi.com/verb/watched", "watched", "Video 1", "User was able to watch half of "+ "Video 1" +" video.");
        // }
    });


    $(".btns_next_logo.eng_ver").click(function(){
      $(this).parents(".frames").removeClass("active");
      $(this).parents(".frames").next(".frames").addClass("active");
      $(".eng_qs_wrap").show();

      // Initialize the timer for first question
      questionStartTime = Date.now()
    });

  });

  $(".spanish_btn").click(function(){
      sendBasicStatement("http://adlnet.gov/expapi/verbs/selected", "selected", "Spanish Track", "User selected " + "English Track")


      $("#spanish_video video").attr('autoplay',true);
    $(".video_player.spanish_version").show();
    $(this).parents(".choose_lang_wrap").hide();
    
    $("#spanish_video video").on("ended",function(){
     $(".btns_next_logo.span_ver").show();
     $(".com_logo").removeClass("width100");
    });

    $(".btns_next_logo.span_ver").click(function(){
      $(this).parents(".frames").removeClass("active");
      $(this).parents(".frames").next(".frames").addClass("active");
      $(".sp_qs_wrap").show();
    });

  });
  
  $(".close-popup").click(function(){
    $(this).parents(".popwrap").hide();
  });

  $(".en-submit-btn").click(function(){
    var wrapid = $(".eng_qs_wrap .question_wrap.active").attr("id");
    var radioValue = $(".eng_qs_wrap .question_wrap.active").find("input[type=radio]:checked").val();
    
        if(!radioValue){
            $("#invalid_ans_popup").show();
        } else {
          // Correct answer
          if (radioValue == 1) {
              // Last question
            if (wrapid == "equestion5") {
               $(this).parents(".frames").removeClass("active");
               $(this).parents(".frames").next(".frames").addClass("active");
               $(".ethanku_wrap").show();

               // Send quiz results
               parseQuizResults()
            } else  {
              $("#en_correct_ans_popup").show();
                // Calculate the time spent as soon as we show correct popup
                if(questionStartTime) {
                    updateElapsedTime()
                }

                // Handle correct answer with xAPI
                parseQuestionAndUpdate()
                firstAttemptCorrect = true;
            }
              // Incorrect answer
          } else {
            $("#en_incorrect_ans_popup").show();
              // Calculate the time spent as soon as we show correct popup
              if(questionStartTime) {
                  updateElapsedTime()
              }

              // Handle correct answer with xAPI
              firstAttemptCorrect = false;
              parseQuestionAndUpdate()
          }
        }
   });



  $(".sp-submit-btn").click(function(){
    var wrapid = $(".sp_qs_wrap .question_wrap.active").attr("id");
    var radioValue = $(".sp_qs_wrap .question_wrap.active").find("input[type=radio]:checked").val();
    
        if(!radioValue){
            $("#invalid_ans_popup").show();
        } else {
          if (radioValue == 1) {
            if (wrapid == "squestion5") {
               $(this).parents(".frames").removeClass("active");
               $(this).parents(".frames").next(".frames").addClass("active");
               $(".sthanku_wrap").show();
            } else  {
              $("#sp_correct_ans_popup").show();
            }
          } else {
            $("#sp_incorrect_ans_popup").show();  
          }
        }
   });

    /**
     * If there is an active question and the user clicks continue (english)
     */
  $("#en_correct_ans_popup .continue-popup").click(function(){

    if ($(".question_wrap.active")[0]) {
      var wrapactive = $(".question_wrap.active");
      $("#en_correct_ans_popup").hide();
        $(wrapactive).removeClass("active");
        $(wrapactive).next(".question_wrap").addClass("active");
    }

    // Reset the timer after user clicks continue
    resetElapsedTime()
    
  });

  $("#sp_correct_ans_popup .continue-popup").click(function(){

    if ($(".question_wrap.active")[0]) {
      var wrapactive = $(".question_wrap.active");
      $("#sp_correct_ans_popup").hide();
        $(wrapactive).removeClass("active");
        $(wrapactive).next(".question_wrap").addClass("active");
    }
    
  });


});