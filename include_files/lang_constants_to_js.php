<?php
//Util::makePre($lang_constants);
?>
<script>
    var lang_const = new Object();
    lang_const['gen'] = new Object();
    <?php foreach ($lang_constants_more as $lang_key=>$const) : ?>
        lang_const['gen']['<?php echo $lang_key; ?>'] = '<?php echo $const; ?>';
    <?php endforeach; ?>
    lang_const['general'] = new Object();
    lang_const['general']['he-IL'] = new Object();
    <?php foreach ($he_IL_constants_general as $lang_key=>$const) : ?>
    lang_const['general']['he-IL']['<?php echo $lang_key; ?>'] = '<?php echo $const; ?>';
    <?php endforeach; ?>
    lang_const['general']['en-US'] = new Object();
    <?php foreach ($en_US_constants_general as $lang_key=>$const) : ?>
    lang_const['general']['en-US']['<?php echo $lang_key; ?>'] = '<?php echo $const; ?>';
    <?php endforeach; ?>
    lang_const['more'] = new Object();
    lang_const['more']['he-IL'] = new Object();
    <?php foreach ($he_IL_constants_more as $lang_key=>$const) : ?>
        lang_const['more']['he-IL']['<?php echo $lang_key; ?>'] = '<?php echo $const; ?>';
    <?php endforeach; ?>
    lang_const['more']['en-US'] = new Object();
    <?php foreach ($en_US_constants_more as $lang_key=>$const) : ?>
        lang_const['more']['en-US']['<?php echo $lang_key; ?>'] = '<?php echo $const; ?>';
    <?php endforeach; ?>
</script>
