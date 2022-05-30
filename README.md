# Student-Management-System
In this project we have developed a web application in which we are required to digitalized simple paper grading system of school in order to achieve better overview and management of the test results and the overall performance of every student. Furthermore, it will also allow teachers and students to communicate more effectively. So, this new system has an effective user rights management system in place, as well as various views for different user roles.
This student management system’s main focus is to implement simple and fast method for teachers to manage their student’s results and some export capabilities to obtain a summary of assessments and subjects for both students and teachers. In addition, a simple communication message system has been built.
There are three different users (Admin, Student and Teacher) in this system. Admin has all type of access e.g., admin can add, delete, edit and access each and every type of data in the system. Whenever new user wants to get access of this system, admin will create his/her account and allow access according to their roles.
We have use CRUD Rest APIs for the communication between frontend and backend. User can easily access their data from database from frontend.

Objectives:
Basic Requirements:
Web application needs database for storing data, backend for processing the data, then a web service application programming interface for providing the data and a frontend for displaying the data.

Database:
There is no extra storage (such as files or online storage) is needed as all data is store in the database. The passwords are stored in encrypted form in the database and the frontend does not communicates directly with databases.

Backend:
The backend will be accessed from frontend using API’s and it manage all communication with the database.

Web Service API:
In this project, data will be delivered from databases to frontend with the help of API and provide the user input from frontend for processing the data in the backend. If the access of API is failed so it will return some meaningful error message e.g., HTTP status code.
Frontend:
There are three different type of frontend interfaces for every user category. User can access their portal after successful logging in with their credentials. User will belong to one of the roles: Admin, Teacher and Student.

Admin:
It provides system management which consist of:
• Users’ management
• Classes management
• Subject management

Teacher:
It provides management of tests and subject selection
• Test management
• Selection of assigned subjects.

Student:
It provides an overview about subjects and tests.

Demonstration:
• 1 admin
• 2 classes, whereof each has at least:
• 3 subjects, whereof at least 1 has 0 tests and another 1 has 3 tests
• 4 pupils
• 1 pupil, which is not assigned to any class
• 3 teachers, whereof at least:
• 1 is assigned to 0 subjects
• 1 is assigned to subjects of at least 2 different classes and at least 2 different subjects of 1 class
• A meaningful messaging application for both Teacher and Student users with specified rights.

![image](https://user-images.githubusercontent.com/70126786/170975915-a9b217b5-927b-401e-b4f7-c3d91701f995.png)
![image](https://user-images.githubusercontent.com/70126786/170975975-03744b6c-ca53-4850-a8f1-7e89ff8568d3.png)
![image](https://user-images.githubusercontent.com/70126786/170976034-22e2c013-c575-4fa4-b5f1-63eb6deacd02.png)
![image](https://user-images.githubusercontent.com/70126786/170976057-b6b5ca19-7c74-4ae6-8dd0-b268a2d9c194.png)
![image](https://user-images.githubusercontent.com/70126786/170976076-9f5b436f-802a-48ca-bc7f-359c35057127.png)
![image](https://user-images.githubusercontent.com/70126786/170976088-54ee5227-f4c0-4d69-b3b0-9417598388ab.png)
![image](https://user-images.githubusercontent.com/70126786/170976102-7f5c90f9-0eb4-4a81-9627-7d72633c7c23.png)
![image](https://user-images.githubusercontent.com/70126786/170976113-4c11d42c-336b-45d9-9ebb-420d8c573252.png)
![image](https://user-images.githubusercontent.com/70126786/170976262-273468cf-49b0-4f1f-849c-a62207750027.png)
![image](https://user-images.githubusercontent.com/70126786/170976276-e5daee60-4ac1-4ea1-869c-47488fe38105.png)

