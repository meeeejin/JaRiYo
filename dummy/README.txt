* Dummy data 입력 방법 *
(app.js의 테이블 생성 코드로 테이블까지는 생성된 상태여야 함)

1. MySQL 서버 켜기

2. 터미널 커맨드로 각자 MySQL에 로그인
	$ mysql -uroot -pqwer1234

3. 데이터베이스 jariyo 사용하기
	$ use jariyo

4. dummy.sql, node.txt, edge.txt, parkingspace.txt가 저장된 경로를 "/Users/ahnmijin/"라고 했을 때,
	다음과 같이 4개의 데이터 생성 쿼리 보내기 (순서 지켜야함! & 각자 파일 경로로 수정해서 아래 쿼리 작성)

	$ source /Users/ahnmijin/dummy.sql;
	$ load data local infile '/Users/ahnmijin/node.txt' into table Node fields terminated by '\t';
	$ load data local infile 'edge.txt' into table Edge fields terminated by '\t';
	$ load data local infile 'parkingspace.txt' into table ParkingSpace fields terminated by '\t';

	==> source 쿼리는 sql 파일을 실행시켜주는 쿼리
	==> load 쿼리는 특정 파일의 데이터를 읽어와서 특정 테이블의 데이터로 저장해주는 쿼리
	==> source 쿼리 내에서 load 쿼리를 실행시킬 수가 없어서 부득이하게 따로 쿼리 날려줘야함

5. 4번까지 완료하면 모든 테이블에 dummy data 생성 완료됨
	$ select * from [table이름]
	으로 확인 가능