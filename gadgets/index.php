<?php

$gadget = $_SERVER['QUERY_STRING'];
$content = simplexml_load_file($gadget)->xpath("/Module/Content");
echo "<script>gadgets = window.top.gadgets; wave = window.top.wave; emulator = window.top.emulator;</script>";
echo $content[0];
echo "<script>emulator.onLoad()</script>";

?>
