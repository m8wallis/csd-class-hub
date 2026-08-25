<?php
/* Template Name: Events */
get_header(); ?>
<style type="text/css">#wrapper{width:100vw;height:100vh;} iframe{border-radius:0 !important;}</style>
<div class="hero mbsm30">
	<div class="leftgrad desktop-only" style="background:linear-gradient(to bottom,#C67B69,#1281AC)"><span style="background:#C67B69"></span></div>
	<div class="img overlay relative">
		<img src="<?php bloginfo('url'); ?>/wp-content/uploads/2022/01/3eb1b43e1ff794641c1ed159bd298ee4.jpg" alt="people sitting at tables" class="imgcover">
	</div>
	<div class="text-center relative">
		<h1 class="white mb50 mbsm30 fade1">Events</h1>
		<div class="text-center fade2">
			<a href="https://makerschurch.churchcenter.com/calendar" target="_blank" class="btn mrmd30 mbsm30">Church Calendar</a>
			<br class="mobile-only">
			<a href="<?php bloginfo('url'); ?>/manifesto/" class="btn light white">Visit</a>
		</div>
	</div>
</div>
<div class="row mb50">
	<div class="col-md-6 desktop-only"></div>
	<div class="col-md-6">
		<h1 class="orange mb30 plsm15">Upcoming<br>Events</h1>
		<div class="linein orangebg partsm"></div>
	</div>
</div>
<div class="container">
	<div class="row justcent">
<?php
$ch = curl_init();
curl_setopt($ch,CURLOPT_HTTPHEADER,array('Authorization: Basic Yjc4NjRlNzg5NjNjOTA1OTg5NjJkMzkzMTJhMjhkYzhkNWJlMDZiZjJkNDZhZmQ4MjE5ZTVjZTNhZTI1YmVhOToyM2IxZDdiMGMyYzNhZjM4NThkZmExYWQxOWU0NTUxNzcxMTExNWU1M2E0Y2NiYzIxZDBkNTUyMmZmZDc0MDIz'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$next = "https://api.planningcenteronline.com/registrations/v2/events?filter=future,active&per_page=100";
$events = array();
$indexes = array();
$i = 90000000;
while(!empty($next)){
	curl_setopt($ch,CURLOPT_URL,$next);
	$res = curl_exec($ch);
	$data = json_decode($res,true);
	foreach($data["data"] as $e){
		$a = $e["attributes"];
		if($a["link_only"]){
			continue;
		}
		if(!empty($a["event_time_summary"])){
			$ind = floatval(date("Ymd.Hi",strtotime((!empty($a["hide_at"])?$a["hide_at"]:$a["event_time_summary"]))));
			if(!empty($events[$ind])){
				$ind += 0.0001;
			}
		}
		else{
			$ind = $i;
		}
		$indexes[] = $ind;
		$events[strval($ind)] = array(
			"img" => $a["logo_url"],
			"name" => $a["name"],
			"date" => $a["event_time_summary"],
			"desc" => $a["description"],
			"url" => $a["public_url"],
			"featured" => $a["featured"]
		);
		$i++;
	}
	$next = $data["links"]["next"];
}
sort($indexes,SORT_NUMERIC);
$featured = array();
foreach($events as $b=>$a){
	if(!empty($a["featured"])){
		$featured[$b] = $a;
		unset($events[$b]);
	}
}
foreach($featured as $b=>$a):
	if(empty($a["name"])){
		continue;
	}
?>
		<div class="col-lg-4 col-md-6 mb50">
			<div class="lightbox">
				<img src="<?php echo $a["img"]; ?>" alt="<?php echo $a["name"]; ?> image" style="margin:-30px -30px 30px;width:calc(100% + 60px);max-width:initial">
				<h3 class="garamond orange2 text-center-sm"><?php echo $a["name"]; ?></h3>
				<?php if(!empty($a["date"])): ?>
				<h4 class="text-center-sm"><?php echo $a["date"]; ?></h4>
				<?php endif; ?>
				<div class="descover"><?php echo $a["desc"]; ?></div>
				<p class="m0 text-center-sm" style="margin-top:20px !important">
					<a href="#" class="btn light descbtn mb15">Read <span class="more">More</span><span class="less">Less</span></a>
					<a href="<?php echo $a["url"]; ?>" target='_blank' class="btn">Learn More</a>
				</p>
			</div>
		</div>
<?php
endforeach;
foreach($indexes as $i):
	$a = $events[strval($i)];
	if(empty($a["name"])){
		continue;
	}
?>
		<div class="col-lg-4 col-md-6 mb50">
			<div class="lightbox">
				<img src="<?php echo $a["img"]; ?>" alt="<?php echo $a["name"]; ?> image" style="margin:-30px -30px 30px;width:calc(100% + 60px);max-width:initial">
				<h3 class="garamond orange2 text-center-sm"><?php echo $a["name"]; ?></h3>
				<?php if(!empty($a["date"])): ?>
				<h4 class="text-center-sm"><?php echo $a["date"]; ?></h4>
				<?php endif; ?>
				<div class="descover"><?php echo $a["desc"]; ?></div>
				<p class="m0 text-center-sm" style="margin-top:20px !important">
					<a href="#" class="btn light descbtn mb15">Read <span class="more">More</span><span class="less">Less</span></a>
					<a href="<?php echo $a["url"]; ?>" target='_blank' class="btn">Learn More</a>
				</p>
			</div>
		</div>
<?php endforeach; ?>
	</div>
</div>
<?php get_footer(); ?>



<!-- https://makerschurch.churchcenter.com/registrations/events/3758680 -->