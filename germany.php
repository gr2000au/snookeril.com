<?php
require_once('include_files/init.php');
$site_title = 'טיול לגרמניה';
require_once('include_files/start_html.php');
$db_link = Database::getConnection();
$all_cats_temp = [];
$stmt = $db_link->prepare("
                            SELECT *
                            FROM (
                                SELECT c.*, i.order AS i_order, i.name AS i_name, i.value, i.is_name_english, i.is_value_english, i.link
                                FROM categories c
                                LEFT JOIN items i
                                ON (i.category_id = c.id)
                                WHERE c.category_id = -1
                                UNION
                                SELECT c2.*, i.order AS i_order, i.name AS i_name, i.value, i.is_name_english, i.is_value_english, i.link
                                FROM categories c2
                                LEFT JOIN items i
                                ON (i.category_id = c2.id)
                                WHERE c2.category_id != -1
                            ) tbl
                            ORDER BY tbl.order, tbl.i_order
                          ");
$stmt->execute();
$result = $stmt->get_result();
while ($row = $result->fetch_object()) {
    $all_cats_temp[] = $row;
}
Util::makePre($all_cats_temp, '$all_cats_temp');
$all_cats = [];
$last_cat_id = '';
foreach ($all_cats_temp as $item) {
    if ($item->category_id != -1) {
        continue;
    }
    if ($item->id != $last_cat_id) {
        $all_cats[$item->id]['self'] = $item;
        $last_cat_id = $item->id;
    }
    $all_cats[$item->id]['items'][] = $item;
}
Util::makePre($all_cats, '$all_cats');
$all_cats_sub = [];
$last_cat_id = '';
foreach ($all_cats_temp as $item) {
    if ($item->category_id == -1) {
        continue;
    }
    if ($item->id != $last_cat_id) {
        $all_cats_sub[$item->id]['self'] = $item;
        $last_cat_id = $item->id;
    }
    $all_cats_sub[$item->id]['items'][] = $item;
}
foreach ($all_cats_sub as $sub_cat) {
    $all_cats[$sub_cat['self']->category_id]['sub_cat'][] = $sub_cat;
}
Util::makePre($all_cats, '$all_cats');
?>
<style>
    #screen-saver {
        display: none;
    }
    .category {
        margin-top: 10px;
        border-bottom: 1px solid #000000;
        display: flex;
        flex-wrap: wrap;
    }
    .category > div {
        display: flex;
        justify-content: center;
    }
    .category-title
    , .sub-category-title {
        text-align: center;
    }
    .category-title {
        font-size: 22px;
        border-bottom: 1px solid #000;
    }
    .sub-category {
        margin-top: 8px;
        /*border-top: 1px dotted #000000;*/
        display: flex;
        flex-wrap: wrap;
    }
    .sub-category > div {
        display: flex;
        justify-content: center;
    }
    .sub-category-title {
        font-size: 18px;
        color: red;
        border-bottom: 1px solid red;
    }
    .team {
        padding-right: 5px;
        padding-left: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px dotted #000000;
    }
    .team-player.eng {
        font-size: 15px;
    }
    .team-player.item {
        font-weight: normal;
    }
    .team-player.item.value {
        color: darkgreen;
    }
</style>
<div class="container-fluid">
    <div class="container main-container">
        <div class="row teams base-teams">
            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <h2 class="main-title constant-teams-title">טיול לגרמניה</h2>
            </div>
            <a href="tel:0506616555" target="_blank">התקשר</a>
        </div>
        <?php foreach ($all_cats as $cat) : ?>
            <div class="teams category">
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <h2 class="category-title"><?php echo $cat['self']->name; ?></h2>
                </div>
                <?php foreach ($cat['items'] as $item) : ?>
                    <?
                    Util::makePre($item, '$item');
                    ?>
                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6 team">
                        <div class="team-player item<?php if ($item->is_name_english) { echo ' eng'; } ?>">
                            <?php echo $item->i_name; ?>
                        </div>
                    </div>
                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6 team">
                        <div class="team-player item value<?php if ($item->is_value_english) { echo ' eng'; } ?>">
                            <?php if ($item->link == '') : ?>
                                <?php echo $item->value; ?>
                            <?php else : ?>
                                <?php echo '<a href="' . $item->link . '" target="_blank">' . $item->value . '</a>'; ?>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
                <?php if (isset($cat['sub_cat'])) : ?>
                    <?php foreach ($cat['sub_cat'] as $sub_cat) : ?>
                        <div class="sub-category">
                            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                <h2 class="sub-category-title"><?php echo $sub_cat['self']->name ?></h2>
                            </div>
                            <?php foreach ($sub_cat['items'] as $item) : ?>
                                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6 team">
                                    <div class="team-player item<?php if ($item->is_name_english) { echo ' eng'; } ?>">
                                        <?php echo $item->i_name; ?>
                                    </div>
                                </div>
                                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6 team">
                                    <div class="team-player item value<?php if ($item->is_value_english) { echo ' eng'; } ?>">
                                        <?php if ($item->link == '') : ?>
                                            <?php echo $item->value; ?>
                                        <?php else : ?>
                                            <?php echo '<a href="' . $item->link . '" target="_blank">' . $item->value . '</a>'; ?>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
    </div>
</div>
<?php require_once('include_files/end_html.php'); ?>
