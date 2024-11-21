INSERT INTO public.users (id, "userId", "userName", "firstName", "lastName", email, phone, address, image, birthday, "lastSeen", "createdAt") VALUES
(1, 'U001', 'user1', 'First1', 'Last1', 'user1@example.com', '1234567891', 'Address 1', NULL, '1970-02-02', '2024-10-17', '2024-04-06'),
(2, 'U002', 'user2', 'First2', 'Last2', 'user2@example.com', '1234567892', 'Address 2', NULL, '1977-03-01', '2024-04-12', '2024-10-26'),
(3, 'U003', 'user3', 'First3', 'Last3', 'user3@example.com', '1234567893', 'Address 3', NULL, '1985-04-21', '2024-08-18', '2024-04-22'),
(4, 'U004', 'user4', 'First4', 'Last4', 'user4@example.com', '1234567894', 'Address 4', NULL, '1995-12-27', '2024-07-19', '2024-08-28'),
(5, 'U005', 'user5', 'First5', 'Last5', 'user5@example.com', '1234567895', 'Address 5', NULL, '1971-07-18', '2024-10-16', '2024-11-14'),
(6, 'U006', 'user6', 'First6', 'Last6', 'user6@example.com', '1234567896', 'Address 6', NULL, '1995-05-29', '2024-02-25', '2024-01-13'),
(7, 'U007', 'user7', 'First7', 'Last7', 'user7@example.com', '1234567897', 'Address 7', NULL, '1985-06-05', '2024-02-15', '2024-02-25'),
(8, 'U008', 'user8', 'First8', 'Last8', 'user8@example.com', '1234567898', 'Address 8', NULL, '1984-02-10', '2024-10-20', '2024-08-22'),
(9, 'U009', 'user9', 'First9', 'Last9', 'user9@example.com', '1234567899', 'Address 9', NULL, '1970-08-28', '2024-06-24', '2024-05-31'),
(10, 'U010', 'user10', 'First10', 'Last10', 'user10@example.com', '12345678910', 'Address 10', NULL, '1982-12-28', '2024-04-11', '2024-05-22'),
(11, 'U011', 'user11', 'First11', 'Last11', 'user11@example.com', '12345678911', 'Address 11', NULL, '2002-04-01', '2024-02-10', '2024-09-19'),
(12, 'U012', 'user12', 'First12', 'Last12', 'user12@example.com', '12345678912', 'Address 12', NULL, '1998-09-04', '2024-05-08', '2024-09-09'),
(13, 'U013', 'user13', 'First13', 'Last13', 'user13@example.com', '12345678913', 'Address 13', NULL, '1980-09-03', '2024-07-05', '2024-05-15'),
(14, 'U014', 'user14', 'First14', 'Last14', 'user14@example.com', '12345678914', 'Address 14', NULL, '2002-04-29', '2024-03-22', '2024-08-26'),
(15, 'U015', 'user15', 'First15', 'Last15', 'user15@example.com', '12345678915', 'Address 15', NULL, '1978-02-15', '2024-10-23', '2024-01-26'),
(16, 'U016', 'user16', 'First16', 'Last16', 'user16@example.com', '12345678916', 'Address 16', NULL, '2001-10-13', '2024-10-18', '2024-07-12'),
(17, 'U017', 'user17', 'First17', 'Last17', 'user17@example.com', '12345678917', 'Address 17', NULL, '1990-12-09', '2024-03-09', '2024-08-28'),
(18, 'U018', 'user18', 'First18', 'Last18', 'user18@example.com', '12345678918', 'Address 18', NULL, '1970-09-02', '2024-02-01', '2024-11-17'),
(19, 'U019', 'user19', 'First19', 'Last19', 'user19@example.com', '12345678919', 'Address 19', NULL, '1986-03-28', '2024-01-29', '2024-08-28'),
(20, 'U020', 'user20', 'First20', 'Last20', 'user20@example.com', '12345678920', 'Address 20', NULL, '1980-11-14', '2024-01-01', '2024-10-17');

INSERT INTO public.friend_invitations (id, status, "createdAt", "senderId", "receiverId") VALUES
(1, 'APPROVED', '2024-02-16', 14, 17),
(2, 'APPROVED', '2024-07-16', 2, 7),
(3, 'PENDING', '2024-06-20', 6, 9),
(4, 'PENDING', '2024-08-03', 16, 13),
(5, 'REJECTED', '2024-04-05', 9, 13),
(6, 'PENDING', '2024-10-23', 20, 13),
(7, 'PENDING', '2024-04-03', 9, 1),
(8, 'PENDING', '2024-08-14', 17, 14),
(9, 'APPROVED', '2024-04-01', 8, 18),
(10, 'REJECTED', '2024-09-24', 4, 19),
(11, 'REJECTED', '2024-05-28', 9, 6),
(12, 'REJECTED', '2024-09-16', 13, 6),
(13, 'REJECTED', '2024-08-24', 9, 5),
(14, 'PENDING', '2024-05-24', 3, 2),
(15, 'PENDING', '2024-10-27', 17, 9),
(16, 'APPROVED', '2024-09-25', 5, 17),
(17, 'REJECTED', '2024-05-25', 11, 19),
(18, 'REJECTED', '2024-08-20', 5, 3),
(19, 'APPROVED', '2024-05-02', 5, 14),
(20, 'PENDING', '2024-05-10', 2, 5);

INSERT INTO public.friends (id, "createdAt", "userId", "friendId") VALUES
(1, '2024-05-16', 10, 16),
(2, '2024-06-20', 12, 15),
(3, '2024-11-19', 7, 19),
(4, '2024-10-04', 3, 4),
(5, '2024-02-01', 15, 12),
(6, '2024-11-10', 2, 18),
(7, '2024-09-16', 8, 17),
(8, '2024-09-12', 17, 10),
(9, '2024-06-04', 17, 13),
(10, '2024-11-19', 14, 4),
(11, '2024-10-03', 10, 19),
(12, '2024-11-01', 13, 18),
(13, '2024-09-02', 9, 18),
(14, '2024-06-29', 8, 9),
(15, '2024-09-23', 10, 3),
(16, '2024-09-30', 6, 1),
(17, '2024-03-02', 12, 17),
(18, '2024-09-17', 15, 7),
(19, '2024-11-02', 20, 6),
(20, '2024-04-27', 3, 10);

INSERT INTO public.gifts (id, title, description, link, price, currency, "endDate", image, "createdAt", "userId") VALUES
(1, 'Gift 1', 'Description 1', 'http://example.com/1', 104.00, 'USD', '2024-08-01', NULL, '2024-04-10', 2),
(2, 'Gift 2', 'Description 2', 'http://example.com/2', 37.00, 'USD', '2024-12-14', NULL, '2024-11-02', 5),
(3, 'Gift 3', 'Description 3', 'http://example.com/3', 196.00, 'USD', '2024-11-01', NULL, '2024-08-26', 3),
(4, 'Gift 4', 'Description 4', 'http://example.com/4', 12.00, 'USD', '2024-08-28', NULL, '2024-07-05', 15),
(5, 'Gift 5', 'Description 5', 'http://example.com/5', 231.00, 'USD', '2024-11-03', NULL, '2024-03-19', 20),
(6, 'Gift 6', 'Description 6', 'http://example.com/6', 424.00, 'USD', '2024-08-10', NULL, '2024-03-26', 2),
(7, 'Gift 7', 'Description 7', 'http://example.com/7', 102.00, 'USD', '2024-10-03', NULL, '2024-03-02', 1),
(8, 'Gift 8', 'Description 8', 'http://example.com/8', 343.00, 'USD', '2024-09-12', NULL, '2024-02-20', 19),
(9, 'Gift 9', 'Description 9', 'http://example.com/9', 341.00, 'USD', '2024-01-02', NULL, '2024-08-24', 16),
(10, 'Gift 10', 'Description 10', 'http://example.com/10', 435.00, 'USD', '2024-09-24', NULL, '2024-09-13', 12),
(11, 'Gift 11', 'Description 11', 'http://example.com/11', 122.00, 'USD', '2024-07-12', NULL, '2024-01-22', 16),
(12, 'Gift 12', 'Description 12', 'http://example.com/12', 128.00, 'USD', '2024-07-24', NULL, '2024-11-14', 20),
(13, 'Gift 13', 'Description 13', 'http://example.com/13', 441.00, 'USD', '2024-02-12', NULL, '2024-04-17', 2),
(14, 'Gift 14', 'Description 14', 'http://example.com/14', 417.00, 'USD', '2024-03-30', NULL, '2024-05-09', 20),
(15, 'Gift 15', 'Description 15', 'http://example.com/15', 407.00, 'USD', '2024-05-09', NULL, '2024-11-08', 14),
(16, 'Gift 16', 'Description 16', 'http://example.com/16', 325.00, 'USD', '2024-10-20', NULL, '2024-02-20', 4),
(17, 'Gift 17', 'Description 17', 'http://example.com/17', 64.00, 'USD', '2024-05-08', NULL, '2024-07-27', 2),
(18, 'Gift 18', 'Description 18', 'http://example.com/18', 270.00, 'USD', '2024-01-15', NULL, '2024-01-31', 1),
(19, 'Gift 19', 'Description 19', 'http://example.com/19', 279.00, 'USD', '2024-08-06', NULL, '2024-06-23', 5),
(20, 'Gift 20', 'Description 20', 'http://example.com/20', 62.00, 'USD', '2024-11-02', NULL, '2024-10-27', 5);

INSERT INTO public.gifts_payments (id, amount, currency, source, "createdAt", "giftId", "userId") VALUES
(1, 337.00, 'USD', 'Payment Source 1', '2024-04-05', 7, 8),
(2, 96.00, 'USD', 'Payment Source 2', '2024-01-18', 19, 18),
(3, 386.00, 'USD', 'Payment Source 3', '2024-06-16', 10, 4),
(4, 141.00, 'USD', 'Payment Source 4', '2024-07-16', 10, 10),
(5, 498.00, 'USD', 'Payment Source 5', '2024-08-26', 13, 16),
(6, 180.00, 'USD', 'Payment Source 6', '2024-06-23', 3, 1),
(7, 235.00, 'USD', 'Payment Source 7', '2024-06-14', 11, 16),
(8, 16.00, 'USD', 'Payment Source 8', '2024-05-17', 9, 12),
(9, 113.00, 'USD', 'Payment Source 9', '2024-07-30', 1, 10),
(10, 328.00, 'USD', 'Payment Source 10', '2024-03-15', 12, 19),
(11, 65.00, 'USD', 'Payment Source 11', '2024-01-15', 19, 10),
(12, 370.00, 'USD', 'Payment Source 12', '2024-10-21', 3, 18),
(13, 17.00, 'USD', 'Payment Source 13', '2024-07-10', 17, 13),
(14, 356.00, 'USD', 'Payment Source 14', '2024-03-10', 18, 18),
(15, 368.00, 'USD', 'Payment Source 15', '2024-07-07', 6, 5),
(16, 72.00, 'USD', 'Payment Source 16', '2024-10-14', 5, 16),
(17, 282.00, 'USD', 'Payment Source 17', '2024-10-18', 11, 11),
(18, 251.00, 'USD', 'Payment Source 18', '2024-03-11', 15, 14),
(19, 411.00, 'USD', 'Payment Source 19', '2024-11-18', 1, 1),
(20, 96.00, 'USD', 'Payment Source 20', '2024-08-14', 6, 8);