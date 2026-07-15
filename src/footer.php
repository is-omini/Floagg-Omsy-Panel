</main>
<script>
function timeUpdateFun() {
	const date = new Date()
	const pad = (n) => n.toString().padStart(2, '0')
    let dateToString = `${pad((date.getDate()))}/${pad((date.getMonth() + 1))}/${pad(date.getFullYear())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
	document.getElementById('timestamp').textContent = dateToString

	setTimeout(timeUpdateFun, 30000)
}
Omsy.event.event.load['OmsyTime'] = timeUpdateFun
</script>
</body>
</html>
<?php die(); ?>
<?php include "dash_header.php"; ?>
<?php if(isset($userSoldes)): ?>
<section class="header-dashbord">
	<div class="head">
		<div class="title">
			<span class="user-solde">
				Solde
				<span class="num">
					<?= number_format(($userSoldes['total_user'] - $userSoldes['total_retrait_user']) / 100, 2) ?> €
				</span>
			</span>
			<p>La somme de votre soldes disponibles, dons sont soustrait vos retrait et les commission de services. <a href="/dashboard/payments">Voir plus</a></p>
		</div>
	</div>
</section>
<?php endif; ?>
<section class="dashboard-grid dashboard-grid-x3">
	<div class="item">
		<div class="item-content">
			<span class="name">Solde</span>
			<span class="content"><?= number_format(($userSoldes['total_user'] - $userSoldes['total_retrait_user']) / 100, 2) ?> €</span>
		</div>
	</div>
	<div class="item">
		<div class="item-content">
			<span class="name">Dons</span>
			<span class="content"><?= number_format(($userSoldes['total_don']) / 100, 2) ?> €</span>
		</div>
	</div>
	<div class="item">
		<div class="item-content">
			<span class="name">Vue de profile</span>
			<span class="content"><?= count(__OmsySql->execute('SELECT ID FROM omsy_session WHERE page LIKE ? ORDER BY ID DESC', ['%@'.htmlentities(__OmsyAccounts->username).'%'])->fetchAll()) ?></span>
		</div>
	</div>
	<div class="item">
		<div class="item-content">
			<span class="name">Visite de lien</span>
			<span class="content"><?= $userSoldes['stat']['total'] ?></span>
		</div>
	</div>
</section>
<section class="dashboard-grid dashboard-grid-x2">
	<div class="item">
		<div class="item-head">
			<span class="name">Dernier don</span>
		</div>
		<div class="item-content">
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
			tempor incididunt ut labore et dolore magna aliqua.</p>
			<ul>
				<?php
				$i = 0;
				foreach ($userSoldes['data'] as $value):
					if($i >= 5) break;
					if ($value['status'] !== 'succeeded') continue;
					$i++;
				?>
				<li class="space-between">
					<span><?= $value['uuid_'] ?></span>
					<span>
						+ <?= number_format( ($value['amount_app'] / 100), 2 ) ?> €
					</span>
				</li>
				<?php endforeach; ?>
			</ul>
		</div>
	</div>
	<div class="item">
		<div class="item-head">
			<span class="name">Newsletter</span>
		</div>
		<div class="item-content">
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
			tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
			quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
			consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
			cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
			proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>
	</div>
</section>
<?php include "dash_footer.php"; ?>