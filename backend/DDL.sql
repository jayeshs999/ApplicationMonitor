DROP TABLE IF EXISTS Node CASCADE;
DROP TABLE IF EXISTS Groups CASCADE;
DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS NodeGroup CASCADE;
DROP TABLE IF EXISTS UserGroup CASCADE;
DROP TABLE IF EXISTS NodeAlert CASCADE;
DROP TABLE IF EXISTS Databases CASCADE;
DROP TABLE IF EXISTS DatabaseAlert CASCADE;
DROP TABLE IF EXISTS Sessions CASCADE;

CREATE TABLE Node (
   IP varchar(20),
   Name varchar(20),
   Primary key (IP)
);
 
CREATE TABLE Groups (
   Name varchar(20),
   Description varchar(500),
   Primary key (Name)
);
 
CREATE TABLE Users (
   username varchar(20),
   password varchar (20),
   Primary key (username)
);


 
CREATE TABLE NodeGroup (
   IP varchar(20),
   group_name varchar(20),
   Primary key (IP, group_name),
   Foreign Key (IP) references Node,
   Foreign Key (group_name) references Groups
);
 
CREATE TABLE UserGroup (
   username varchar(20),
   group_name varchar(20),
   Primary key (username, group_name),
   Foreign Key (username) references Users,
   Foreign Key (group_name) references Groups
);
 
CREATE TABLE Databases (
    database_id varchar(40) NOT NULL,
    IP varchar(20),
    name varchar(20),
    Primary Key (database_id),
    Foreign Key (IP) references Node
);

CREATE TABLE NodeAlert (
    AlertID int,
    username varchar(20),
    priority int CHECK(priority < 4),
    query varchar(500),
    threshold_low float NOT NULL,
    threshold_high float,
    type varchar(20) check(type in ('ABOVE', 'BELOW', 'IN_RANGE', 'OUT_OF_RANGE')),
    message varchar(500),
    Primary Key (AlertID, username),
    Foreign Key (username) references Users
);
 
CREATE TABLE DatabaseAlert (
    AlertID int,
    username varchar(20),
    priority int,
    query varchar(500),
    threshold_low float,
    threshold_high float,
    type varchar(20) check(type in ('ABOVE', 'BELOW', 'IN_RANGE', 'OUT_OF_RANGE')),
    message varchar(500),
    Primary Key (AlertID, username),
    Foreign Key (username) references Users
);
 
CREATE TABLE Sessions (
    SessionID varchar(64),
    username varchar(20),
    login_time TIMESTAMP,
    Primary Key (SessionID),
    Foreign Key (username) references Users
);
 
INSERT INTO Node VALUES ('1','Node1'),
('2','Node2'),
('3','Node3'),
('4','Node4'),
('5','Node5'),
('6','Node6'),
('7','Node7'),
('8','Node8'),
('9','Node9'),
('10','Node10');

INSERT INTO Groups VALUES ('Group1','Group1 Description'),
('Group2','Group2 Description'),
('Group3','Group3 Description'),
('Group4','Group4 Description'),
('Group5','Group5 Description');

INSERT INTO NodeGroup VALUES ('1','Group1'),
('2','Group1'),
('3','Group1'),
('4','Group1'),
('5','Group1'),
('6','Group1'),
('7','Group1'),
('8','Group1'),
('9','Group1'),
('10','Group1'),
('2','Group2'),
('3','Group2'),
('4','Group2'),
('2','Group3'),
('5','Group4'),
('6','Group4'),
('7','Group4'),
('8','Group5'),
('9','Group5'),
('10','Group5');

INSERT INTO Users VALUES ('admin','admin_password'),
('User1','User1_password'),
('User2','User2_password'),
('User3','User3_password'),
('User4','User4_password'),
('User5','User5_password');

INSERT INTO UserGroup VALUES ('admin','Group1'),
('User1','Group2'),
('User2','Group2'),
('User5','Group2'),
('User1','Group3'),
('User2','Group3'),
('User3','Group3'),
('User4','Group4'),
('User5','Group4'),
('User5','Group5');

INSERT INTO Databases VALUES ('1','1','Database1','Database1 Description'),
('2','1','Database2','Database2 Description'),
('3','2','Database3','Database3 Description'),
('4','2','Database4','Database4 Description'),
('5','2','Database5','Database5 Description'),
('6','3','Database6','Database6 Description'),
('7','3','Database7','Database7 Description'),
('8','4','Database8','Database8 Description'),
('9','5','Database9','Database9 Description'),
('10','5','Database10','Database10 Description'),
('11','5','Database11','Database11 Description'),
('12','6','Database12','Database12 Description'),
('13','6','Database13','Database13 Description'),
('14','6','Database14','Database14 Description'),
('15','6','Database15','Database15 Description'),
('16','7','Database16','Database16 Description'),
('17','7','Database17','Database17 Description'),
('18','7','Database18','Database18 Description'),
('19','7','Database19','Database19 Description'),
('20','7','Database20','Database20 Description'),
('21','8','Database21','Database21 Description'),
('22','8','Database22','Database22 Description'),
('23','9','Database23','Database23 Description'),
('24','9','Database24','Database24 Description'),
('25','10','Database25','Database25 Description'),
('26','10','Database26','Database26 Description');