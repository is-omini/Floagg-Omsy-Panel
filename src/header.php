<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Floagg Admin</title>
	<link rel="icon" type="image/svg+xml" href="/favicon.svg">

	<script type="text/javascript" src="/share/lib/omsyJS/main.js"></script>
	<script src="/share/lib/floagg_panel/src/omsyConsole.js"></script>
	<script src="/share/lib/floagg_panel/src/main.js"></script>

	<link rel="stylesheet" type="text/css" href="/share/lib/floagg_panel/src/min.css">
	<link rel="stylesheet" type="text/css" href="/share/lib/floagg_panel/src/main.css">
	<link rel="stylesheet" type="text/css" href="/share/lib/floagg_panel/src/kit.css">

	<script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script>
</head>
<body>
<header class="top-bar flex-items-center space-between">
	<div class="left">
		<ul>
			<li>
				<a href="/">
					<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-200h156v-234h168v234h156v-360L480-742 240-560v360Zm-28 28v-402l268-203 268 203v402H536v-234H424v234H212Zm268-299Z"/></svg>
				</a>
			</li>
			<li>
				<a onclick="history.back();">
					<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m276.85-460 231.69 231.69L480-200 200-480l280-280 28.54 28.31L276.85-500H760v40H276.85Z"/></svg>
				</a>
			</li>
			<li>
				<a onclick="window.location.reload();">
					<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M483.08-200q-117.25 0-198.63-81.34-81.37-81.34-81.37-198.54 0-117.2 81.37-198.66Q365.83-760 483.08-760q71.3 0 133.54 33.88 62.23 33.89 100.3 94.58V-760h40v209.23H547.69v-40h148q-31.23-59.85-87.88-94.54Q551.15-720 483.08-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h42.46Q725.08-310.15 651-255.08 576.92-200 483.08-200Z"/></svg>
				</a>
			</li>
		</ul>
	</div>
	<div class="right">
		<ul>
			<?php foreach ($this->getTopRightMenu() as $value): ?>
			<li>
				<a href="<?= $value['url'] ?>">
					<span class="icon"><?= $value['icon'] ?></span>
				</a>
			</li>
			<?php endforeach; ?>
		</ul>
	</div>
</header>
<header class="bottom-bar space-between">
	<div class="left">
		<ul>
		</ul>
	</div>
	<div class="right">
		<ul>
			<li>
				<a href="#" class="progress-id-izebvezbn" style="padding-right: calc(var(--size-base) * 2);">
					<span class="icon">
						<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M602-315 466-451v-193h28v182l127 127-19 20ZM466-720v-80h28v80h-28Zm254 254v-28h80v28h-80ZM466-160v-80h28v80h-28ZM160-466v-28h80v28h-80Zm320.17 334q-72.17 0-135.73-27.39-63.56-27.39-110.57-74.35-47.02-46.96-74.44-110.43Q132-407.65 132-479.83q0-72.17 27.39-135.73 27.39-63.56 74.35-110.57 46.96-47.02 110.43-74.44Q407.65-828 479.83-828q72.17 0 135.73 27.39 63.56 27.39 110.57 74.35 47.02 46.96 74.44 110.43Q828-552.35 828-480.17q0 72.17-27.39 135.73-27.39 63.56-74.35 110.57-46.96 47.02-110.43 74.44Q552.35-132 480.17-132Zm-.17-28q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
					</span>
					<span class="text progress-message" id="timestamp"></span>
				</a>
			</li>
		</ul>
	</div>
</header>
<header class="left-bar">
	<div class="top-menu">
		<div class="userinfo">
			<div class="avatar">
				<img src="<?= $this->getAvatar() ?>" width="64px" height="64px" style="object-fit: cover;">
			</div>
			<div class="info">
				<span class="username w700"><?= __OmsyAccounts->username ?></span>
				<span class="sub_username">
					<?php if(__OmsyAccounts->user_mail): ?>
					<?= __OmsyAccounts->user_mail ?>
					<?php else: ?>
					<?= __OmsyMain->GFunction->convertDate(__OmsyAccounts->last_login) ?>
					<?php endif; ?>
				</span>
			</div>
		</div>
		<div class="menu-plugins">
			<?php foreach ($this->getMap() as $nameButton => $listes): ?>
			<?php if(isset($nameButton) && $nameButton !== 'null') : ?>
			<li class="sepp-head"><?= $nameButton ?></li>
			<?php endif; ?>
			<?php foreach($listes as $button): ?>
			<li
				class="<?php if(isset($Args[1]) && $Args[1] == 'payments') echo 'open focus'; ?>">
				<a class="categorie-button w700"
					onclick="this.parentNode.classList.toggle('focus')"
					<?php if((isset($button['sub']) && count($button['sub']) <= 0) || !isset($button['sub'])) : ?>
					href="<?= $button['url'] ?>"
					<?php endif; ?>
				>
					<div class="left">
						<span class="icon"><?= $button['icon'] ?></span>
						<span class="text"><?= $button['name'] ?></span>
					</div>
					<?php if(isset($button['sub']) && count($button['sub']) > 0) : ?>
					<div class="icon-open">
						<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-373.85 303.85-550h352.3L480-373.85Z"/></svg>
					</div>
					<?php endif; ?>
				</a>
				<?php if(isset($button['sub']) && count($button['sub']) > 0) : ?>
				<ol class="sub_menu">
					<?php foreach($button['sub'] as $ksbtn => $sbtn): ?>
					<?php if(isset($ksbtn) && $ksbtn !== 'null') : ?>
					<li class="sepp-head"><?= $ksbtn ?></li>
					<?php endif; ?>
					<?php foreach($sbtn as $sub_button): ?>
					<li class="<?php if(isset($Args[2]) && $Args[2] == 'information' && $Args[1] == 'profile') echo 'focus'; ?>">
						<a href="<?= $sub_button['url'] ?>">
							<span class="text"><?= $sub_button['name'] ?></span>
						</a>
					</li>
					<?php endforeach; ?>
					<?php endforeach; ?>
				</ol>
				<?php endif; ?>
			</li>
			<?php endforeach; ?>
			<?php endforeach; ?>
		</div>
	</div>
	<div class="bottom-menu">
		<div id="publishChangeButton-contenaire" style="display: ;">
			<button id="publishChangeButton">
				<span class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M224.62-160q-27.62 0-46.12-18.5Q160-197 160-224.62V-360h40v135.38q0 9.24 7.69 16.93 7.69 7.69 16.93 7.69H360v40H224.62Zm510.76 0H600v-40h135.38q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93V-360h40v135.38q0 27.62-18.5 46.12Q763-160 735.38-160ZM160-735.38q0-27.62 18.5-46.12Q197-800 224.62-800H360v40H224.62q-9.24 0-16.93 7.69-7.69 7.69-7.69 16.93V-600h-40v-135.38Zm640 0V-600h-40v-135.38q0-9.24-7.69-16.93-7.69-7.69-16.93-7.69H600v-40h135.38q27.62 0 46.12 18.5Q800-763 800-735.38ZM481.54-271.54q13.31 0 22.42-9.11 9.12-9.12 9.12-22.43 0-13.3-9.12-22.42-9.11-9.12-22.42-9.12-13.31 0-22.42 9.12-9.12 9.12-9.12 22.42 0 13.31 9.12 22.43 9.11 9.11 22.42 9.11Zm-20.62-132.23h38.39q1.54-25.54 9.92-42 8.39-16.46 32.31-40.38 30.38-30.39 41.88-51.12 11.5-20.73 11.5-46.11 0-46.31-31.3-75.7-31.31-29.38-80.54-29.38-39.23 0-69.46 19.84-30.24 19.85-47 57.08l36.76 15.46q10.85-25.23 31.5-40.19 20.66-14.96 46.66-14.96 32.84 0 53.81 18.96 20.96 18.96 20.96 49.58 0 18.46-9.12 34.81-9.11 16.34-31.34 36.11-29.93 28.23-42.43 52.15-12.5 23.93-12.5 55.85Z"/></svg>
				</span>
				<span class="text">Sauvegarder</span>
			</button>
		</div>
	</div>
</header>
<script>
const menuScroll = document.querySelector('header.left-bar .menu-plugins')
menuScroll.addEventListener('scroll', () => {
	if(menuScroll.scrollTop > 32) menuScroll.parentNode.classList.add('scrolling')
	if(menuScroll.scrollTop < 32) menuScroll.parentNode.classList.remove('scrolling')
})
</script>
<main>