insert into users(nickname,email,password)
values
('太郎', 'taro@example.com', '$2b$10$wFi8RBzI3EpHt6XxqxLdLO41437B8RniV6ytM6NAACNPdFbjPj3je'),
('花子', 'hanako@example.com' , '$2b$10$OaDQnNzHPyS4RKihI3loxuCQPogfuBz5/WYDEtvBpV0B2FTR4l0MW'),
('Mike', 'mike@example.com'  , '$2b$10$migKeKnsy06FXJYlbWlW5eVDplNyvQDDGWmaqSHce88ceT1z3QGwm');


insert into notifications(title,notification) values
("通知タイトル１","通知内容１あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめも"),
("通知タイトル２","通知内容２あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめも"),
("通知タイトル３","通知内容３あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめも"),
("通知タイトル４","通知内容４あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめも"),
("通知タイトル５","通知内容５あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめも");

insert into user_notifications(user_id,notification_id,is_confirmed) values
(1,1,0),
(1,2,0),
(1,3,0),
(1,4,0);
