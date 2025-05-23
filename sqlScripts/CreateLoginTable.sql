USE OnboardingSystemDB;

CREATE TABLE LoginDetails (
  UserId int IDENTITY(1,1) NOT NULL PRIMARY KEY,
  Username nvarchar(50) NOT NULL,
  CONSTRAINT UQ_Username UNIQUE(Username), 
  Pass nvarchar(80) NOT NULL,
  Email nvarchar(255) NOT NULL,
  UserType nvarchar(100) NOT NULL,
)