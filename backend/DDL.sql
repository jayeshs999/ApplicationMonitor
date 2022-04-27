DROP TABLE IF EXISTS Node CASCADE;
DROP TABLE IF EXISTS Groupings CASCADE;
DROP TABLE IF EXISTS Usr CASCADE;
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
 
CREATE TABLE Groupings (
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
   Name varchar(20),
   Primary key (IP),
   Foreign Key (IP) references Node,
   Foreign Key (Name) references Groupings
);
 
CREATE TABLE UserGroup (
   username varchar(20),
   name varchar(20),
   Primary key (username),
   Foreign Key (username) references Usr,
   Foreign Key (name) references Groupings
);
 
CREATE TABLE Databases (
    IP varchar(20),
    database_id varchar(40) NOT NULL,
    name varchar(20),
    Description varchar(500),
    Primary Key (IP, database_id),
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
    Foreign Key (username) references Usr
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
    Foreign Key (username) references Usr
);
 
CREATE TABLE Sessions (
    SessionID varchar(64),
    username varchar(20),
    login_time TIMESTAMP,
    Primary Key (SessionID),
    Foreign Key (username) references Usr
);
 
 
