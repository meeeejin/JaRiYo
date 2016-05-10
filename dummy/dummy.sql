DELIMITER $$
DROP PROCEDURE IF EXISTS myFunction$$
CREATE PROCEDURE myFunction()
BEGIN
	DECLARE i INT DEFAULT 1;
	DECLARE j INT DEFAULT 1;

	# insert parkinglot data
	INSERT INTO ParkingLot (parkinglot_name, total_floor)
	VALUE ('서수원 이마트', 3);

	INSERT INTO ParkingLot (parkinglot_name, total_floor)
    VALUE ('북수원 홈플러스', 4);

    # insert parking floor data
	WHILE (i <= 3) DO 
		INSERT INTO ParkingFloor (total_space, empty_space, floor_num, parkinglot_id)
		VALUE (320, 320, i, 1);
		SET i = i + 1;
	END WHILE;

	SET i = 1;

	WHILE (i <= 4) DO 
		INSERT INTO ParkingFloor (total_space, empty_space, floor_num, parkinglot_id)
		VALUE (400, 400, i, 2);
		SET i = i + 1;
	END WHILE;
END$$

DELIMITER ;
CALL myFunction();
