REPLACE INTO `ocenter_hooks` (`id`, `name`, `description`, `type`, `update_time`, `addons`) VALUES
(72, 'homeIndex', '网站首页', 2, 1445828128, '');


alter table `ocenter_iexpression` drop column `from`,drop column `name`,drop column `uid`;
alter table `ocenter_iexpression` add `md5` varchar(32);


CREATE TABLE `ocenter_iexpression_link` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `iexpression_id` int(11) NOT NULL,
  `uid` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

