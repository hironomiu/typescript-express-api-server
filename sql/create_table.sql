drop table users;
drop table notifications;
drop table user_notifications;

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `nickname` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
);

create table notifications(
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  title varchar(100) NOT NULL,
  notification text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

create table user_notifications(
  id int UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id int UNSIGNED NOT NULL,
  notification_id int UNSIGNED NOT NULL,
  is_confirmed int NOT NULL DEFAULT 1 comment '1:true,0:false',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`notification_id`) REFERENCES `notifications`(`id`)
);