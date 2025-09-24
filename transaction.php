<?php
exit();
require_once('include_files/util.php');
require_once('models/Database.php');
$document_root = $_SERVER['DOCUMENT_ROOT'];
$document_root_arr = explode('/', $document_root);
$document_root_last = $document_root_arr[count($document_root_arr) - 1];
Util::$server_directory = 'servers_directory/' . $document_root_last . '/';
require_once(Util::$server_directory . 'configuration.php');
error_reporting(E_ALL);
ini_set('display_errors', 1);
$db_link = Database::getConnection();
$stmt = $db_link->prepare("
                            UPDATE `snooker`.`uris`
                            SET `content_he`='משחק סנוקר, ניהול קבוצות, הגדרת שחקנים, תוצאות, פריימים ועוד.<br /><br />
                            עם ההתחברות למערכת ניתן להגדיר שמות שחקנים עבור כל קבוצה, כך שהקבוצות ייטענו בכל פעם שהמשתמש יתחבר למערכת, זאת על ידי כפתור \"הגדרת קבוצות קבועות\". ניתן לשנות גם את שמות הקבוצות בלחיצה על שם הקבוצה.<br />
                            תוכל לשנות את הקבוצות באופן זמני כראות עיניך בעזרת כפתור \"שינוי קבוצות\". <br />
                            לאחר פתיחת חלון המשחק יוצגו הקבוצות עם לוח תוצאות כללי למעלה ולוח תוצאות לפריים נוכחי למטה.<br />
                            עליך לבחור את השחקנים שישחקו כל אחד בתורו ולאחר סיבוב ראשון המערכת תציג בעצמה את השחקן הבא לאחר לחיצה על כפתור \"שיחקתי\".<br />
                            עדכון תוצאה על ידי לחיצה על הכדור בעל הערך המתאים. הקבוצה שהשחקן שלה משחק כרגע תזכה במספר הנקודות.<br />
                            במקרה של עבירה יש ללחוץ על \"שיחקתי\" על מנת שהתור יעבור לקבוצה היריבה ואז ללחוץ על הכדור המתאים שיזכה אותה בערך של העבירה.<br />
                            במקרה של לחיצה על כדור לא נכון ניתן לתקן על ידי כפתור \"ביטול הוספה\".<br />
                            בכל מקרה ניתן ללחוץ על התוצאה עצמה ולהזין כל ערך עבור אותה קבוצה.<br />
                            בסיום הפריים יש לוודא שהתוצאה מעודכנת כך שהמערכת תעניק נקודה לקבוצה המנצחת בתוצאה הכללית-למעלה.<br />
                            עם החחלת פריים חדש תישאל האם לשמור על אותו סדר שחקנים וכך תימנע מלהזין שוב את כל השחקנים.'
                            WHERE  `id`=1
                        ");
//$stmt->bind_param('sss', $user_team_a, $user_team_b, $user_name);
$stmt->execute();
//$stmt->close();
//$db_link->commit();
?>
