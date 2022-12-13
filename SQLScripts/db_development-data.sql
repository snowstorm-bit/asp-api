INSERT INTO `users` (`id`, `username`, `email`, `password`, `access_level`, `createdAt`, `updatedAt`)
VALUES (2, 'utilisateur a', 'a@asp.ca', '$2b$12$8byvnL6i0qCE4O3PwaMbT.PUVX5BBDYDJF.fm3TaHcteLm4aGPpZ.', 1,
        '2022-12-01 17:58:56', '2022-12-08 19:51:20'),
       (3, 'utilisateur b', 'b@asp.ca', '$2b$12$/WyWx1hMr4RPIXl/5MGzs.sIgfHBmK0eFfCbunvT3FE/bW2x.iLNW', 1,
        '2022-12-02 17:36:59', '2022-12-02 17:36:59'),
       (4, 'utilisateur c', 'c@asp.ca', '$2b$12$BfeICNKcqEzeviEVUeAu0.B4ld1PuHzmfv5XUNDceR4GnC.JWeagW', 1,
        '2022-12-02 17:37:16', '2022-12-02 17:37:16'),
       (5, 'utilisateur d', 'd@asp.ca', '$2b$12$hsn2Dh6C9nabw9NBavU.7elsylScWOtO.98YUKf4VT1k7ZzlW/2yK', 1,
        '2022-12-02 17:37:25', '2022-12-02 17:37:25'),
       (6, 'utilisateur e', 'e@asp.ca', '$2b$12$GNr.cdjso6CcdZvcugi1d.5/ZmzuH6H89Pm6p5O/aeNn1oqZ5YBmO', 2,
        '2022-12-05 08:52:39', '2022-12-05 08:52:39');

INSERT INTO `places` (`id`, `title`, `description`, `steps`, `latitude`, `longitude`, `user_id`, `createdAt`,
                      `updatedAt`)
VALUES (1, 'Lieu a',
        'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33',
        'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33',
        10, 10, 2, '2022-12-01 17:59:11', '2022-12-05 15:04:43'),
       (2, 'Lieu b', 'description', 'directives', 50, 50, 3, '2022-12-01 17:59:30', '2022-12-01 17:59:30'),
       (3, 'Lieu c', 'description', 'directives', 32, 92, 4, '2022-12-01 17:59:47', '2022-12-01 17:59:47'),
       (4, 'Lieu d', 'description', 'steps', -50, -20, 5, '2022-12-01 18:25:33', '2022-12-01 18:25:33'),
       (5, 'Lieu e', 'description', 'steps', -20, -50, 6, '2022-12-01 18:25:33', '2022-12-01 18:25:33'),
       (6, 'Lieu f', 'description', 'steps', -20, -50, 1, '2022-12-01 18:25:33', '2022-12-01 18:25:33');

INSERT INTO `climbs` (`id`, `title`, `description`, `style`, `difficulty_level`, `images`, `place_id`, `user_id`,
                      `createdAt`, `updatedAt`)
VALUES (1, 'Grimpe a',
        'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33',
        'traditional', '5.60', 'AZgtk.jpg', 1, 2, '2022-12-01 18:01:43', '2022-12-01 18:01:43'),
       (2, 'Grimpe b', 'Description', 'traditional', '5.70', 'balloons.jpg', 2, 2, '2022-12-01 18:05:52',
        '2022-12-01 18:05:52'),
       (3, 'Grimpe c', 'Description', 'traditional', '5.80', 'compress-jpeg-online.jpg', 2, 2, '2022-12-01 18:11:16',
        '2022-12-01 18:11:16'),
       (4, 'Grimpe d', 'Description', 'traditional', '5.90', 'daylily-flower-and-buds-sharp.jpg', 3, 3,
        '2022-12-01 18:29:15', '2022-12-01 18:29:15'),
       (5, 'Grimpe e', 'description', 'traditional', '5.10', 'AZgtk.jpg;compress-jpeg-online.jpg', 3, 3,
        '2022-12-01 18:53:54', '2022-12-05 13:25:06'),
       (6, 'Grimpe f', 'Description', 'sport', '5.11', 'daylily-flower-and-buds-sharp.jpg', 3, 3, '2022-12-01 19:41:44',
        '2022-12-01 19:41:44'),
       (7, 'Grimpe g', 'description', 'sport', '5.12', 'compress-jpeg-online.jpg', 4, 4, '2022-12-01 19:42:24',
        '2022-12-01 19:42:24'),
       (8, 'Grimpe h', 'Description', 'sport', '5.13', 'balloons.jpg', 4, 4, '2022-12-01 19:43:19',
        '2022-12-01 19:43:19'),
       (9, 'Grimpe i', 'Description', 'sport', '5.14', 'compress-jpeg-online.jpg', 4, 4, '2022-12-01 19:44:06',
        '2022-12-01 19:44:06'),
       (10, 'Grimpe j', 'Description', 'sport', '5.15', 'AZgtk.jpg', 4, 5, '2022-12-01 19:44:50',
        '2022-12-01 19:44:50'),
       (11, 'Grimpe k', 'Description', 'top_roping', '5.60', 'balloons.jpg', 5, 5, '2022-12-01 19:45:42',
        '2022-12-01 19:45:42'),
       (12, 'Grimpe l', 'Description', 'top_roping', '5.70', 'daylily-flower-and-buds-sharp.jpg', 5, 5,
        '2022-12-01 19:46:12', '2022-12-01 19:46:12'),
       (13, 'Grimpe m', 'Description', 'top_roping', '5.80', 'daylily-flower-and-buds-sharp.jpg', 5, 6,
        '2022-12-01 19:46:12', '2022-12-01 19:46:12'),
       (14, 'Grimpe n', 'Description', 'top_roping', '5.90', 'daylily-flower-and-buds-sharp.jpg', 5, 6,
        '2022-12-01 19:46:12', '2022-12-01 19:46:12'),
       (15, 'Grimpe o', 'Description', 'top_roping', '5.10', 'daylily-flower-and-buds-sharp.jpg', 5, 6,
        '2022-12-01 19:46:12', '2022-12-01 19:46:12'),
       (16, 'Grimpe p', 'description', 'sport', '5.11', 'Top-Roping-1.jpg', 6, 1, '2022-12-01 18:25:33',
        '2022-12-01 18:25:33');

INSERT INTO `user_rates` (`user_id`, `climb_id`, `rate`)
VALUES (2, 1, 1),
       (3, 2, 1),
       (4, 2, 1),
       (5, 3, 1),
       (6, 4, 1),
       (1, 5, 3);

COMMIT;
