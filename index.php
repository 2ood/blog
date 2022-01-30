<!DOCTYPE html>
<html lang="kr" dir="ltr">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="html/css/main.css"/>
    <link rel="stylesheet" href="html/css/post.css"/>
    <link rel="shortcut icon" href="html/flight_takeoff.svg"/><!-- from google fonts-->
    <title>2OOD'S BLOG</title>
  </head>
  <body>
    <!--<div id="loading"><br></div>-->
    <div id="top_bar"></div><!--.top_bar-->
    <script src="html/script/module/top_bar.js"></script>
    <div id="content">
        <div class="head">
          <h1 id="title">lorem</h1>
          <h6 class="grayscale-font" id="writer">2ood</h6>
          <h6 class="grayscale-font" id="last-update">2022-01-01</h6>
        </div><!--.head-->
        <div id="md">
          <?php
          $Parsedown = new Parsedown();

          echo $Parsedown->text('# kyungmin');
           ?>
        </div><!--#md-->
    </div><!--.content-->
    <span id="to_top"></span>
    <script src="html/script/module/to_top.js"></script>
    <footer></footer>
    <script src="html/script/module/footer.js"></script>
    <script src="html/script/main.js"></script>
    <script src="html/script/post.js"></script>
  </body>
</html>
