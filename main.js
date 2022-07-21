$(function(){
  var quizData;
  var correct = 0;
  var appArea = $("#app");
  $(document).ready(function(){
    $.ajax({
      url: "",
      dataType: "json"
    }).done(function(data){
      quizData = data;
    });
  });

  $(document).ajaxComplete(function() {
    start();
  });

  function start() {
    var div = $("<div>");
    var select = $("<select>").attr("name", "selectlevel");
    var button = $("<button>").attr("class", "startbtn").append("スタート");
    var num = 1;

    $.each(quizData, function(index, value){
      var option = $("<option>").attr("value", index).append("レベル"+num++);
      select.append(option);
    });

    div.append(select).append(button);
    appArea.append(div);

    $(".startbtn").click(function(){
      var level = $("select[name=selectlevel]").val();
      appArea.empty();
      question(level);
    });
  }

  function question(level, step=1){
    var div = $("<div>").attr("class", "question");
    var p = $("<p>").append(quizData[level]["step"+step]["word"]);
    var Cdiv = $("<div>");

    $.each(quizData[level]["step"+step]["choices"], function(index, value){
      var label = $("<label>");
      var input = $("<input>").attr({
        type: "radio", 
        name: "choice",
        value: value
      })
      label.append(input).append(value);
      Cdiv.append(label);
    })

    div.append(p).append(Cdiv);
    Cdiv.attr("class", "actions");
    var button = $("<button>").attr("class", "nextbtn").append("解答する");
    Cdiv.append(button);

    var p = $("<p>").attr("class", "sec");
    div.append(Cdiv).append(p);
    appArea.append(div);

    var cnt = 10;
    var ele = $('.sec');
    var timerId;
    var countDown = function(){
      ele.text("残り回答時間" + cnt + "秒");
      timerId = setTimeout(countDown, 1000);

      if(--cnt < 0){
        clearTimeout(timerId);
        nextQuestion(level, step);
      }
    }
    countDown();

    $(".nextbtn").click(function(){ 
      clearTimeout(timerId);
      nextQuestion(level, step);
    });
  }

  function nextQuestion(level, step){
    var answer = quizData[level]["step"+step]["answer"];
    var choice = $('input[name="choice"]:checked').val();
    appArea.empty();

    if(answer == choice)
      correct++;

    if(quizData[level]["step" + (step+1)])
      question(level, ++step);
    else
      finish(Math.floor(correct / step * 100));
  }

  function finish(rate){
    var div = $("<div>").attr("class", "results");
    var h2 = $("<h2>").append("ゲーム終了");
    var p = $("<p>").append("正解率: " + rate + "%");
    var button = $("<button>").attr("class", "resetbtn").append("開始画面に戻る");
    div.append(h2).append(p).append(button);
    appArea.append(div);

    $(".resetbtn").click(function(){
      correct = 0;
      appArea.empty();
      start();
    });
  }
});