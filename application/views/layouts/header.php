<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8"/>
	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"/>
	<title>.:: IC Payment | <?php echo ucfirst($title); ?> ::.</title>
	<link rel="stylesheet" href="<?php echo base_url('assets/css/secundaryCss.min.css?version=beta-3.5.1') ?>" />
	<link rel="stylesheet" href="<?php echo base_url('assets/css/5-others/square/frontend.min.css?version=beta-3.5.1') ?>"/>
 	<link rel="stylesheet" href="<?php echo base_url('assets/css/main.min.css?version=beta-3.5.1') ?>"/>
	<script type="text/javascript" src="<?php echo base_url('assets/js/min/head.bundle.js?version=beta-3.5.1') ?>"></script>
	<link rel="icon" type="image/png" sizes="96x96" href="<?php  echo base_url('/favicon-96x96.png')?>">
	<link rel="manifest" href="<?php  echo base_url('/manifest.json')?>">

</head>
<?php $user_data = get_user_data(); 
	$notifications = $this->report_model->count_moras_view();
?>
<?php 
	//get_manifest();
?>
<body>
	<div class="loader">
		<span class="load"></span>
	</div>
	<header>
		<div class="header-low">
			 
			<div class="brand">
				<a href="">
						<i class="material-icons brand__menu">menu</i>
					</a>
				<a href="<?php echo base_url() ?>">
					<h3>IC<span>Payment</span></h3>
				</a>
			</div>
			<nav class="top-nav">
				<li class="navButton hidden-xs"><a href="<?php echo base_url('app/admin/home') ?>">Lobby</a></li>
				<li class="navButton hidden-xs"><a class="<?php if($title == 'clientes')  echo " active "?>" href="<?php echo base_url('app/admin/clientes') ?>">Clientes</a></li>
				<li class="navButton hidden-xs"><a class="<?php if($title == 'servicios') echo " active " ?>" href="<?php echo base_url('app/admin/servicios') ?>">Servicios</a></li>
				<li class="navButton hidden-xs"><a class="<?php if($title == 'contratos') echo " active " ?>" href="<?php echo base_url('app/admin/contratos') ?>">Contratos</a></li>

				<?php if(auth_user_type(0)): ?>
				<li class="navButton hidden-xs"><a class="<?php if($title == 'secciones') echo " active " ?>" href="<?php echo base_url('app/admin/secciones') ?>">Secciones</a></li>
				<li class="navButton hidden-xs"><a class="<?php if($title == 'reportes') echo " active "?>" href="<?php echo base_url('app/admin/reportes') ?>">Reportes</a></li>
				<?php endif; ?>
			</nav>
			<div class="user-div ">
				<nav class="user-controls hidden-xs">
					<li class="navButton">
						<a href="<?php echo base_url('app/admin/notificaciones')?>" data-toggle="tooltip" data-placement="bottom" title="Notificaciones">
						<i class="material-icons">notifications</i>
					</a>
						<?php if ($notifications > 0): ?>
						<span class="badge"><?php echo $notifications ;?></span>
						<?php endif; ?>
					</li>
					<li class="navButton">
						<a href="" data-toggle="modal" data-target="#retire-money-modal" data-placement="bottom" title="Caja Chica">
						<i class="material-icons">add_shopping_cart</i>
					</a></li>
					<li class="navButton">
						<a href="" data-target="#new-averia-modal" data-toggle="modal" data-placement="bottom" title="Averias">
						<i class="material-icons">assignment</i>
					</a></li>
					<li class="navButton">
            <a href="" data-toggle="modal" data-target="#send-message-modal" data-placement="bottom" title="Mensajes">
            <i class="material-icons">perm_phone_msg</i>
          </a></li>

				</nav>
				<div class="dropdown mymenu">
					<a id="dLabel" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
						<span class="user-name"><?php echo $user_data['name'];?></span>
						<div class="profile-picture">
							<span><?php echo $user_data['name'][0].$user_data['lastname'][0] ?></span>
						</div>
						<span class="caret"></span>
					</a>

					<?php echo $tooltip; ?>
				</div>

			</div>
		</div>
	</header>